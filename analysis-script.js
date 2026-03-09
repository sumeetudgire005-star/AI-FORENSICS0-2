if(!localStorage.auth)location.href='login.html';
var t=localStorage.theme||'dark',tb=document.getElementById('themeBtn');
function setT(m){
if(m=='light'){document.body.classList.add('light');tb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';localStorage.theme='light';}else{document.body.classList.remove('light');tb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';localStorage.theme='dark';}}
setT(t);
tb.onclick=function(){setT(localStorage.theme=='dark'?'light':'dark')};
document.getElementById('notifBtn').onclick=function(){alert('Analysis in progress\n65% complete')};
document.getElementById('profileBtn').onclick=showProfile;
function showProfile(){
var u=localStorage.user||'User',e=localStorage.email||'user@agency.gov',l=localStorage.lab||'Lab';
var m=document.createElement('div');m.className='modal';
m.innerHTML='<div class="modal-content"><div class="modal-header"><h3>Profile</h3><button class="close-btn" onclick="this.closest(\'.modal\').remove()">×</button></div><div class="modal-body"><div class="form-group"><label>Name</label><input id="editName" value="'+u+'"></div><div class="form-group"><label>Email</label><input id="editEmail" value="'+e+'"></div><div class="form-group"><label>Lab</label><input id="editLab" value="'+l+'"></div></div><div class="modal-footer"><button class="btn-save" onclick="saveProfile()">Save</button><button class="btn-logout" onclick="logout()">Logout</button></div></div>';
document.body.appendChild(m);
}
function saveProfile(){
var n=document.getElementById('editName').value,e=document.getElementById('editEmail').value,l=document.getElementById('editLab').value;
if(!n||!e||!l){alert('Fill all fields');return;}
localStorage.user=n;localStorage.email=e;localStorage.lab=l;
document.querySelector('.modal').remove();alert('Updated');
}
function logout(){var m=document.querySelector('.modal');if(m)m.remove();localStorage.clear();location.href='login.html'}
window.saveProfile=saveProfile;window.logout=logout;
var c=document.getElementById('waveform'),ctx=c.getContext('2d'),particles=[],scanLine=0;
function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight;}
function Particle(){this.x=Math.random()*c.width;this.y=Math.random()*c.height;this.vx=(Math.random()-0.5)*2;this.vy=(Math.random()-0.5)*2;this.size=Math.random()*3+1;this.life=Math.random()*100;}
for(var i=0;i<80;i++)particles.push(new Particle());
function draw(){
var w=c.width,h=c.height;
ctx.fillStyle='rgba(10,10,10,0.1)';ctx.fillRect(0,0,w,h);
scanLine+=3;if(scanLine>w)scanLine=0;
var grad=ctx.createLinearGradient(scanLine-50,0,scanLine+50,0);
grad.addColorStop(0,'rgba(59,130,246,0)');grad.addColorStop(0.5,'rgba(59,130,246,0.3)');grad.addColorStop(1,'rgba(59,130,246,0)');
ctx.fillStyle=grad;ctx.fillRect(scanLine-50,0,100,h);
for(var i=0;i<particles.length;i++){
var pt=particles[i];
pt.x+=pt.vx;pt.y+=pt.vy;pt.life--;
if(pt.x<0||pt.x>w||pt.y<0||pt.y>h||pt.life<0){particles[i]=new Particle();continue;}
var dist=Math.abs(pt.x-scanLine);
if(dist<50){
ctx.fillStyle='rgba(59,130,246,'+(1-dist/50)+')';
ctx.shadowBlur=15;ctx.shadowColor='#3B82F6';
}else{
ctx.fillStyle='rgba(100,150,200,0.5)';
ctx.shadowBlur=0;
}
ctx.beginPath();ctx.arc(pt.x,pt.y,pt.size,0,Math.PI*2);ctx.fill();
}
ctx.shadowBlur=0;
}
window.onresize=resize;resize();setInterval(draw,30);
var p=0,f=document.getElementById('fill'),pc=document.getElementById('percent'),s3=document.getElementById('s3'),s4=document.getElementById('s4'),te=document.getElementById('time');
function upd(){
if(p<65){p+=Math.random()*2;if(p>65)p=65;f.style.width=p+'%';pc.textContent=Math.floor(p)+'%';
var s=Math.floor((165-p)*2.5),m=Math.floor(s/60);te.textContent=m+' mins '+(s%60)+' secs';setTimeout(upd,200);
}else{s3.classList.remove('active');s3.classList.add('done');s3.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Processing frames...</span>';
setTimeout(function(){s4.classList.add('active');s4.innerHTML='<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Generating report</span>';comp()},1000);}}
function comp(){
if(p<100){p+=Math.random()*3;if(p>100)p=100;f.style.width=p+'%';pc.textContent=Math.floor(p)+'%';
var s=Math.floor((100-p)*1.5),m=Math.floor(s/60);te.textContent=m+' mins '+(s%60)+' secs';setTimeout(comp,150);
}else{s4.classList.remove('active');s4.classList.add('done');s4.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Report ready</span>';te.textContent='Complete!';setTimeout(function(){location.href='report.html'},2000);}}
setTimeout(upd,500);
