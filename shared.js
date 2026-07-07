// Scroll reveal
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

// ── 3D corner swirl (requires THREE) ──
(function(){
  const canvas3d=document.getElementById('froyo-canvas');
  if(!canvas3d||typeof THREE==='undefined')return;
  const renderer=new THREE.WebGLRenderer({canvas:canvas3d,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0,0);
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(45,1,.1,100);
  cam.position.set(0,0,4.8);
  scene.add(new THREE.AmbientLight(0xffffff,.6));
  const d1=new THREE.DirectionalLight(0xffd6e8,1.4);d1.position.set(2,3,4);scene.add(d1);
  const d2=new THREE.DirectionalLight(0xb2f5ea,.8);d2.position.set(-3,-1,2);scene.add(d2);

  function buildSwirl(cA,cB){
    const g=new THREE.Group();
    const pts=[];
    for(let i=0;i<=20;i++){const t=i/20;pts.push(new THREE.Vector2(.45+.35*t+.05*Math.sin(t*Math.PI),-1.1+t))}
    g.add(new THREE.Mesh(new THREE.LatheGeometry(pts,40),new THREE.MeshPhongMaterial({color:0xffffff,shininess:80,transparent:true,opacity:.9})));
    const curve=new THREE.CatmullRomCurve3(Array.from({length:80},(_,i)=>{
      const t=i/79,a=t*Math.PI*6,r=.38*(1-t*.55);
      return new THREE.Vector3(r*Math.cos(a),-.05+t*1.8,r*Math.sin(a));
    }),false,'catmullrom',.3);
    const tg=new THREE.TubeGeometry(curve,200,.13,10,false);
    const pos=tg.attributes.position,cols=new Float32Array(pos.count*3);
    const ca=new THREE.Color(cA),cb=new THREE.Color(cB),cm=new THREE.Color();
    for(let i=0;i<pos.count;i++){const t=Math.min(Math.max((pos.getY(i)+.05)/1.8,0),1);cm.lerpColors(ca,cb,t);cols[i*3]=cm.r;cols[i*3+1]=cm.g;cols[i*3+2]=cm.b}
    tg.setAttribute('color',new THREE.BufferAttribute(cols,3));
    g.add(new THREE.Mesh(tg,new THREE.MeshPhongMaterial({vertexColors:true,shininess:120,specular:new THREE.Color(0xffffff)})));
    const tip=new THREE.Mesh(new THREE.SphereGeometry(.14,16,16),new THREE.MeshPhongMaterial({color:cB,shininess:150}));
    tip.position.copy(curve.getPoint(1));g.add(tip);
    g.position.y=-.5;return g;
  }
  const palettes=[[0xf9a8c9,0xfde68a],[0xa7f3d0,0x34d399],[0xb2e5de,0x5eead4],[0xd4567a,0xfda4af],[0xfde68a,0xfcba55]];
  let curP=0,tgtP=0,lerpT=1,fromA=palettes[0][0],fromB=palettes[0][1],toA=fromA,toB=fromB;
  const swirl=buildSwirl(fromA,fromB);scene.add(swirl);
  const base=swirl.children[1].geometry.attributes.position.clone();
  function sz(){const s=canvas3d.clientWidth;renderer.setSize(s,s,false)}
  sz();window.addEventListener('resize',sz);
  function uvc(g,cA,cB){
    g.children.forEach(ch=>{
      if(!ch.geometry)return;const ca=ch.geometry.attributes.color;if(!ca)return;
      const pos=ch.geometry.attributes.position;
      const a=new THREE.Color(cA),b=new THREE.Color(cB),m=new THREE.Color();
      for(let i=0;i<pos.count;i++){const t=Math.min(Math.max((pos.getY(i)+.05)/1.8,0),1);m.lerpColors(a,b,t);ca.setXYZ(i,m.r,m.g,m.b)}
      ca.needsUpdate=true;
    });
    const tip=g.children[g.children.length-1];
    if(tip&&tip.material&&!tip.geometry.attributes.color)tip.material.color.set(cB);
  }
  let sY=0,sV=0,lY=0,t=0,lt=0;
  const sects=Array.from(document.querySelectorAll('section,.ticker'));
  window.addEventListener('scroll',()=>{
    sY=window.scrollY;sV=sY-lY;lY=sY;
    canvas3d.classList.toggle('vis',sY>100);
    const mid=sY+innerHeight*.5;let pi=0;
    sects.forEach((s,i)=>{if(mid>=s.offsetTop)pi=Math.min(i,palettes.length-1)});
    if(pi!==tgtP){fromA=palettes[curP][0];fromB=palettes[curP][1];toA=palettes[pi][0];toB=palettes[pi][1];curP=tgtP;tgtP=pi;lerpT=0}
  },{passive:true});
  function anim(ts){
    requestAnimationFrame(anim);
    const dt=Math.min((ts-lt)/1000,.05);lt=ts;t+=dt;
    const prog=sY/(document.documentElement.scrollHeight-innerHeight)||0;
    const vb=Math.abs(sV)*.025;
    swirl.rotation.y+=(.4+vb)*dt;
    swirl.rotation.x=Math.sin(prog*Math.PI*2)*.22;
    swirl.position.y=-.5+Math.sin(t*.8)*.06;
    swirl.scale.setScalar(1+Math.min(Math.abs(sV)*.004,.12));
    const tube=swirl.children[1];
    if(tube){
      const pos=tube.geometry.attributes.position;
      for(let i=0;i<pos.count;i++){
        const bx=base.getX(i),by=base.getY(i),bz=base.getZ(i);
        const w=Math.sin(by*4+t*2.5+prog*Math.PI*4)*.015*(1+vb*2);
        pos.setXYZ(i,bx+w*Math.sign(bx),by,bz+w*Math.sign(bz));
      }
      pos.needsUpdate=true;tube.geometry.computeVertexNormals();
    }
    if(lerpT<1){
      lerpT=Math.min(lerpT+dt*1.5,1);
      uvc(swirl,new THREE.Color(fromA).lerp(new THREE.Color(toA),lerpT).getHex(),new THREE.Color(fromB).lerp(new THREE.Color(toB),lerpT).getHex());
    }
    sV*=.85;
    renderer.render(scene,cam);
  }
  anim(0);
})();
