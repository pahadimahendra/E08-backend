import os from "os"

export async function getSystemInfo() {
  const uptime = os.uptime()
  const totalMemMB = (os.totalmem() / (1024 * 1024)).toFixed(2)
  const freeMemMB = (os.freemem() / (1024 * 1024)).toFixed(2)

  return {
    nodeVersion: process.version,
    platform: os.platform(),
    architecture: os.arch(),
    cpuCores: os.cpus().length,
    uptimeSeconds: uptime,
    totalMemoryMB: totalMemMB,
    freeMemoryMB: freeMemMB,
    hostname: os.hostname()
  }
}
