const fs = require("fs")
const path = require("path")

const african = require("../data/africanCurrencies.json")
const top = require("../data/topCurrencies.json")

async function run() {

try {

const res = await fetch("https://latest.currency-api.pages.dev/v1/currencies/usd.json")
const data = await res.json()

const allRates = data.usd

// ensure USD exists
allRates["usd"] = 1

const wanted = [...african, ...top]

const filtered = {}

wanted.forEach(code => {

const lower = code.toLowerCase()

if (lower in allRates) {

filtered[code] = allRates[lower]

} else {

console.log(`⚠ Missing rate for ${code}`)

}

})

const result = {
date: data.date,
base: "USD",
rates: filtered
}

// create date folders
const today = new Date()

const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, "0")
const day = String(today.getDate()).padStart(2, "0")

const folder = path.join("archives", String(year), month, day)

fs.mkdirSync(folder, { recursive: true })

const filePath = path.join(folder, "rates.json")

fs.writeFileSync(filePath, JSON.stringify(result, null, 2))

console.log(`✅ Archive created: ${filePath}`)

} catch (err) {

console.error("❌ Error creating archive:", err)

}

}

run()
