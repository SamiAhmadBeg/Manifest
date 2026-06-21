const DB_NAME = 'manifest-movies'
const DB_VERSION = 1
const STORE = 'movies'

export type StoredMovie = {
  id: string
  name: string
  blob: Blob
  addedAt: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const store = tx.objectStore(STORE)
        const request = fn(store)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
        tx.oncomplete = () => db.close()
        tx.onerror = () => reject(tx.error)
      }),
  )
}

export function loadAllMovies(): Promise<StoredMovie[]> {
  return runTransaction('readonly', (store) => store.getAll())
}

export function saveMovie(movie: StoredMovie): Promise<void> {
  return runTransaction('readwrite', (store) => store.put(movie)).then(
    () => undefined,
  )
}

export function deleteMovie(id: string): Promise<void> {
  return runTransaction('readwrite', (store) => store.delete(id)).then(
    () => undefined,
  )
}
