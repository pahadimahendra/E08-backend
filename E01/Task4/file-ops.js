import fs from "fs/promises"

const filename = "output.txt"

async function runFileOperations() {
  try {
    const name = "Mahendra Pahadi"
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()

    const content = `Name: ${name}
Date: ${date}
Time: ${time}
`
    await fs.writeFile(filename, content)
    console.log("File written successfully.")

    const data = await fs.readFile(filename, "utf8")
    console.log("File content:")
    console.log(data)
  } catch (error) {
    console.error("Error:", error.message)
  }
}

runFileOperations()
