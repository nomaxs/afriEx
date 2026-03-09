// generateArchives.js
const fs = require("fs")
const path = require("path")

// Uncomment if Node version does not support global fetch
// const fetch = require("node-fetch")

// Retry helper for fetch
async function fetchRates(url, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data && data.rates) return data
      console.warn(`⚠️ Attempt ${i + 1}: API did not return rates`)
    } catch (err) {
      console.warn(`⚠️ Attempt ${i + 1} failed:`, err.message)
    }
    await new Promise(r => setTimeout(r, delayMs))
  }
  throw new Error("API did not return rates after retries")
}

async function run() {
  try {
    const african = require("../data/africanCurrencies.json")
    const top = require("../data/topCurrencies.json")

    // Fetch latest rates safely
    const data = await fetchRates("https://api.exchangerate.host/latest?base=USD")
    console.log("✅ API response received")

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    // Create archive folders: archives/YYYY/MM/DD
    const archivesFolder = "archives"
    const yearFolder = path.join(archivesFolder, String(year))
    const monthFolder = path.join(yearFolder, month)
    const dayFolder = path.join(monthFolder, day)

    ;[archivesFolder, yearFolder, monthFolder, dayFolder].forEach(f => {
      if (!fs.existsSync(f)) fs.mkdirSync(f)
    })

    // Save rates.json
    const filePath = path.join(dayFolder, "rates.json")
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    console.log(`✅ Archive created: ${filePath}`)
    return filePath

  } catch (err) {
    console.error("❌ Error creating archive:", err.message)
    process.exit(1)
  }
}

// Run the archive generator
run()
