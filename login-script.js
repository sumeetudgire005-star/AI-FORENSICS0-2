if(localStorage.auth)location.href='index.html';
document.getElementById('googleBtn').onclick=function(){
this.textContent='Authenticating...';
this.disabled=true;
setTimeout(function(){localStorage.auth='true';localStorage.user='Agent Smith';location.href='index.html'},1000);
};
document.getElementById('loginForm').onsubmit=function(e){
e.preventDefault();
var em=document.getElementById('email').value,pw=document.getElementById('password').value;
if(!em||!pw){alert('Fill all fields');return;}
var b=this.querySelector('.submit-btn');
b.textContent='AUTHORIZING...';
b.disabled=true;
setTimeout(function(){localStorage.auth='true';localStorage.user=em.split('@')[0];location.href='index.html'},1000);
};
document.querySelector('.recovery').onclick=function(e){e.preventDefault();alert('Recovery link sent')};
