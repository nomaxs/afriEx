function setCache(data){

localStorage.setItem("rates",JSON.stringify(data))

localStorage.setItem("rates_time",Date.now())

}

function getCache(){

const time=localStorage.getItem("rates_time")

if(!time) return null

if(Date.now()-time>86400000) return null

return JSON.parse(localStorage.getItem("rates"))

}