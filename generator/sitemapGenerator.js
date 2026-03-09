const fs=require("fs")

let urls=[]

let african=require("data/africanCurrencies.json")
let top=require("data/topCurrencies.json")

african.forEach(a=>{

african.forEach(b=>{

urls.push(`/archive/${a}-to-${b}`)

})

top.forEach(t=>{

urls.push(`archive/${t}-to-${a}`)

})

})

let xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

urls.forEach(u=>{
xml+=`<url><loc>https://site.com${u}</loc></url>`
})

xml+=`</urlset>`

fs.writeFileSync("../seo/sitemap.xml",xml)
