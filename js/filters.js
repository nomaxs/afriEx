let currentBase="USD"

function createFilterButtons(list,container){

container.innerHTML=""

list.forEach(currency=>{

let btn=document.createElement("button")

btn.innerText=currency

btn.onclick=()=>{

currentBase=currency

loadRates()

}

container.appendChild(btn)

})

}