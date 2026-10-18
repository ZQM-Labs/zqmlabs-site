
const fs=require("fs"), vm=require("vm");
const SRC=fs.readFileSync(process.argv[2],"utf8");
const SEARCH=process.argv[3]||"";
const IDS=["access-code", "app", "btn-answer", "btn-gps", "btn-hint", "btn-restart", "btn-share", "btn-start", "btn-unlock", "feedback", "finale-stats", "hint-count", "hint-text", "hints", "hunt-clock", "map", "next-stop", "puzzle-answer", "puzzle-input-row", "puzzle-question", "puzzle-story", "puzzle-title", "relics", "screen-finale", "screen-map", "screen-puzzle", "screen-scare", "screen-start", "stop-art", "team-name", "unlock-code", "unlock-row", "wisp-meter", "wisp-says"];
function mkEl(id){return{id,value:"",textContent:"",innerHTML:"",dataset:{},children:[],childNodes:[],style:{},style:{},_l:{},classList:{_s:new Set(),add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},addEventListener(t,f){(this._l[t]=this._l[t]||[]).push(f)},appendChild(c){this.children.push(c);this.childNodes.push(c);return c},removeChild(c){this.children=this.children.filter(x=>x!==c);this.childNodes=this.childNodes.filter(x=>x!==c);return c},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},getAttribute(){return null},insertBefore(c){this.children.push(c);this.childNodes.push(c);return c},removeAttribute(){},click(){(this._l.click||[]).forEach(f=>f())}};}
const ELS={};IDS.forEach(i=>ELS[i]=mkEl(i));
const CARDS=["cozy","spooky","afterdark"].map(p=>{const e=mkEl("sc-"+p);e.dataset.pick=p;return e;});
const L={map:()=>({setView(){},addLayer(){}}),tileLayer:()=>({addTo(){}}),marker:()=>({addTo:()=>({bindPopup(){return{}}})}),divIcon:()=>({}),circleMarker:()=>({addTo:()=>({setLatLng(){return this},setStyle(){return this}})}),circle:()=>({addTo:()=>({setLatLng(){return this},setRadius(){return this}})}),latLng:(a,b)=>({lat:a,lng:b})};
const sb={console,URL,URLSearchParams,Set,Map,JSON,Math,Date,Number,String,Array,Object,Promise,Error,isNaN,RegExp,L,
 document:{getElementById:i=>(ELS[i]=ELS[i]||mkEl(i)),createElement:t=>{const e=mkEl("el-"+t); if(t==="canvas"){e.getContext=()=>({fillRect(){},fillText(){},drawImage(){},beginPath(){},arc(){},fill(){},save(){},restore(){},measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop(){}})});e.toBlob=(cb)=>cb(null);e.width=600;e.height=1200;} return e;},querySelectorAll:s=>s===".scare-card"?CARDS:[],body:{dataset:{}}},
 window:{location:{hostname:"zqmlabs.com",search:SEARCH,pathname:"/play/",href:"x"+SEARCH},addEventListener(){}},
 location:{hostname:"zqmlabs.com",search:SEARCH,pathname:"/play/"},
 localStorage:{_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=String(v)},removeItem(k){delete this._d[k]}},
 navigator:{serviceWorker:{register:()=>Promise.resolve()},geolocation:{getCurrentPosition:(ok)=>{try{ok({coords:{latitude:29.0,longitude:-81.0,accuracy:12}})}catch(e){}},watchPosition:(ok)=>{try{ok({coords:{latitude:29.0,longitude:-81.0,accuracy:12}})}catch(e){}return 1},clearWatch(){}}},
 alert:m=>{},fetch:()=>Promise.reject(new Error("offline")),setTimeout:()=>0,setInterval:()=>1,clearInterval:()=>{}};
sb.window.document=sb.document; sb.globalThis=sb; sb.self=sb;
vm.runInContext(SRC, vm.createContext(sb), {filename:"app"});

// drive: start -> scare (triggers openMap + openStop(deepStop))
ELS["team-name"].value="Test";
ELS["btn-start"].click();
CARDS[0].click();
console.log("  access-code  :", JSON.stringify(ELS["access-code"].value));
console.log("  unlock-code  :", JSON.stringify(ELS["unlock-code"].value));
console.log("  puzzle-title :", JSON.stringify(ELS["puzzle-title"].textContent));
