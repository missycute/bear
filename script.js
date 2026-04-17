/* ══════════════════════════════════════════════════
   PROFILE.JS  —  Full Interactive Logic
   ══════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   1.  ENTER SCREEN
───────────────────────────────────── */
(function initEnter() {

  /* — Clock — */
  const clockEl = document.getElementById('enter-clock');
  function updateClock() {
    const n = new Date();
    clockEl.textContent =
      String(n.getHours()).padStart(2,'0') + ':' +
      String(n.getMinutes()).padStart(2,'0') + ':' +
      String(n.getSeconds()).padStart(2,'0');
  }
  updateClock(); setInterval(updateClock, 1000);

  /* — Canvas: particle hex field — */
  const c   = document.getElementById('enter-canvas');
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    buildPoints();
  }

  function buildPoints() {
    pts = [];
    const count = Math.floor((W * H) / 9000);
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.3,
        r: Math.random()*1.4+.3,
        a: Math.random()*.6+.2, gold: Math.random()>.8
      });
    }
  }

  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

  function drawEnter() {
    ctx.clearRect(0,0,W,H);

    pts.forEach(p => {
      const dx=p.x-mx, dy=p.y-my, d=Math.hypot(dx,dy);
      if(d<120){ p.x+=dx/d*.7; p.y+=dy/d*.7; }
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.gold
        ? `rgba(0,212,255,${p.a})`
        : `rgba(0,128,255,${p.a*.5})`;
      ctx.fill();
    });

    /* connections */
    pts.forEach((a,i)=>{
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j], d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<100){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,212,255,${(1-d/100)*.09})`;
          ctx.lineWidth=.5; ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawEnter);
  }

  resize();
  window.addEventListener('resize', resize);
  drawEnter();

  /* — Loading counter — */
  let count = 0;
  const blocks = '▓';
  const empty  = '░';
  const ctr = document.getElementById('enter-counter');
  setInterval(()=>{
    count = (count+1)%11;
    ctr.textContent = blocks.repeat(count)+empty.repeat(10-count);
  }, 300);

  /* — ENTER button — */
  const btn       = document.getElementById('enter-btn');
  const loadWrap  = document.getElementById('enter-loading');
  const loadFill  = document.getElementById('load-fill');
  const loadText  = document.getElementById('load-text');
  const enterScr  = document.getElementById('enter-screen');
  const profilePg = document.getElementById('profile-page');

  const loadMsgs = [
    'INITIALIZING SYSTEM...',
    'LOADING ASSETS...',
    'ESTABLISHING LINK...',
    'DECRYPTING PROFILE...',
    'ACCESS GRANTED'
  ];

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    loadWrap.classList.remove('hidden');
    let pct = 0, msgIdx = 0;
    const iv = setInterval(()=>{
      pct += Math.random()*4+1;
      if(pct>100) pct=100;
      loadFill.style.width = pct+'%';
      const m = Math.floor((pct/100)*loadMsgs.length);
      if(m!==msgIdx && m<loadMsgs.length){ msgIdx=m; loadText.textContent=loadMsgs[m]; }
      if(pct>=100){
        clearInterval(iv);
        loadText.textContent='ACCESS GRANTED ✓';
        setTimeout(()=>{
          enterScr.classList.add('fade-out');
          profilePg.classList.remove('page-hidden');
          setTimeout(()=>{
            enterScr.style.display='none';
            initProfile();
          }, 900);
        }, 600);
      }
    }, 60);
  });

})();


/* ─────────────────────────────────────
   2.  PROFILE INITIALIZER
───────────────────────────────────── */
function initProfile() {
  initBackground();
  initTabs();
  initGallery();
  initMusicPlayer();
  initBioStats();
  initTabInk();
  animateHeaderStats();
}


/* ─────────────────────────────────────
   3.  BACKGROUND CANVAS
───────────────────────────────────── */
function initBackground() {
  const c = document.getElementById('bg-canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let W, H, particles=[];

  function resize(){
    W=c.width=window.innerWidth;
    H=c.height=window.innerHeight;
    buildParticles();
  }

  function buildParticles(){
    particles=[];
    const n=Math.floor((W*H)/12000);
    for(let i=0;i<n;i++){
      particles.push({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.2,
        r:Math.random()*1.2+.2,
        a:Math.random()*.5+.1, cyan:Math.random()>.5
      });
    }
  }

  let mx=-9999, my=-9999;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});

  function draw(){
    ctx.clearRect(0,0,W,H);

    /* subtle grid */
    ctx.strokeStyle='rgba(0,212,255,.025)';
    ctx.lineWidth=.5;
    for(let x=0;x<W;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}

    particles.forEach(p=>{
      const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);
      if(d<90){p.x+=dx/d*.5;p.y+=dy/d*.5}
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.cyan?`rgba(0,212,255,${p.a})`:`rgba(0,100,255,${p.a*.6})`;
      ctx.fill();
    });

    particles.forEach((a,i)=>{
      for(let j=i+1;j<particles.length;j++){
        const b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<80){
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,212,255,${(1-d/80)*.06})`;
          ctx.lineWidth=.4;ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize',resize);
  draw();
}


