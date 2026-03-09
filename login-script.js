if (localStorage.getItem('auth') === 'true') {
    window.location.href = 'index.html';
}

document.getElementById('googleBtn').addEventListener('click', function() {
    this.textContent = 'Authenticating...';
    this.disabled = true;
    
    setTimeout(function() {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', 'Agent Smith');
        window.location.href = 'index.html';
    }, 1000);
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    var btn = this.querySelector('.submit-btn');
    btn.textContent = 'AUTHORIZING...';
    btn.disabled = true;
    
    setTimeout(function() {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', email.split('@')[0]);
        window.location.href = 'index.html';
    }, 1000);
});

document.querySelector('.recovery').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Recovery link sent to your email');
});
