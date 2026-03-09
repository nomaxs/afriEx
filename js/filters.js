function renderFilters(list){

const container = document.getElementById("currencyFilters")

container.innerHTML=""

list.forEach(code=>{

const btn = document.createElement("button")

btn.innerText = code

btn.onclick = ()=>selectCurrency(code)

container.appendChild(btn)

})

}

function selectCurrency(base){

const african = window.africanCurrencies

renderCards(window.rates,african,base)

}
