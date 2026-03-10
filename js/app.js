async function init(){

let rates = getCache()

if(!rates){

rates = await fetchRates()

setCache(rates)

}

const african = await fetch("data/africanCurrencies.json").then(r=>r.json())
const top = await fetch("data/topCurrencies.json").then(r=>r.json())

window.africanCurrencies = african
window.topCurrencies = top

renderCards(rates,african,"USD")

renderFilters(top)

populateCalculator([...african,...top])

}

init()
