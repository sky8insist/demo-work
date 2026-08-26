import type { AppSession } from "./types";
const DB_NAME = "last30_v2",
  STORE = "records",
  ACTIVE_KEY = "last30_session_v2",
  OLD_KEY = "last30_session_v1";
export const defaultSession: AppSession = {
  stage: "ENTRY",
  mode: null,
  closureText: "",
  emotionText: "",
  inputType: "text",
  closure: null,
  choices: {},
  reminderTime: "08:00",
  windDownEndsAt: null,
  captures: [],
  emotionRetention: null,
  emotionSummary: null,
  demoMorning: false,
};
export function loadSession(): AppSession {
  try {
    const current = localStorage.getItem(ACTIVE_KEY);
    if (current) return { ...defaultSession, ...JSON.parse(current) };
    if (localStorage.getItem(OLD_KEY)) localStorage.removeItem(OLD_KEY);
  } catch {
    /* safe fallback */
  }
  return defaultSession;
}
export const saveSession = (session: AppSession) =>
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(ACTIVE_KEY);
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function saveRecord(record: Record<string, unknown>) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
