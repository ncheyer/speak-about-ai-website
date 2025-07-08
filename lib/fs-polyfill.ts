/**
 * Lightweight polyfill for environments where Node’s `fs.readdir`
 * and `fs.readdirSync` are not implemented (e.g. edge/browser stubs).
 *
 * We attach the stubs to a global `fs` object so any downstream
 * library (glob → path-scurry) finds what it needs and keeps going.
 *
 * The polyfill is a no-op in full Node.js where the functions exist.
 */
declare global {
  // eslint-disable-next-line no-var
  var fs: any | undefined
}
;(function applyFsReaddirStub() {
  // Ensure a global `fs` object exists.
  if (typeof globalThis.fs === "undefined") {
    globalThis.fs = {}
  }
  const fs = globalThis.fs

  // Async version – always returns an empty array.
  if (typeof fs.readdir !== "function") {
    fs.readdir = (_path: string, cb: (err: NodeJS.ErrnoException | null, files: string[]) => void): void => {
      if (typeof cb === "function") cb(null, [])
    }
  }

  // Sync version – always returns an empty array.
  if (typeof fs.readdirSync !== "function") {
    fs.readdirSync = (): string[] => []
  }
})()

export {}