/* ─────────────────────────────────────
   4.  TAB SWITCHING
───────────────────────────────────── */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
      moveInk(btn);
    });
  });
  /* set initial ink */
  const first = document.querySelector('.tab-btn.active');
  if(first) setTimeout(()=>moveInk(first),50);
}

function initTabInk() {
  const first = document.querySelector('.tab-btn.active');
  if(first) moveInk(first);
}

function moveInk(btn) {
  const ink = document.getElementById('tab-ink');
  const nav = document.querySelector('.tab-nav');
  if(!ink||!nav) return;
  const nr = nav.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  ink.style.left   = (br.left - nr.left) + 'px';
  ink.style.width  = br.width + 'px';
}


/* ─────────────────────────────────────
   5.  GALLERY — 3D tilt
───────────────────────────────────── */
function initGallery() {
  document.querySelectorAll('.g-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const cx=r.width/2, cy=r.height/2;
      const rx=((y-cy)/cy)*-10;
      const ry=((x-cx)/cx)*10;
      card.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
    });
  });
}


/* ─────────────────────────────────────
   6.  MUSIC PLAYER
───────────────────────────────────── */
function initMusicPlayer() {
  const NUM_EQ = 22;
  const eqWrap = document.getElementById('eq-bars');
  if(!eqWrap) return;
  const bars=[];
  for(let i=0;i<NUM_EQ;i++){
    const b=document.createElement('div');
    b.className='eq-bar'; b.style.height='3px'; eqWrap.appendChild(b); bars.push(b);
  }

  /* Circular visualizer on canvas */
  const mc = document.getElementById('music-canvas');
  const mctx = mc ? mc.getContext('2d') : null;
  let vizAngle=0;

  function drawViz(playing) {
    if(!mctx) return;
    const W=mc.width, H=mc.height, cx=W/2, cy=H/2, r=70;
    mctx.clearRect(0,0,W,H);

    /* outer glow ring */
    const grd=mctx.createRadialGradient(cx,cy,r-4,cx,cy,r+20);
    grd.addColorStop(0,playing?'rgba(0,212,255,.35)':'rgba(0,212,255,.08)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    mctx.beginPath(); mctx.arc(cx,cy,r+20,0,Math.PI*2);
    mctx.fillStyle=grd; mctx.fill();

    /* freq spikes */
    const spikes=64;
    for(let i=0;i<spikes;i++){
      const angle=(i/spikes)*Math.PI*2 + vizAngle;
      const amp = playing ? (Math.sin(Date.now()*.004+i*.5)*.5+.5)*30+8 : 4;
      const x1=cx+Math.cos(angle)*r, y1=cy+Math.sin(angle)*r;
      const x2=cx+Math.cos(angle)*(r+amp), y2=cy+Math.sin(angle)*(r+amp);
      mctx.beginPath(); mctx.moveTo(x1,y1); mctx.lineTo(x2,y2);
      const hue=180+i*2;
      mctx.strokeStyle=`hsla(${hue},100%,70%,${playing?.8:.25})`;
      mctx.lineWidth=1.5; mctx.stroke();
    }

    /* base circle */
    mctx.beginPath(); mctx.arc(cx,cy,r,0,Math.PI*2);
    mctx.strokeStyle=playing?'rgba(0,212,255,.5)':'rgba(0,212,255,.15)';
    mctx.lineWidth=1; mctx.stroke();

    if(playing) vizAngle+=.008;
    requestAnimationFrame(()=>drawViz(window._musicPlaying||false));
  }
  window._musicPlaying=false;
  drawViz(false);

  /* EQ animation */
  let eqInterval=null;
  function startEQ(){
    clearInterval(eqInterval);
    eqInterval=setInterval(()=>{
      bars.forEach((b,i)=>{
        const h=Math.abs(Math.sin(Date.now()*.003+i*.7))*36+Math.random()*12+4;
        b.style.height=Math.min(h,48)+'px';
      });
    },80);
  }
  function stopEQ(){
    clearInterval(eqInterval);
    bars.forEach(b=>b.style.height='3px');
  }

  /* vinyl */
  const vinyl=document.getElementById('vinyl-disc');

  /* state */
  let isPlaying=false;
  let player;
  let currentVol=75;
  let progInterval=null;
  let totalSec=213; // 3:33

  const btnPlay   = document.getElementById('btn-play');
  const btnPrev   = document.getElementById('btn-prev');
  const btnNext   = document.getElementById('btn-next');
  const btnVolDn  = document.getElementById('btn-vol-down');
  const btnVolUp  = document.getElementById('btn-vol-up');
  const volSlider = document.getElementById('vol-slider');
  const volFill   = document.getElementById('vol-fill');
  const volDisp   = document.getElementById('vol-display');
  const playIcon  = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const progFill  = document.getElementById('prog-fill');
  const progThumb = document.getElementById('prog-thumb');
  const tCur      = document.getElementById('t-cur');
  const tTot      = document.getElementById('t-tot');

  function fmtTime(s){ return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'); }
  if(tTot) tTot.textContent=fmtTime(totalSec);

  function setPlayState(playing){
    isPlaying=playing;
    window._musicPlaying=playing;
    if(playIcon)  playIcon.style.display  = playing?'none':'';
    if(pauseIcon) pauseIcon.style.display = playing?'':'none';
    if(vinyl) playing ? vinyl.classList.add('spinning') : vinyl.classList.remove('spinning');
    playing ? startEQ() : stopEQ();
    /* update progress */
    clearInterval(progInterval);
    if(playing){
      progInterval=setInterval(()=>{
        if(!player||!player.getCurrentTime) return;
        const cur=player.getCurrentTime();
        const tot=player.getDuration()||totalSec;
        const pct=(cur/tot)*100;
        if(progFill)  progFill.style.width=pct+'%';
        if(progThumb) progThumb.style.left=pct+'%';
        if(tCur) tCur.textContent=fmtTime(cur);
      },500);
    }
  }

  function setVolume(v){
    v=Math.max(0,Math.min(100,v));
    currentVol=v;
    if(volSlider) volSlider.value=v;
    if(volFill)   volFill.style.width=v+'%';
    if(volDisp)   volDisp.textContent=v+'%';
    if(player&&player.setVolume) player.setVolume(v);
  }

  /* YouTube IFrame API */
  window.onYouTubeIframeAPIReady=function(){
    player=new YT.Player('yt-player',{
      events:{
        onReady:()=>{ player.setVolume(currentVol); },
        onStateChange:e=>{ setPlayState(e.data===YT.PlayerState.PLAYING); }
      }
    });
  };
  const ytScript=document.createElement('script');
  ytScript.src='https://www.youtube.com/iframe_api';
  document.head.appendChild(ytScript);

  /* Control handlers */
  if(btnPlay) btnPlay.addEventListener('click',()=>{
    if(!player) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
  });

  if(btnPrev) btnPrev.addEventListener('click',()=>{ if(player&&player.seekTo) player.seekTo(0,true); });
  if(btnNext) btnNext.addEventListener('click',()=>{ if(player&&player.seekTo) player.seekTo(0,true); });

  if(btnVolDn) btnVolDn.addEventListener('click',()=>setVolume(currentVol-10));
  if(btnVolUp) btnVolUp.addEventListener('click',()=>setVolume(currentVol+10));

  if(volSlider) volSlider.addEventListener('input',()=>setVolume(parseInt(volSlider.value)));

  /* Clickable progress */
  const progTrack=document.getElementById('prog-track');
  if(progTrack) progTrack.addEventListener('click',e=>{
    if(!player||!player.getDuration) return;
    const r=progTrack.getBoundingClientRect();
    const pct=(e.clientX-r.left)/r.width;
    player.seekTo(pct*player.getDuration(),true);
  });
}


/* ─────────────────────────────────────
   7.  BIO STATS COUNT-UP
───────────────────────────────────── */
function initBioStats() {
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.bstat-n').forEach(el=>{
        const target=parseFloat(el.dataset.target);
        const suf=el.dataset.suf||'';
        const isFloat=String(target).includes('.');
        const steps=80, dur=1200;
        let i=0;
        const iv=setInterval(()=>{
          i++;
          const v=target*(i/steps);
          el.textContent=(isFloat?v.toFixed(1):Math.floor(v))+suf;
          if(i>=steps){ el.textContent=target+suf; clearInterval(iv); }
        },dur/steps);
      });
      /* trigger bar fills */
      e.target.querySelectorAll('.bstat-fill').forEach(bar=>bar.classList.add('loaded'));
      obs.unobserve(e.target);
    });
  },{threshold:.4});
  const bs=document.getElementById('bio-stats');
  if(bs) obs.observe(bs);
}


/* ─────────────────────────────────────
   8.  HEADER STATS ANIMATION
───────────────────────────────────── */
function animateHeaderStats() {
  const data=[{id:'hs1',val:247,suf:''},{id:'hs2',val:18,suf:'K'},{id:'hs3',val:4.9,suf:'★'}];
  data.forEach(({id,val,suf})=>{
    const el=document.getElementById(id); if(!el) return;
    const isFloat=String(val).includes('.');
    const steps=60,dur=1000;
    let i=0;
    setTimeout(()=>{
      const iv=setInterval(()=>{
        i++;
        const v=val*(i/steps);
        el.textContent=(isFloat?v.toFixed(1):Math.floor(v))+suf;
        if(i>=steps){ el.textContent=val+suf; clearInterval(iv); }
      },dur/steps);
    },400);
  });
}
