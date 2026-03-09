const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

async function run() {
  try {
    // Fetch latest rates
    const res = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json")
    const data = await res.json()


    
    const text = await res.text()
    console.log("API RESPONSE:", text)

    const data = JSON.parse(text)

    

    // Get today's date components
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0") // zero-padded
    const day = String(today.getDate()).padStart(2, "0")

    // Create folder structure: archives/YYYY/MM/DD
    const yearFolder = path.join("archives", String(year))
    const monthFolder = path.join(yearFolder, month)
    const dayFolder = path.join(monthFolder, day)

    if (!fs.existsSync("archives")) fs.mkdirSync("archives")
    if (!fs.existsSync(yearFolder)) fs.mkdirSync(yearFolder)
    if (!fs.existsSync(monthFolder)) fs.mkdirSync(monthFolder)
    if (!fs.existsSync(dayFolder)) fs.mkdirSync(dayFolder)

    // File path for today
    const filePath = path.join(dayFolder, "rates.json")

    // Write JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    console.log(`✅ Archive created: ${filePath}`)

  } catch (err) {
    console.error("❌ Error creating archive:", err)
  }
}

run()
