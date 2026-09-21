function trim(s){ gsub(/^[ \t]+|[ \t]+$/,"",s); return s }
function esc(s){ gsub(/\\/,"\\\\",s); gsub(/"/,"\\\"",s); return s }
function dayIdx(d){
  if(d=="Pazartesi")return 1; if(d=="Salı")return 2; if(d=="Çarşamba")return 3;
  if(d=="Perşembe")return 4; if(d=="Cuma")return 5; if(d=="Cumartesi")return 6; return 7;
}
function timeslot(t,   i){ return t }
function join(A,from,to,   s,i){ s=""; for(i=from;i<=to;i++){ if(i>from)s=s" "; s=s A[i] } return s }
BEGIN { first=1; print "[" }
/^[ \t]*$/ { next }
/YARIYIL/ {
  t=trim($0)
  if (match(t,/[0-9]\. YARIYIL/)) { sem=substr(t,RSTART,1)+0; sec=trim(substr(t,1,RSTART-1)); next }
}
{
  if (match($0,/(Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar)[ \t]+[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9]/)) {
    dstart=RSTART
    dt=trim(substr($0,RSTART,RLENGTH))
    day=""; split(dt,dw,/[ \t]+/); day=dw[1]
    tm=dw[2]; split(tm,tr,"-"); start=tr[1]; fin=tr[2]

    left=trim(substr($0,1,dstart-1))
    n=split(left,lf,/[ \t][ \t][ \t]+/)
    course=trim(lf[n])
    code=""; bolum=""
    for(i=2;i<n;i++){
      f=trim(lf[i])
      if(f ~ /^[0-9]/ ) code=f; else bolum=bolum (bolum==""?"":" ") f
    }
    if(bolum=="") bolum=sec

    after=trim(substr($0,RSTART+RLENGTH))
    nf=split(after,ff,/[ \t][ \t][ \t]+/)
    for(i=1;i<=nf;i++) ff[i]=trim(ff[i])
    inst=""; credit=""; room=""
    if(nf>=1){
      if(ff[nf] ~ /^[0-9][0-9]?$/){ credit=ff[nf]; room=join(ff,1,nf-1) }
      else{
        inst=ff[nf]
        if(nf>=2 && ff[nf-1] ~ /^[0-9][0-9]?$/){ credit=ff[nf-1]; room=join(ff,1,nf-2) }
        else room=join(ff,1,nf-1)
      }
    }

    if(!first) printf(",\n"); first=0
    printf "{\"p\":\"%s\",\"s\":%d,\"b\":\"%s\",\"c\":\"%s\",\"n\":\"%s\",\"d\":%d,\"dy\":\"%s\",\"st\":\"%s\",\"en\":\"%s\",\"r\":\"%s\",\"cr\":\"%s\",\"i\":\"%s\"}",
      esc(sec), sem, esc(bolum), esc(code), esc(course), dayIdx(day), esc(day), start, fin, esc(room), credit, esc(inst)
  }
}
END { print "\n]" }
