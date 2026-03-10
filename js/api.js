async function fetchRates(){

const today = new Date()

const y = today.getFullYear()
const m = String(today.getMonth()+1).padStart(2,"0")
const d = String(today.getDate()).padStart(2,"0")

const path = `archives/${y}/${m}/${d}/rates.json`

const res = await fetch(path)

if(res.ok){

const data = await res.json()

return data.rates

}

const fallback = await fetch("https://open.er-api.com/v6/latest/USD")

const data = await fallback.json()

return data.rates

}
