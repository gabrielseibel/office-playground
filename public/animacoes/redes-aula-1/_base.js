/* Base das animações da Aula 1 de Redes (Informática Essencial, Lajeado 2026.25.60).
   Cada animação é um arquivo HTML único que usa esta base: palco 1280x720 com SVG, legendas
   sincronizadas e uma linha do tempo GSAP. Parâmetros de URL: ?t=N (congela no segundo N),
   ?controls=0 (esconde a barra), ?autoplay=0 (começa parado), ?loop=1 (repete). */
(function(){
  const Q=new URLSearchParams(location.search), NS="http://www.w3.org/2000/svg";
  const C={azul:"#2F75B5",azulE:"#1F4E79",azulC:"#7FB2E5",laranja:"#E87722",verde:"#2E9B5F",verm:"#D64545",cinza:"#6B7A90",cinzaC:"#C7D2E0",claro:"#EAF1F8",tinta:"#0B1626",amarelo:"#F4B942",roxo:"#8E6BD1"};
  const V={C,Q,NS};
  V.el=function(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in (attrs||{}))e.setAttribute(k,attrs[k]);(parent||V.s).appendChild(e);return e;};
  V.g=function(parent,x,y){const g=V.el("g",{},parent);gsap.set(g,{x:x||0,y:y||0});return g;};
  V.text=function(parent,t,x,y,o){o=o||{};const e=V.el("text",{x:x,y:y,"text-anchor":o.a||"middle","font-size":o.s||24,"font-weight":o.w||600,fill:o.c||"#fff","font-family":o.f||'"Segoe UI","Liberation Sans",Arial,sans-serif'},parent);e.textContent=t;return e;};
  /* computador centrado em 0,0 */
  V.pc=function(parent,label,x,y,o){o=o||{};const g=V.g(parent,x,y);const w=o.w||104,h=o.h||70,cor=o.c||C.azul;
    V.el("rect",{x:-w/2,y:-h/2,width:w,height:h,rx:10,fill:cor,stroke:"#0b1626","stroke-width":3},g);
    V.el("rect",{x:-w/2+8,y:-h/2+8,width:w-16,height:h-26,rx:4,fill:"#0d2744"},g);
    V.el("rect",{x:-14,y:h/2,width:28,height:9,fill:cor},g);V.el("rect",{x:-30,y:h/2+8,width:60,height:6,rx:3,fill:cor},g);
    if(label)V.text(g,label,0,h/2+40,{s:o.s||20,w:600});
    return g;};
  V.node=function(parent,label,x,y,o){o=o||{};const g=V.g(parent,x,y);const w=o.w||150,h=o.h||52;
    V.el("rect",{x:-w/2,y:-h/2,width:w,height:h,rx:12,fill:o.c||C.laranja,stroke:"#0b1626","stroke-width":3},g);
    V.text(g,label,0,6,{s:o.s||21,w:700});return g;};
  V.line=function(parent,x1,y1,x2,y2,o){o=o||{};return V.el("line",{x1:x1,y1:y1,x2:x2,y2:y2,stroke:o.c||C.azulC,"stroke-width":o.w||5,"stroke-linecap":"round",opacity:o.op===undefined?1:o.op},parent);};
  V.dot=function(parent,x,y,o){o=o||{};const g=V.g(parent,x,y);V.el("circle",{r:o.r||13,fill:o.c||C.amarelo,stroke:"#0b1626","stroke-width":3},g);return g;};
  V.cross=function(parent,x,y,s){s=s||24;const g=V.g(parent,x,y);V.el("path",{d:`M${-s} ${-s}L${s} ${s}M${s} ${-s}L${-s} ${s}`,stroke:C.verm,"stroke-width":9,"stroke-linecap":"round"},g);return g;};
  V.init=function(opt){
    document.title=opt.title;if(Q.get("controls")==="0")document.body.classList.add("nocontrols");
    const wrap=document.createElement("div");wrap.id="wrap";wrap.innerHTML='<div id="view"><div id="stage"><svg id="s" viewBox="0 0 1280 720"></svg><div id="ttl"></div><div id="caps"></div></div></div><div id="bar"><button id="pp">pausar</button><button id="rs">recomeçar</button><input id="seek" type="range" min="0" max="1000" value="0"><span id="time">0:00</span><select id="sp"><option value="0.75">0,75x</option><option value="1" selected>1x</option><option value="1.5">1,5x</option></select><button id="fs">tela cheia</button></div>';
    document.body.appendChild(wrap);V.s=document.getElementById("s");V.stage=document.getElementById("stage");
    V.tl=gsap.timeline({paused:true,defaults:{ease:"power2.out"}});
    function fit(){const v=document.getElementById("view");const k=Math.min(v.clientWidth/1280,v.clientHeight/720);V.stage.style.transform=`scale(${k})`;V.stage.style.left=((v.clientWidth-1280*k)/2)+"px";V.stage.style.top=((v.clientHeight-720*k)/2)+"px";}
    addEventListener("resize",fit);fit();
    /* defs: seta de pacote não é usada; sombra suave */
  };
  /* legenda sincronizada: aparece em t e some em t+dur */
  V.cap=function(txt,t,dur){const d=document.createElement("div");d.className="cap";d.innerHTML="<span>"+txt+"</span>";document.getElementById("caps").appendChild(d);
    V.tl.set(d,{opacity:0},0).to(d,{opacity:1,y:0,duration:.3},t).to(d,{opacity:0,duration:.3},t+dur-.3);};
  V.title=function(txt,sub,t,dur){const d=document.createElement("div");d.className="ttl";d.innerHTML=txt+(sub?"<small>"+sub+"</small>":"");document.getElementById("ttl").appendChild(d);
    V.tl.set(d,{opacity:0},0).to(d,{opacity:1,duration:.4},t).to(d,{opacity:0,duration:.3},t+dur-.3);};
  /* grupo de cena: invisível fora do intervalo */
  V.scene=function(g,t,dur){V.tl.set(g,{opacity:0},0).to(g,{opacity:1,duration:.4},t).to(g,{opacity:0,duration:.4},t+dur-.4);};
  V.fmt=s=>{s=Math.max(0,s);return Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");};
  V.finish=function(){
    const tl=V.tl,dur=tl.duration()+1.2;tl.to({},{duration:1.2},tl.duration());
    const pp=document.getElementById("pp"),rs=document.getElementById("rs"),seek=document.getElementById("seek"),tm=document.getElementById("time"),sp=document.getElementById("sp"),fs=document.getElementById("fs");
    tl.eventCallback("onUpdate",()=>{seek.value=Math.round(1000*tl.time()/tl.duration());tm.textContent=V.fmt(tl.time())+" / "+V.fmt(tl.duration());});
    tl.eventCallback("onComplete",()=>{if(Q.get("loop")==="1")tl.restart();else pp.textContent="repetir";});
    pp.onclick=()=>{if(tl.progress()===1){tl.restart();pp.textContent="pausar";return;}if(tl.paused()){tl.play();pp.textContent="pausar";}else{tl.pause();pp.textContent="continuar";}};
    rs.onclick=()=>{tl.restart();pp.textContent="pausar";};
    seek.oninput=()=>{tl.pause();tl.progress(seek.value/1000);pp.textContent="continuar";};
    sp.onchange=()=>tl.timeScale(parseFloat(sp.value));
    fs.onclick=()=>{const d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else d.requestFullscreen&&d.requestFullscreen();};
    addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();pp.click();}});
    const t=Q.get("t");
    if(t!==null){tl.pause();tl.seek(parseFloat(t),false);}
    else if(Q.get("autoplay")==="0"){tl.pause(0);pp.textContent="começar";}
    else tl.play(0);
    window.__ready=true;window.__duration=tl.duration();
    if(matchMedia("(prefers-reduced-motion: reduce)").matches&&t===null){tl.pause(tl.duration());pp.textContent="repetir";}
  };
  window.V=V;
})();
/* utilitários extras de desenho e de pacotes */
(function(){
  const V=window.V;
  V.len=(x1,y1,x2,y2)=>Math.hypot(x2-x1,y2-y1);
  V.drawIn=function(e,t,d,x1,y1,x2,y2){const L=V.len(x1,y1,x2,y2);gsap.set(e,{strokeDasharray:L,strokeDashoffset:L});V.tl.to(e,{strokeDashoffset:0,duration:d||.5,ease:"power1.inOut"},t);};
  /* pacote que percorre uma lista de pontos [[x,y],...] a partir de t, com velocidade px/s; devolve o tempo final */
  V.travel=function(pk,pts,t,speed){speed=speed||330;let tt=t;V.tl.set(pk,{x:pts[0][0],y:pts[0][1],opacity:1},t);
    for(let i=1;i<pts.length;i++){const d=V.len(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1])/speed;V.tl.to(pk,{x:pts[i][0],y:pts[i][1],duration:d,ease:"none"},tt);tt+=d;}
    return tt;};
  V.pop=function(g,t,d){V.tl.fromTo(g,{opacity:0,scale:.6},{opacity:1,scale:1,duration:d||.45,ease:"back.out(1.6)"},t);};
  V.fade=function(g,t,d,to){V.tl.to(g,{opacity:to===undefined?1:to,duration:d||.4},t);};
  V.pulse=function(g,t,n,s){for(let i=0;i<(n||2);i++){V.tl.to(g,{scale:s||1.18,duration:.22,yoyo:true,repeat:1,ease:"sine.inOut"},t+i*.5);}};
  /* anel que se expande (broadcast) */
  V.ring=function(parent,x,y,t,color,r2){const c=V.el("circle",{cx:x,cy:y,r:10,fill:"none",stroke:color||V.C.amarelo,"stroke-width":5,opacity:0},parent);
    V.tl.fromTo(c,{attr:{r:10},opacity:.9},{attr:{r:r2||150},opacity:0,duration:1.1,ease:"power1.out"},t);return c;};
  V.chip=function(parent,txt,x,y,o){o=o||{};const g=V.g(parent,x,y);const w=o.w||Math.max(80,txt.length*(o.s||20)*0.58+30),h=o.h||38;
    V.el("rect",{x:-w/2,y:-h/2,width:w,height:h,rx:10,fill:o.c||V.C.azulE,stroke:o.b||V.C.azulC,"stroke-width":2},g);V.text(g,txt,0,(o.s||20)*0.35,{s:o.s||20,c:o.t||"#fff",w:700});return g;};
})();
