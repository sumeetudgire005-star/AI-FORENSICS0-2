if(!localStorage.auth)location.href='login.html';
var t=localStorage.theme||'dark',tb=document.getElementById('themeBtn');
function setT(m){
if(m=='light'){
document.body.classList.add('light');
tb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
localStorage.theme='light';
}else{
document.body.classList.remove('light');
tb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
localStorage.theme='dark';
}}
setT(t);
tb.onclick=function(){setT(localStorage.theme=='dark'?'light':'dark')};
document.getElementById('notifBtn').onclick=function(){alert('Notifications:\n\n• Analysis complete\n• New evidence uploaded\n• System update available')};
document.getElementById('profileBtn').onclick=showProfile;
function showProfile(){
var u=localStorage.user||'User',e=localStorage.email||'user@agency.gov',l=localStorage.lab||'Lab';
var m=document.createElement('div');
m.className='modal';
m.innerHTML='<div class="modal-content"><div class="modal-header"><h3>Profile</h3><button class="close-btn" onclick="this.closest(\'.modal\').remove()">×</button></div><div class="modal-body"><div class="form-group"><label>Name</label><input type="text" id="editName" value="'+u+'"></div><div class="form-group"><label>Email</label><input id="editEmail" value="'+e+'"></div><div class="form-group"><label>Lab</label><input id="editLab" value="'+l+'"></div></div><div class="modal-footer"><button class="btn-save" onclick="saveProfile()">Save</button><button class="btn-logout" onclick="logout()">Logout</button></div></div>';
document.body.appendChild(m);
}
function saveProfile(){
var n=document.getElementById('editName').value,e=document.getElementById('editEmail').value,l=document.getElementById('editLab').value;
if(!n||!e||!l){alert('Fill all fields');return;}
localStorage.user=n;localStorage.email=e;localStorage.lab=l;
document.querySelector('.modal').remove();
alert('Profile updated');
}
function logout(){
var m=document.querySelector('.modal');
if(m)m.remove();
localStorage.clear();
location.href='login.html';
}
window.saveProfile=saveProfile;
window.logout=logout;
var dz=document.getElementById('dropzone'),fi=document.getElementById('fileInput'),sb=document.getElementById('selectBtn'),ab=document.getElementById('analyzeBtn'),sf=null;
sb.onclick=function(){fi.click()};
dz.onclick=function(e){if(e.target!=sb)fi.click()};
fi.onchange=function(e){handleFile(e.target.files[0])};
dz.ondragover=function(e){e.preventDefault();dz.style.borderColor='#3B82F6'};
dz.ondragleave=function(){dz.style.borderColor='#2a2a2a'};
dz.ondrop=function(e){e.preventDefault();dz.style.borderColor='#2a2a2a';handleFile(e.dataTransfer.files[0])};
function handleFile(f){
if(!f)return;
var vt=['image/jpeg','image/png','video/mp4','audio/wav','audio/mpeg'];
if(vt.indexOf(f.type)==-1){alert('Invalid file');return;}
sf=f;
dz.querySelector('h3').textContent='Selected: '+f.name;
dz.querySelector('p').textContent='Size: '+(f.size/1024/1024).toFixed(2)+' MB';
ab.disabled=false;
}
ab.onclick=function(){if(sf){sessionStorage.file=sf.name;location.href='analysis.html'}};
var pc=document.querySelectorAll('.preview-card');
pc[0].onclick=function(){showInfo('AI Detection','Advanced neural network for deepfake detection.\n\n• 92.3% accuracy\n• Real-time processing\n• Multi-layer CNN\n• Face swap detection')};
pc[1].onclick=function(){showInfo('Digital Verification','Metadata analysis and integrity checks.\n\n• EXIF extraction\n• SHA-256 hash\n• Chain of custody\n• Timestamp validation')};
function showInfo(t,c){
var m=document.createElement('div');
m.className='modal';
m.innerHTML='<div class="modal-content"><div class="modal-header"><h3>'+t+'</h3><button class="close-btn" onclick="this.closest(\'.modal\').remove()">×</button></div><div class="modal-body"><p style="white-space:pre-line;line-height:1.8">'+c+'</p></div><div class="modal-footer"><button class="btn-save" onclick="this.closest(\'.modal\').remove()">OK</button></div></div>';
document.body.appendChild(m);
}
window.showInfo=showInfo;
if(navigator.storage&&navigator.storage.estimate){navigator.storage.estimate().then(function(est){var q=est.quota||0,u=est.usage||0,a=q-u;var ss=document.querySelector('.storage-size');if(ss){var gb=a/1024/1024/1024;if(gb>1000){ss.textContent=(gb/1024).toFixed(1)+' TB Available';}else{ss.textContent=gb.toFixed(1)+' GB Available';}}var sb=document.querySelector('.storage-used');if(sb&&q>0){var p=(u/q)*100;sb.style.width=p+'%';}});}
