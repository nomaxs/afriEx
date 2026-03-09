// generateArchives.js
const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch") // in case Node doesn't have fetch

async function run() {
  try {
    const african = require("../data/africanCurrencies.json")
    const top = require("../data/topCurrencies.json")

    // Fetch latest rates
    const res = await fetch("https://api.exchangerate.host/latest?base=USD")
    const data = await res.json()

    if (!data || !data.rates) throw new Error("API did not return rates")

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    const archivesFolder = "archives"
    const yearFolder = path.join(archivesFolder, String(year))
    const monthFolder = path.join(yearFolder, month)
    const dayFolder = path.join(monthFolder, day)

    // Create folder structure if it doesn't exist
    ;[archivesFolder, yearFolder, monthFolder, dayFolder].forEach(f => {
      if (!fs.existsSync(f)) fs.mkdirSync(f)
    })

    const filePath = path.join(dayFolder, "rates.json")
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    console.log(`✅ Archive created: ${filePath}`)
    return filePath

  } catch (err) {
    console.error("❌ Error creating archive:", err)
    process.exit(1)
  }
}

run()
