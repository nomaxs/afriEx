async function fetchRates(){

const res=await fetch("https://open.er-api.com/v6/latest/USD")

const data=await res.json()

return data.rates

}