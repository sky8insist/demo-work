import type { AppSession, PersistedRecord, MorningHandoff } from "./types";
import { isDue } from "./scheduling";
export { nextOccurrence } from "./scheduling";

const DB_NAME = "last30_v2", STORE = "records", ACTIVE_KEY = "last30_session_v2", OLD_KEY = "last30_session_v1";
export const defaultSession: AppSession = { stage: "ENTRY", mode: null, closureText: "", emotionText: "", inputType: "text", closure: null, choices: {}, reminderTime: "08:00", windDownEndsAt: null, captures: [], emotionRetention: null, emotionSummary: null, demoMorning: false, dataNotice: null };
export function loadSession(): AppSession {
  try { const current = localStorage.getItem(ACTIVE_KEY); if (current) return { ...defaultSession, ...JSON.parse(current) }; if (localStorage.getItem(OLD_KEY)) localStorage.removeItem(OLD_KEY); } catch { /* safe fallback */ }
  return defaultSession;
}
export function saveSession(session: AppSession) { try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(session)); } catch { /* private mode */ } }
export function clearSession() { localStorage.removeItem(ACTIVE_KEY); }
function openDb(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "id" }); }; request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
function transaction<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore, done: (value: T) => void) => void): Promise<T> { return openDb().then((db) => new Promise<T>((resolve, reject) => { const tx = db.transaction(STORE, mode); let result: T; run(tx.objectStore(STORE), (value) => { result = value; }); tx.oncomplete = () => { db.close(); resolve(result); }; tx.onerror = () => { db.close(); reject(tx.error); }; })); }
export const saveRecord = (record: PersistedRecord) => transaction<void>("readwrite", (store, done) => { store.put(record); done(); });
export const updateRecord = saveRecord;
export const getRecord = (id: string) => transaction<PersistedRecord | undefined>("readonly", (store, done) => { const request = store.get(id); request.onsuccess = () => done(request.result); });
export const getRecords = () => transaction<PersistedRecord[]>("readonly", (store, done) => { const request = store.getAll(); request.onsuccess = () => done(request.result || []); });
export async function getRecordsByKind<K extends PersistedRecord["kind"]>(kind: K) { return (await getRecords()).filter((record): record is Extract<PersistedRecord, { kind: K }> => record.kind === kind); }
export async function getRecordsByDate(date: Date) { const day = date.toLocaleDateString("en-CA"); return (await getRecords()).filter((record) => new Date(record.createdAt).toLocaleDateString("en-CA") === day); }
export async function getLatestClosure() { return (await getRecordsByKind("closure")).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null; }
export async function getLatestEmotion() { return (await getRecordsByKind("emotion")).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null; }
export const deleteRecord = (id: string) => transaction<void>("readwrite", (store, done) => { store.delete(id); done(); });
export async function loadMorningHandoff(now = new Date(), includeFuture = false): Promise<MorningHandoff> {
  const [closure, emotion] = await Promise.all([getLatestClosure(), getLatestEmotion()]);
  const closureReady = closure && closure.status !== "consumed" && (includeFuture || isDue(closure.scheduledFor, now));
  const emotionReady = emotion && emotion.status !== "released" && emotion.status !== "consumed" && Boolean(emotion.revealAt) && (includeFuture || isDue(emotion.revealAt, now));
  if (closureReady && closure.status === "scheduled") await updateRecord({ ...closure, status: "ready" });
  if (emotionReady && emotion.status === "sealed") await updateRecord({ ...emotion, status: "ready" });
  return { closure: closureReady ? { ...closure, status: "ready" } : null, emotion: emotionReady ? { ...emotion, status: "ready" } : null };
}
