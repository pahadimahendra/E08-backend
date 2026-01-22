import os from "os"

function getSystemInfo() {
  return {
    uptimeSeconds: os.uptime(),
    totalMemoryMB: (os.totalmem() / (1024 * 1024)).toFixed(2),
    platform: os.platform(),
    architecture: os.arch(),
    cpuCores: os.cpus().length
  }
}

console.log(getSystemInfo())
