const fs=require("fs"), path=require("path");
const ROOT=__dirname;
const data=JSON.parse(fs.readFileSync(path.join(ROOT,"ascilik.data.json"),"utf8"));
const tpl=fs.readFileSync(path.join(ROOT,"nojs.template.html"),"utf8");

const DAYS=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const TRlo={Ç:"ç",Ğ:"ğ",I:"ı",İ:"i",Ö:"ö",Ş:"ş",Ü:"ü",Â:"â",Î:"î",Û:"û"};
const TRup={ç:"Ç",ğ:"Ğ",ı:"I",i:"İ",ö:"Ö",ş:"Ş",ü:"Ü",â:"Â",î:"Î",û:"Û"};
const trLower=s=>s.replace(/[A-ZÇĞIİÖŞÜÂÎÛ]/g,c=>TRlo[c]||c.toLowerCase());
const trUpper=s=>s.replace(/[a-zçğıöşüâîû]/g,c=>TRup[c]||c.toUpperCase());
const cap=w=>w?trUpper(w.charAt(0))+trLower(w.slice(1)):w;
function trTitle(s){
  const small={ve:1,ile:1,için:1,de:1,da:1};
  return s.split(/\s+/).map((w,i)=>{
    if(i>0&&small[trLower(w)])return trLower(w);
    return w.split("-").map(cap).join("-");
  }).join(" ");
}
const courseName=n=>/[a-zçğıöşü]/.test(n)?n:trTitle(n);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function card(r,extra){
  return `        <div class="card">
          <div class="tm"><b>${esc(r.st)}</b><span>${esc(r.en)}</span></div>
          <div class="bar"></div>
          <div class="bd">
            <div class="ttl">${esc(courseName(r.n))}</div>
            <div><span class="pill">${esc(r.r||"—")}</span> <span class="pill g">${esc(r.cr)} kredi</span></div>
            <div class="inst">${esc(r.i)}</div>
${extra||""}          </div>
        </div>`;
}

function semesterPanel(sem){
  const rows=data.filter(r=>r.s===sem);
  let inner="";
  if(!rows.length){
    inner=`      <div class="empty"><b>${sem}. Yarıyıl için program yok</b>
      Paylaşılan 2026-2027 Güz dosyasında yalnızca 1. ve 3. yarıyıl var.</div>`;
    return `      <div class="panel">\n${inner}\n      </div>`;
  }
  const days=[...new Set(rows.map(r=>r.d))].sort((a,b)=>a-b);
  days.forEach(d=>{
    inner+=`      <div class="day">${esc(DAYS[d-1])}</div>\n`;
    const dayRows=rows.filter(r=>r.d===d);
    const groups=new Map();
    dayRows.forEach(r=>{
      const k=r.st;
      if(!groups.has(k))groups.set(k,[]);
      groups.get(k).push(r);
    });
    [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([st,arr])=>{
      if(arr.length===1){ inner+=card(arr[0])+"\n"; return; }
      arr.sort((a,b)=>a.n.localeCompare(b.n,"tr"));
      const opts=arr.map(o=>
        `            <div class="card" style="margin:8px 0 0">
              <div class="tm" style="width:auto"><b style="font-size:14px">${esc(courseName(o.n))}</b></div>
              <div class="bar"></div>
              <div class="bd"><div><span class="pill">${esc(o.r||"—")}</span> <span class="pill g">${esc(o.cr)} kredi</span></div>
              <div class="inst">${esc(o.i)}</div></div>
            </div>`).join("\n");
      inner+=`        <div class="card" style="flex-direction:column;align-items:stretch">
          <div style="display:flex;gap:12px">
            <div class="tm"><b>${esc(arr[0].st)}</b><span>${esc(arr[0].en)}</span></div>
            <div class="bar"></div>
            <div class="bd"><div class="ttl">Seçmeli ders</div>
            <div class="inst">Aynı saatte ${arr.length} ders var — kendi dersini bul.</div></div>
          </div>
          <details><summary>${arr.length} seçeneği göster</summary>
${opts}
          </details>
        </div>\n`;
    });
  });
  return `      <div class="panel">\n${inner}      </div>`;
}

let panels=[1,2,3,4].map(semesterPanel).join("\n<!-- -->\n");
const out=tpl.replace("<!--YARIYIL_PANELS-->",panels);
fs.writeFileSync(path.join(ROOT,"ascilik-nojs.html"),out);
console.log("wrote ascilik-nojs.html:",out.length,"bytes");
console.log("has <script>:",/<script/i.test(out));
