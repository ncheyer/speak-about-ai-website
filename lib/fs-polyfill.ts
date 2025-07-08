/**
 * Lightweight polyfill for runtimes where the Node `fs` shim omits
 * `readdir` / `readdirSync` (e.g. Next.js, edge-runtime).
 *
 * We patch only if the functions are missing to avoid interfering
 * with normal Node.js behaviour in local / server builds.
 *
 * IMPORTANT: there is deliberately **no** `"use client"` directive
 * so this file can be loaded from either server or client code.
 */
import fs from "fs"

// Async version – always yields an empty array.
if (typeof (fs as any).readdir !== "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(fs as any).readdir = (...args: any[]) => {
    const cb = args.pop()
    if (typeof cb === "function") cb(null, [])
  }
}

// Sync version – always returns an empty array.
if (typeof (fs as any).readdirSync !== "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(fs as any).readdirSync = () => []
}
