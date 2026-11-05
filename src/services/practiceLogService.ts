import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { PracticeLogItem } from '../types/practiceLog';
import { INITIAL_PRACTICE_LOGS } from '../data/initialPracticeLogs';

const COLLECTION_NAME = 'practice_logs';
const LOCAL_STORAGE_KEY = 'chiangmai_medical_practice_logs';

export const practiceLogService = {
  // Subscribe to real-time updates from Firestore
  subscribeToLogs(
    onData: (logs: PracticeLogItem[]) => void,
    onError?: (err: any) => void
  ) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const logs: PracticeLogItem[] = snapshot.docs.map((d) => ({
              ...(d.data() as PracticeLogItem),
              id: d.id,
            }));
            onData(logs);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
            } catch (e) {
              // ignore storage errors
            }
          } else {
            // First time seeding if database is empty
            this.seedInitialData().then((seeded) => {
              onData(seeded);
            });
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot error, falling back to local cache:', error);
          if (onError) onError(error);
          // Fallback to local storage or initial
          const cached = this.getLocalCache();
          onData(cached.length > 0 ? cached : INITIAL_PRACTICE_LOGS);
        }
      );
    } catch (error) {
      console.warn('Failed to subscribe to Firestore, using offline cache:', error);
      const cached = this.getLocalCache();
      onData(cached.length > 0 ? cached : INITIAL_PRACTICE_LOGS);
      return () => {};
    }
  },

  // Save new log
  async saveLog(log: PracticeLogItem): Promise<void> {
    const logId = log.id || `log-${Date.now()}`;
    const cleanLog: PracticeLogItem = {
      ...log,
      id: logId,
      updatedAt: new Date().toISOString(),
      createdAt: log.createdAt || new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, COLLECTION_NAME, logId), cleanLog);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${logId}`);
    }

    // Always keep local cache updated
    const local = this.getLocalCache();
    const updated = [cleanLog, ...local.filter((l) => l.id !== logId)];
    this.setLocalCache(updated);
  },

  // Update existing log
  async updateLog(log: PracticeLogItem): Promise<void> {
    const cleanLog: PracticeLogItem = {
      ...log,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, COLLECTION_NAME, log.id), cleanLog, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${log.id}`);
    }

    // Local cache update
    const local = this.getLocalCache();
    const updated = local.map((l) => (l.id === log.id ? cleanLog : l));
    this.setLocalCache(updated);
  },

  // Delete log
  async deleteLog(logId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, logId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${logId}`);
    }

    // Local cache update
    const local = this.getLocalCache();
    const updated = local.filter((l) => l.id !== logId);
    this.setLocalCache(updated);
  },

  // Seed initial demo logs if database is pristine
  async seedInitialData(): Promise<PracticeLogItem[]> {
    try {
      for (const item of INITIAL_PRACTICE_LOGS) {
        await setDoc(doc(db, COLLECTION_NAME, item.id), item);
      }
      return INITIAL_PRACTICE_LOGS;
    } catch (e) {
      console.warn('Seeding to Firestore skipped or failed:', e);
      return INITIAL_PRACTICE_LOGS;
    }
  },

  getLocalCache(): PracticeLogItem[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return INITIAL_PRACTICE_LOGS;
  },

  setLocalCache(logs: PracticeLogItem[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      // ignore
    }
  },
};
