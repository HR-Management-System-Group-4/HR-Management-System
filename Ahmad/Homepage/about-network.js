(() => {
  const section = document.querySelector('.about-section');
  const visual = section?.querySelector('.about-visual');
  const canvas = visual?.querySelector('.about-network');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rand = n => { const v = Math.sin(n * 127.1 + 78.233) * 43758.5453; return v - Math.floor(v); };
  const continents = [
    [[-168,69],[-140,72],[-122,61],[-131,51],[-124,42],[-117,32],[-110,31],[-104,24],[-96,18],[-87,21],[-82,27],[-80,34],[-72,43],[-61,50],[-54,57],[-80,62],[-94,72]],
    [[-82,12],[-74,10],[-68,12],[-61,9],[-50,1],[-35,-5],[-39,-19],[-47,-29],[-53,-38],[-70,-56],[-76,-42],[-73,-30],[-78,-17],[-81,-4]],
    [[-17,30],[-10,36],[3,37],[16,32],[27,33],[43,12],[48,-6],[33,-24],[18,-35],[10,-34],[3,-22],[-10,5]],
    [[-12,37],[-11,51],[-2,57],[10,55],[20,60],[32,69],[46,65],[47,51],[36,43],[28,35],[16,37],[7,44],[-2,42]],
    [[36,37],[44,52],[62,55],[73,61],[97,58],[118,51],[133,46],[143,35],[132,30],[123,18],[110,10],[103,2],[94,6],[82,18],[72,9],[61,25],[49,29]],
    [[111,-12],[129,-11],[146,-17],[153,-28],[143,-39],[126,-36],[114,-25]],
    [[-52,60],[-44,59],[-39,68],[-43,81],[-59,83],[-61,73]]
  ];
  function inside(x, y, polygon) {
    let hit = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  }
  const sphere = (lon, lat) => {
    const a = lon * Math.PI / 180, b = lat * Math.PI / 180;
    return { x: Math.cos(b) * Math.sin(a), y: -Math.sin(b), z: Math.cos(b) * Math.cos(a) };
  };
  const dots = [];
  for (let lat = -58; lat < 82; lat += 3.4) for (let lon = -176; lon < 180; lon += 3.4) {
    const seed = (lat + 90) * 200 + lon;
    const x = lon + (rand(seed) - .5) * 1.4, y = lat + (rand(seed + 1) - .5) * 1.4;
    if (continents.some(p => inside(x, y, p))) dots.push({ ...sphere(x, y), size: .65 + rand(seed + 2) * .7 });
  }
  const nodes = Array.from({ length: 64 }, (_, i) => {
    const y = 1 - 2 * (i + .5) / 64, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });
  const edges = [], used = new Set();
  nodes.forEach((p, i) => nodes.map((q, j) => ({ j, d: (p.x-q.x)**2 + (p.y-q.y)**2 + (p.z-q.z)**2 }))
    .filter(v => v.j !== i).sort((a,b) => a.d-b.d).slice(0,3).forEach(({j}) => {
      const key = [i,j].sort((a,b) => a-b).join(':');
      if (!used.has(key)) { used.add(key); edges.push([i,j]); }
    }));

  let w = 0, h = 0, raf = 0, visible = true, last = 0;
  let yaw = -1.15, pitch = -.12, spin = 0, energy = 0, px = 0, py = 0, glowX = .73, glowY = .43;
  const ripples = [], sparks = [];
  function circle(x, y, r, fill) {
    ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  function stroke(a, b, color, lineWidth = 1) {
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
  }
  function project(p,cx,cy,r) {
    const c = Math.cos(yaw), s = Math.sin(yaw), x = p.x*c+p.z*s, z = p.z*c-p.x*s;
    return { x: cx+x*r, y: cy+(p.y*Math.cos(pitch)-z*Math.sin(pitch))*r, z: p.y*Math.sin(pitch)+z*Math.cos(pitch) };
  }
  function background(time,dark) {
    const drift = reduced.matches ? 0 : Math.sin(time*.00022)*14;
    ctx.save(); ctx.globalAlpha = dark ? .3 : .65;
    for (let i=0; i<8; i++) {
      ctx.beginPath(); ctx.moveTo(-60,h*(.08+i*.115));
      ctx.bezierCurveTo(w*.23,h*(-.12+i*.11)+drift,w*.54,h*(.85-i*.08),w+80,h*(.05+i*.11));
      ctx.strokeStyle = i%3 ? 'rgba(77,137,243,.16)' : 'rgba(0,171,250,.28)';
      ctx.lineWidth = i%3 ? .8 : 1.2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-60,h*.92+i*62);
      ctx.bezierCurveTo(w*.25,h*(.62+i*.03),w*.7,h*(1.12-i*.045),w+80,h*.69+i*18);
      ctx.strokeStyle = 'rgba(73,145,248,.19)'; ctx.stroke();
    }
    for (let i=0; i<85; i++) {
      const x=rand(i+5)*w, y=rand(i+218)*h;
      if (x<w*.52 && y>h*.18 && y<h*.75) continue;
      circle(x,y,i%13===0?3:1.3,i%7===0?'rgba(0,169,239,.8)':'rgba(89,157,248,.42)');
    }
    ctx.restore();
  }
  function orbit(cx,cy,r,angle,flat,time,dark,front=false) {
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle); ctx.beginPath();
    ctx.ellipse(0,0,r*1.38,r*flat,0,front?0:Math.PI,front?Math.PI:Math.PI*2);
    ctx.strokeStyle = front ? (dark?'rgba(82,240,255,.9)':'rgba(0,219,245,.93)') : 'rgba(46,135,247,.3)';
    ctx.lineWidth = front ? 2.4 : 1;
    if (front) { ctx.shadowColor='#00e7ff'; ctx.shadowBlur=16+energy*20; }
    ctx.stroke(); ctx.restore();
    if (!front) for (let i=0; i<3; i++) {
      const t=time*.00032*(i%2?-1:1)+i*2.8, ox=Math.cos(t)*r*1.38, oy=Math.sin(t)*r*flat;
      const x=cx+ox*Math.cos(angle)-oy*Math.sin(angle), y=cy+ox*Math.sin(angle)+oy*Math.cos(angle);
      const g=ctx.createRadialGradient(x-3,y-4,1,x,y,i?11:17);
      g.addColorStop(0,'#fff'); g.addColorStop(.38,i?'#50c8ff':'#00e8f0'); g.addColorStop(1,'#4365de');
      ctx.shadowColor='#4edfff'; ctx.shadowBlur=16; circle(x,y,i?9:14,g); ctx.shadowBlur=0;
    }
  }
  function globe(time,dark) {
    const mobile=matchMedia('(max-width: 900px)').matches;
    const cx=w*(mobile?.5:.765)+px*(mobile?4:9), cy=h*(mobile?.5:.5)+py*6;
    const r=mobile?Math.min(w*.3,h*.34,125):Math.min(w*.125,h*.27,190);
    const aura=ctx.createRadialGradient(cx,cy,r*.45,cx,cy,r*1.75);
    aura.addColorStop(0,dark?'rgba(38,152,234,.2)':'rgba(39,170,255,.22)');
    aura.addColorStop(1,'rgba(63,161,255,0)'); circle(cx,cy,r*1.75,aura);
    ctx.save(); ctx.translate(cx,cy+r*1.14);
    for (let i=3; i>=0; i--) {
      ctx.beginPath(); ctx.ellipse(0,i*7,r*(1.16+i*.12),r*(.12+i*.035),0,0,Math.PI*2);
      ctx.fillStyle=dark?`rgba(39,103,170,${.06+(3-i)*.025})`:`rgba(79,147,219,${.045+(3-i)*.02})`;
      ctx.fill(); ctx.strokeStyle=`rgba(255,255,255,${.36+(3-i)*.14})`; ctx.lineWidth=1.3; ctx.stroke();
    }
    ctx.restore();
    orbit(cx,cy,r,-.28,.54,time,dark); orbit(cx,cy,r,.7,.93,time+1300,dark); orbit(cx,cy,r,-1.1,.75,time+2600,dark);
    const sea=ctx.createRadialGradient(cx-r*.42,cy-r*.56,r*.04,cx+r*.13,cy+r*.15,r*1.24);
    (dark?['#5ebbf4','#2468ab','#173d80','#102451']:['#eaffff','#acdfff','#5ea4df','#557cbb'])
      .forEach((color,i) => sea.addColorStop([0,.26,.62,1][i],color));
    ctx.shadowColor=dark?'#16a8ff':'#58b7ff'; ctx.shadowBlur=35+energy*28; circle(cx,cy,r,sea); ctx.shadowBlur=0;
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r-1,0,Math.PI*2); ctx.clip();
    for (let lon=-180; lon<180; lon+=20) {
      let previous;
      for (let lat=-89; lat<=89; lat+=5) {
        const point=project(sphere(lon,lat),cx,cy,r);
        if (previous?.z>-.08 && point.z>-.08) stroke(previous,point,'rgba(227,249,255,.22)',.7);
        previous=point;
      }
    }
    for (let lat=-60; lat<=60; lat+=20) {
      let previous;
      for (let lon=-180; lon<=180; lon+=5) {
        const point=project(sphere(lon,lat),cx,cy,r);
        if (previous?.z>-.08 && point.z>-.08) stroke(previous,point,'rgba(227,249,255,.18)',.7);
        previous=point;
      }
    }
    dots.forEach(p => {
      const point=project(p,cx,cy,r);
      if (point.z>0) circle(point.x,point.y,p.size*(mobile?.68:1),`rgba(242,253,255,${.42+point.z*.55})`);
    });
    const mapped=nodes.map(p=>project(p,cx,cy,r));
    edges.forEach(([a,b]) => {
      const p=mapped[a], q=mapped[b];
      if (p.z>-.03 && q.z>-.03) stroke(p,q,`rgba(239,255,255,${.19+Math.min(p.z,q.z)*.4})`);
    });
    mapped.forEach((p,i) => {
      if (p.z<0) return;
      const bright=i%9===0;
      if (bright) { ctx.shadowColor='#5cffff'; ctx.shadowBlur=13; }
      circle(p.x,p.y,bright?4.3:2.1,bright?'#caffff':`rgba(255,255,255,${.55+p.z*.4})`);
      ctx.shadowBlur=0;
    });
    const sheen=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
    sheen.addColorStop(0,'rgba(255,255,255,.45)'); sheen.addColorStop(.35,'rgba(255,255,255,.03)'); sheen.addColorStop(1,'rgba(17,51,124,.2)');
    circle(cx,cy,r,sheen); ctx.restore();
    ctx.strokeStyle=dark?'rgba(150,234,255,.86)':'rgba(255,255,255,.86)';
    ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,r+1,0,Math.PI*2); ctx.stroke();
    orbit(cx,cy,r,-.28,.54,time,dark,true);
  }
  function interactions(time,dark) {
    const x=glowX*w,y=glowY*h,range=Math.max(w,h)*.28;
    const g=ctx.createRadialGradient(x,y,1,x,y,range);
    g.addColorStop(0,`rgba(67,222,255,${.1+energy*.16})`); g.addColorStop(1,'rgba(67,222,255,0)');
    circle(x,y,range,g);
    for (let i=ripples.length-1; i>=0; i--) {
      const a=(time-ripples[i].time)/1100;
      if (a>1) { ripples.splice(i,1); continue; }
      ctx.beginPath(); ctx.arc(ripples[i].x,ripples[i].y,10+a*190,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${dark?'110,233,255':'8,166,243'},${(1-a)*.52})`;
      ctx.lineWidth=2.5*(1-a); ctx.stroke();
    }
    for (let i=sparks.length-1; i>=0; i--) {
      const s=sparks[i], a=(time-s.time)/s.life;
      if (a>1) { sparks.splice(i,1); continue; }
      circle(s.x+Math.cos(s.angle)*s.speed*a,s.y+Math.sin(s.angle)*s.speed*a,s.size*(1-a),
        `rgba(${dark?'161,249,255':'0,156,241'},${1-a})`);
    }
  }
  function draw(time=0) {
    if (!w||!h) return;
    const dark=document.body.classList.contains('dark-mode');
    ctx.clearRect(0,0,w,h); background(time,dark); interactions(time,dark); globe(time,dark);
  }
  function tick(time) {
    raf=requestAnimationFrame(tick);
    if (time-last<30) return;
    last=time; spin*=.96; energy*=.93; yaw+=.0022+spin;
    pitch+=((-.12+py*.2)-pitch)*.045; draw(time);
  }
  function updateAnimation() {
    if (reduced.matches||!visible||document.hidden) {
      cancelAnimationFrame(raf); raf=0; draw(performance.now());
    } else if (!raf) raf=requestAnimationFrame(tick);
  }
  function resize() {
    const rect=visual.getBoundingClientRect(), ratio=Math.min(devicePixelRatio||1,2);
    w=rect.width; h=rect.height; canvas.width=Math.round(w*ratio); canvas.height=Math.round(h*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0); draw(performance.now());
  }
  function activate(x,y) {
    const now=performance.now(), sx=Math.max(0,Math.min(w,x)), sy=Math.max(0,Math.min(h,y));
    glowX=sx/w; glowY=sy/h; spin+=.045; energy=1;
    if (!reduced.matches) {
      ripples.push({x:sx,y:sy,time:now});
      for (let i=0;i<24;i++) sparks.push({
        x:sx,y:sy,time:now,angle:Math.PI*2*i/24+rand(i+now)*.3,
        speed:70+rand(i+now+1)*140,size:1.5+rand(i+now+2)*2,life:550+rand(i+now+3)*450
      });
    }
    section.classList.remove('is-energized'); void section.offsetWidth; section.classList.add('is-energized');
    clearTimeout(activate.timeout);
    activate.timeout=setTimeout(()=>section.classList.remove('is-energized'),520);
    draw(now);
  }
  section.addEventListener('pointermove',event=>{
    if (reduced.matches) return;
    const rect=visual.getBoundingClientRect();
    px=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
    py=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
    glowX+=((event.clientX-rect.left)/rect.width-glowX)*.08;
    glowY+=((event.clientY-rect.top)/rect.height-glowY)*.08;
  });
  section.addEventListener('pointerleave',()=>{px=0;py=0;});
  section.addEventListener('click',event=>{
    if (event.target.closest('a')) return;
    const rect=visual.getBoundingClientRect();
    const keyboardClick=event.detail===0;
    activate(keyboardClick ? rect.width*.5 : event.clientX-rect.left,
      keyboardClick ? rect.height*.5 : event.clientY-rect.top);
  });
  if ('IntersectionObserver' in window)
    new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;updateAnimation();},{rootMargin:'100px'}).observe(section);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual);
  else addEventListener('resize',resize);
  document.addEventListener('visibilitychange',updateAnimation);
  reduced.addEventListener('change',updateAnimation);
  new MutationObserver(()=>draw(performance.now())).observe(document.body,{attributes:true,attributeFilter:['class']});
  resize(); updateAnimation();
})();
