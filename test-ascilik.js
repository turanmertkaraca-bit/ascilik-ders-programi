const fs=require('fs');
const path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*)<\/script>/);
const src=m[1];

function mkEl(){return {innerHTML:'',textContent:'',value:'',style:{},_attrs:{},
  classList:{_s:new Set(),add(x){this._s.add(x)},remove(x){this._s.delete(x)},contains(x){return this._s.has(x)}},
  setAttribute(k,v){this._attrs[k]=v},getAttribute(k){return this._attrs[k]}};}
let els={};
let clickHandler=null;
global.document={getElementById(id){return els[id]||(els[id]=mkEl());},
  addEventListener(t,f){if(t==='click')clickHandler=f;}};
const store={};
global.localStorage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null},
  setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};

const data=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const progs=[...new Set(data.map(r=>r.p))];
const combos=[...new Set(data.map(r=>r.p+'||'+r.s))].map(k=>{const a=k.split('||');return {p:a[0],s:+a[1]};});
console.log('programs:',progs.length,'program+sem combos:',combos.length);

function boot(pre){
  els={}; for(const k in store)delete store[k];
  if(pre)store['eu.myoprog.v1']=JSON.stringify(pre);
  new Function(src)();
  return document.getElementById('app').innerHTML;
}
function click(act,extra){
  clickHandler({target:{closest:function(){return{getAttribute:function(k){
    if(k==='data-act')return act;
    return extra&&Object.prototype.hasOwnProperty.call(extra,k)?extra[k]:null;}};}}});
}

let fails=0;
// welcome screen
let home=boot(null);
if(!/Bölüm seç/.test(home)){console.log('FAIL welcome screen');fails++;}
const pl=document.getElementById('plist').innerHTML;
if((pl.match(/class="prog"/g)||[]).length!==progs.length){console.log('FAIL picker list size',(pl.match(/class="prog"/g)||[]).length,progs.length);fails++;}

for(const c of combos){
  const h=boot({prog:c.p,sem:c.s,picks:{}});
  const tag=c.p+' '+c.s;
  if(!/hero/.test(h)){console.log('FAIL no hero',tag);fails++;}
  if(/undefined|NaN/.test(h)){console.log('FAIL undefined/NaN today',tag);fails++;}
  // week tab: walk all 7 days, total cards must cover all rows
  click('tab',{'data-tab':'week'});
  let cards=0;
  for(let d=1;d<=7;d++){
    click('day',{'data-day':String(d)});
    const wd=document.getElementById('app').innerHTML;
    if(/undefined|NaN/.test(wd)){console.log('FAIL day'+d,tag);fails++;}
    cards+=(wd.match(/class="cls/g)||[]).length;
  }
  const expect=new Set(data.filter(r=>r.p===c.p&&r.s===c.s).map(r=>r.d+'|'+r.st)).size;
  if(cards!==expect){console.log('FAIL card count',tag,'got',cards,'want slots',expect);fails++;}
  click('tab',{'data-tab':'courses'});
  const cr=document.getElementById('app').innerHTML;
  if(!/id="qlist"/.test(cr)||/undefined|NaN/.test(cr)){console.log('FAIL courses',tag);fails++;}
}
// elective flow on a known 12-option slot
boot({prog:'SİVİL HAVACILIK KABİN HİZMETLERİ PROGRAMI',sem:3,picks:{}});
click('tab',{'data-tab':'week'});
click('day',{'data-day':'4'});
let before=document.getElementById('app').innerHTML;
if(!/Seçmeli ders/.test(before)){console.log('FAIL no elective placeholder');fails++;}
click('openElective',{'data-key':'4|13:00'});
let opts=document.getElementById('sheetList').innerHTML;
const n=(opts.match(/class="opt/g)||[]).length;
console.log('elective options listed:',n);
if(n<2){console.log('FAIL elective options');fails++;}
if(!/sel/.test(opts)){/* no preselection expected */}
click('choose',{'data-key':'4|13:00','data-idx':'3'});
const after=document.getElementById('app').innerHTML;
if(/Seçmeli ders/.test(after)){console.log('FAIL placeholder still after choose');fails++;}
if(!JSON.parse(store['eu.myoprog.v1']).picks['SİVİL HAVACILIK KABİN HİZMETLERİ PROGRAMI|3|4|13:00']===3){console.log('picks value:',store['eu.myoprog.v1']);}
console.log('after choose has değiştir:',/değiştir/.test(after));

// sample rendered titles
boot({prog:'E-TİCARET VE PAZARLAMA PROGRAMI',sem:1,picks:{}});
console.log('title:',document.getElementById('hTitle').textContent);
console.log('sub:',document.getElementById('hSub').textContent);
console.log(fails? 'FAILURES: '+fails : 'ALL CHECKS PASSED');
