async function init(){

let rates = getCache()

if(!rates){

rates = await fetchRates()

setCache(rates)

}

window.rates = rates

const african = await fetch("data/africanCurrencies.json").then(r=>r.json())
const top = await fetch("data/topCurrencies.json").then(r=>r.json())

renderCards(rates,african)

renderFilters(top)

populateCalculator([...african,...top])

}

init()
