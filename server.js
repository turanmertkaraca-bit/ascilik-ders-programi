const http=require("http"), fs=require("fs"), path=require("path");
const ROOT=__dirname, PORT=process.env.PORT||8080;
const MIME={".html":"text/html; charset=utf-8",".json":"application/json; charset=utf-8",".txt":"text/plain; charset=utf-8",".pdf":"application/pdf",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
http.createServer(function(req,res){
  let u=decodeURIComponent(req.url.split("?")[0]);
  if(u==="/")u="/ascilik.html";
  const f=path.join(ROOT,path.normalize(u).replace(/^(\.\.[/\\])+/,""));
  if(!f.startsWith(ROOT)){res.writeHead(403);return res.end("forbidden");}
  fs.readFile(f,function(err,data){
    if(err){res.writeHead(404,{"content-type":"text/plain; charset=utf-8"});return res.end("Bulunamadı: "+u);}
    res.writeHead(200,{"content-type":MIME[path.extname(f).toLowerCase()]||"application/octet-stream","cache-control":"no-store"});
    res.end(data);
  });
}).listen(PORT,"0.0.0.0",function(){console.log("Aşçılık ders programı servisi: http://0.0.0.0:"+PORT+"/ascilik.html");});
