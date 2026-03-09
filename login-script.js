if(localStorage.auth)location.href='index.html';
document.getElementById('googleBtn').onclick=function(){
var btn=this;
btn.textContent='Opening Google...';
btn.disabled=true;
var w=500,h=600,l=(screen.width-w)/2,t=(screen.height-h)/2;
var popup=window.open('','GoogleLogin','width='+w+',height='+h+',left='+l+',top='+t+',toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
if(popup){
popup.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sign in - Google Accounts</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.container{max-width:450px;width:100%;text-align:center}.logo{width:75px;height:24px;margin:0 auto 20px;background:#4285f4;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px}h1{font-size:24px;color:#202124;margin-bottom:8px;font-weight:400}p{color:#5f6368;font-size:16px;margin-bottom:30px}.account{border:1px solid #dadce0;border-radius:8px;padding:16px;margin-bottom:12px;cursor:pointer;display:flex;align-items:center;gap:16px;transition:background 0.2s}.account:hover{background:#f8f9fa}.avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px}.info{text-align:left;flex:1}.name{font-size:14px;color:#202124;font-weight:500}.email{font-size:12px;color:#5f6368;margin-top:2px}.btn{width:100%;padding:12px;background:#1a73e8;color:#fff;border:none;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;margin-top:8px}.btn:hover{background:#1765cc}.other{color:#1a73e8;font-size:14px;margin-top:16px;cursor:pointer;text-decoration:none;display:inline-block}.other:hover{text-decoration:underline}.footer{margin-top:40px;font-size:12px;color:#5f6368}</style></head><body><div class="container"><div class="logo">Google</div><h1>Sign in</h1><p>to continue to Deepfake</p><div class="account" onclick="selectAccount()"><div class="avatar">A</div><div class="info"><div class="name">Agent Smith</div><div class="email">agent.smith@agency.gov</div></div></div><div class="account" onclick="selectAccount()"><div class="avatar" style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%)">J</div><div class="info"><div class="name">John Doe</div><div class="email">john.doe@example.com</div></div></div><a class="other" onclick="useAnother()">Use another account</a><div class="footer">English (United States) ▼</div></div><script>function selectAccount(){document.body.innerHTML=\'<div class="container"><div class="logo">Google</div><h1>Signing in...</h1><p style="margin-top:40px">Please wait</p></div>\';setTimeout(function(){window.close()},800)}function useAnother(){document.body.innerHTML=\'<div class="container"><div class="logo">Google</div><h1>Sign in</h1><p>with your Google Account</p><input type="email" placeholder="Email or phone" style="width:100%;padding:14px;border:1px solid #dadce0;border-radius:4px;font-size:16px;margin-bottom:40px"><button class="btn" onclick="selectAccount()">Next</button></div>\'}</script></body></html>');
popup.document.close();
var checkClosed=setInterval(function(){
if(popup.closed){
clearInterval(checkClosed);
localStorage.auth='true';
localStorage.user='Agent Smith';
localStorage.email='agent.smith@agency.gov';
location.href='index.html';
}},500);
}else{
alert('Please allow popups for this site');
btn.textContent='Sign in with Google';
btn.disabled=false;
}
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
