// 简单的纸屑/彩带效果 + 爱心动画
(function(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext && canvas.getContext('2d');
  let w, h, pieces = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function random(min,max){return Math.random()*(max-min)+min}

  function spawnConfetti(count){
    pieces = [];
    for(let i=0;i<count;i++){
      pieces.push({x:random(0,w),y:-10,vy:random(1,4),vx:random(-2,2),size:random(6,12),angle:random(0,360),color:`hsl(${random(0,360)},70%,60%)`});
    }
  }

  function update(){
    if(!ctx) return;
    ctx.clearRect(0,0,w,h);
    for(let p of pieces){
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.angle += 4;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.angle*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      ctx.restore();
    }
    // 移除落地的
    pieces = pieces.filter(p=>p.y < h + 40);
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  // 爱心动画
  function spawnHeart(x,y){
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = '💖';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2400);
  }

  // 按钮交互
  const btn = document.getElementById('surpriseBtn');
  const qrBtn = document.getElementById('qrBtn');
  const qrPanel = document.getElementById('qrPanel');
  const qrImage = document.getElementById('qrImage');
  btn.addEventListener('click',()=>{
    spawnConfetti(140);
    for(let i=0;i<18;i++){
      setTimeout(()=>spawnHeart(window.innerWidth*0.6,window.innerHeight*0.4 + random(-60,60)), i*120);
    }
  });

  function refreshQr(){
    const target = window.location.href;
    const base = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=';
    qrImage.src = base + encodeURIComponent(target);
  }

  qrBtn.addEventListener('click',()=>{
    const hidden = qrPanel.hasAttribute('hidden');
    if(hidden){
      refreshQr();
      qrPanel.removeAttribute('hidden');
      qrBtn.textContent = '隐藏二维码';
    }else{
      qrPanel.setAttribute('hidden','hidden');
      qrBtn.textContent = '生成微信二维码';
    }
  });

  // 页面任意处点击也产生小爱心
  document.addEventListener('click', (e)=>{
    spawnHeart(e.clientX, e.clientY);
  });

})();
