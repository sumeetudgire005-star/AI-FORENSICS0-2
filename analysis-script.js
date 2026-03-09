if (localStorage.getItem('auth') !== 'true') {
    window.location.href = 'login.html';
}

// Theme toggle
var theme = localStorage.getItem('theme') || 'dark';
var themeBtn = document.getElementById('themeBtn');

function setTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light');
        themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light');
        themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        localStorage.setItem('theme', 'dark');
    }
}

setTheme(theme);

themeBtn.addEventListener('click', function() {
    var current = localStorage.getItem('theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// Notifications
document.getElementById('notifBtn').addEventListener('click', function() {
    alert('Notifications:\n\n• Analysis in progress - 65% complete\n• DeepScan module active\n• Estimated time: 2 mins remaining');
});

// Profile menu
document.getElementById('profileBtn').addEventListener('click', function() {
    showProfileModal();
});

function showProfileModal() {
    var user = localStorage.getItem('user') || 'User';
    var email = localStorage.getItem('email') || 'user@agency.gov';
    var lab = localStorage.getItem('lab') || 'Renton Lab';
    
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Profile Settings</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="editName" value="${user}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editEmail" value="${email}">
                </div>
                <div class="form-group">
                    <label>Lab/Department</label>
                    <input type="text" id="editLab" value="${lab}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-save" onclick="saveProfile()">Save Changes</button>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveProfile() {
    var name = document.getElementById('editName').value;
    var email = document.getElementById('editEmail').value;
    var lab = document.getElementById('editLab').value;
    
    if (!name || !email || !lab) {
        alert('Please fill in all fields');
        return;
    }
    
    localStorage.setItem('user', name);
    localStorage.setItem('email', email);
    localStorage.setItem('lab', lab);
    
    document.querySelector('.modal').remove();
    alert('Profile updated successfully!');
}

function logout() {
    var modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
    localStorage.clear();
    window.location.href = 'login.html';
}

window.saveProfile = saveProfile;
window.logout = logout;

var canvas = document.getElementById('waveform');
var ctx = canvas.getContext('2d');

function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
}

function draw() {
    var w = canvas.width;
    var h = canvas.height;
    var cy = h / 2;
    
    ctx.clearRect(0, 0, w, h);
    
    var barW = 3;
    var gap = 2;
    var num = Math.floor(w / (barW + gap));
    
    for (var i = 0; i < num; i++) {
        var x = i * (barW + gap);
        var amp = Math.random() * 0.8 + 0.2;
        var bh = (h * 0.7) * amp;
        
        var grad = ctx.createLinearGradient(0, cy - bh/2, 0, cy + bh/2);
        grad.addColorStop(0, '#1e3a5f');
        grad.addColorStop(0.5, '#3B82F6');
        grad.addColorStop(1, '#1e3a5f');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x, cy - bh/2, barW, bh);
    }
}

window.addEventListener('resize', resize);
resize();

setInterval(draw, 100);

var progress = 0;
var fill = document.getElementById('fill');
var percent = document.getElementById('percent');
var s3 = document.getElementById('s3');
var s4 = document.getElementById('s4');
var timeEl = document.getElementById('time');

function update() {
    if (progress < 65) {
        progress += Math.random() * 2;
        if (progress > 65) progress = 65;
        
        fill.style.width = progress + '%';
        percent.textContent = Math.floor(progress) + '%';
        
        var sec = Math.floor((165 - progress) * 2.5);
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        timeEl.textContent = m + ' mins ' + s + ' secs';
        
        setTimeout(update, 200);
    } else {
        s3.classList.remove('active');
        s3.classList.add('done');
        s3.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Processing temporal consistency frames...</span>';
        
        setTimeout(function() {
            s4.classList.add('active');
            s4.innerHTML = '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Final forensic report generation</span>';
            complete();
        }, 1000);
    }
}

function complete() {
    if (progress < 100) {
        progress += Math.random() * 3;
        if (progress > 100) progress = 100;
        
        fill.style.width = progress + '%';
        percent.textContent = Math.floor(progress) + '%';
        
        var sec = Math.floor((100 - progress) * 1.5);
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        timeEl.textContent = m + ' mins ' + s + ' secs';
        
        setTimeout(complete, 150);
    } else {
        s4.classList.remove('active');
        s4.classList.add('done');
        s4.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Final forensic report generation</span>';
        timeEl.textContent = 'Complete!';
        
        setTimeout(function() {
            window.location.href = 'report.html';
        }, 2000);
    }
}

setTimeout(update, 500);
