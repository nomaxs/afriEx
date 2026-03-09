const overlay=document.getElementById("calculatorOverlay")

document.getElementById("openCalculator").onclick=()=>{
overlay.style.display="flex"
}

overlay.onclick=e=>{
if(e.target===overlay){
overlay.style.display="none"
}
}

document.getElementById("calculate").onclick=()=>{

const from=document.getElementById("fromCurrency").value
const to=document.getElementById("toCurrency").value
const amount=document.getElementById("amount").value

const rate=(rates[to]/rates[from])*amount

document.getElementById("result").innerText=rate

}