function renderFilters(list){

const container = document.getElementById("currencyFilters")

container.innerHTML=""

list.sort().forEach(code=>{

const btn = document.createElement("button")

btn.innerText = code

btn.onclick = ()=>selectCurrency(code)

container.appendChild(btn)

})

}

function selectCurrency(base){

const african = window.africanCurrencies

renderCards(window.rates,african,base)

document.querySelectorAll("#currencyFilters button")
.forEach(btn=>btn.classList.remove("active"))

event.target.classList.add("active")

}
