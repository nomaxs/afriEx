const fs=require("fs")
const fetch=require("node-fetch")

const african=require("../data/africanCurrencies.json")
const top=require("../data/topCurrencies.json")

async function run(){

let res=await fetch(
"https://api.exchangerate.host/latest?base=USD"
)

let data=await res.json()

let today=new Date()

let path=
`archives/${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}.json`

fs.writeFileSync(
path,
JSON.stringify(data,null,2)
)

}

run()