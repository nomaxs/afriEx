const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

async function run() {
  try {
    // Fetch latest rates
    const res = await fetch("https://api.exchangerate.host/latest?base=USD")
    const data = await res.json()

    // Get today’s date components
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1 // JS months are 0-indexed
    const day = today.getDate()

    // Create folder structure: archives/YYYY/MM
    const yearFolder = path.join("archives", String(year))
    const monthFolder = path.join(yearFolder, String(month))

    if (!fs.existsSync("archives")) fs.mkdirSync("archives")
    if (!fs.existsSync(yearFolder)) fs.mkdirSync(yearFolder)
    if (!fs.existsSync(monthFolder)) fs.mkdirSync(monthFolder)

    // File path for today
    const filePath = path.join(monthFolder, `${day}.json`)

    // Write JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    console.log(`✅ Archive created: ${filePath}`)

  } catch (err) {
    console.error("❌ Error creating archive:", err)
  }
}

run()
