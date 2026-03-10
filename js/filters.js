const tabs = document.querySelectorAll(".tabs span")

tabs.forEach(tab => {

tab.onclick = ()=>{

tabs.forEach(t=>t.classList.remove("active"))

tab.classList.add("active")

if(tab.innerText==="African"){

renderFilters(window.africanCurrencies)

}else{

renderFilters(window.topCurrencies)

}

}

})

function renderFilters(list){

const container = document.getElementById("currencyFilters")

container.innerHTML=""

list.sort().forEach(code=>{

const btn = document.createElement("button")

btn.innerText = code

btn.onclick = (e)=>selectCurrency(code,e)

container.appendChild(btn)

})

}

function selectCurrency(base,e){

const african = window.africanCurrencies

renderCards(window.rates,african,base)

document.querySelectorAll("#currencyFilters button")
.forEach(btn=>btn.classList.remove("active"))

e.target.classList.add("active")

}
