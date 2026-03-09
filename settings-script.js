if (localStorage.getItem('auth') !== 'true') {
    window.location.href = 'login.html';
}

// Theme toggle
var theme = localStorage.getItem('theme') || 'dark';
var themeBtn = document.getElementById('themeBtn');
var themeSelect = document.getElementById('themeSelect');

function setTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light');
        themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        localStorage.setItem('theme', 'light');
        themeSelect.value = 'light';
    } else {
        document.body.classList.remove('light');
        themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        localStorage.setItem('theme', 'dark');
        themeSelect.value = 'dark';
    }
}

setTheme(theme);

themeBtn.addEventListener('click', function() {
    var current = localStorage.getItem('theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
});

themeSelect.addEventListener('change', function() {
    setTheme(this.value);
});

// Load profile data
function loadProfileData() {
    var user = localStorage.getItem('user') || 'Agent Smith';
    var email = localStorage.getItem('email') || 'agent.smith@agency.gov';
    var lab = localStorage.getItem('lab') || 'Renton Lab';
    
    document.getElementById('displayUser').textContent = user;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayLab').textContent = lab;
}

loadProfileData();

// Get all toggles and selects
var allToggles = document.querySelectorAll('.toggle input');
var allSelects = document.querySelectorAll('.select-input');

var twoFAToggle = document.getElementById('2faToggle');
var sessionTimeoutSelect = allSelects[1];
var notifAnalysisToggle = allToggles[1];
var notifSystemToggle = allToggles[2];
var autoDeleteToggle = allToggles[3];

// Load saved settings
function loadSettings() {
    var twoFA = localStorage.getItem('2fa') === 'true';
    var sessionTimeout = localStorage.getItem('sessionTimeout') || '30 minutes';
    var notifAnalysis = localStorage.getItem('notifAnalysis') !== 'false';
    var notifSystem = localStorage.getItem('notifSystem') !== 'false';
    var autoDelete = localStorage.getItem('autoDelete') === 'true';
    
    twoFAToggle.checked = twoFA;
    sessionTimeoutSelect.value = sessionTimeout;
    notifAnalysisToggle.checked = notifAnalysis;
    notifSystemToggle.checked = notifSystem;
    autoDeleteToggle.checked = autoDelete;
}

loadSettings();

// 2FA Toggle
twoFAToggle.addEventListener('change', function() {
    localStorage.setItem('2fa', this.checked);
    if (this.checked) {
        alert('Two-Factor Authentication enabled. You will receive a code via email on next login.');
    } else {
        alert('Two-Factor Authentication disabled.');
    }
});

// Session Timeout
sessionTimeoutSelect.addEventListener('change', function() {
    localStorage.setItem('sessionTimeout', this.value);
    alert('Session timeout updated to: ' + this.value);
});

// Notification toggles
notifAnalysisToggle.addEventListener('change', function() {
    localStorage.setItem('notifAnalysis', this.checked);
    if (this.checked) {
        alert('Analysis completion notifications enabled.');
    } else {
        alert('Analysis completion notifications disabled.');
    }
});

notifSystemToggle.addEventListener('change', function() {
    localStorage.setItem('notifSystem', this.checked);
    if (this.checked) {
        alert('System update notifications enabled.');
    } else {
        alert('System update notifications disabled.');
    }
});

// Auto-delete toggle
autoDeleteToggle.addEventListener('change', function() {
    localStorage.setItem('autoDelete', this.checked);
    if (this.checked) {
        alert('Auto-delete enabled. Reports older than 90 days will be automatically removed.');
    } else {
        alert('Auto-delete disabled. Reports will be kept indefinitely.');
    }
});

// Notifications
document.getElementById('notifBtn').addEventListener('click', function() {
    var notifAnalysis = localStorage.getItem('notifAnalysis') !== 'false';
    var notifSystem = localStorage.getItem('notifSystem') !== 'false';
    
    var messages = [];
    if (notifAnalysis) {
        messages.push('• Analysis complete for case CHAK36-CS-05');
        messages.push('• New evidence uploaded to case DB-442');
    }
    if (notifSystem) {
        messages.push('• System update available');
    }
    
    if (messages.length > 0) {
        alert('Notifications:\n\n' + messages.join('\n'));
    } else {
        alert('No notifications. All notifications are disabled in settings.');
    }
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
    
    loadProfileData();
    
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

function clearData() {
    var confirmed = confirm('Are you sure you want to clear all data? This will remove:\n\n• All analysis history\n• All forensic reports\n• All uploaded evidence\n• Session data\n\nYour account settings will be preserved.\n\nThis action cannot be undone.');
    
    if (confirmed) {
        var auth = localStorage.getItem('auth');
        var user = localStorage.getItem('user');
        var email = localStorage.getItem('email');
        var lab = localStorage.getItem('lab');
        var theme = localStorage.getItem('theme');
        var twoFA = localStorage.getItem('2fa');
        var sessionTimeout = localStorage.getItem('sessionTimeout');
        var notifAnalysis = localStorage.getItem('notifAnalysis');
        var notifSystem = localStorage.getItem('notifSystem');
        var autoDelete = localStorage.getItem('autoDelete');
        
        localStorage.clear();
        sessionStorage.clear();
        
        localStorage.setItem('auth', auth);
        localStorage.setItem('user', user);
        localStorage.setItem('email', email);
        localStorage.setItem('lab', lab);
        localStorage.setItem('theme', theme);
        if (twoFA) localStorage.setItem('2fa', twoFA);
        if (sessionTimeout) localStorage.setItem('sessionTimeout', sessionTimeout);
        if (notifAnalysis) localStorage.setItem('notifAnalysis', notifAnalysis);
        if (notifSystem) localStorage.setItem('notifSystem', notifSystem);
        if (autoDelete) localStorage.setItem('autoDelete', autoDelete);
        
        alert('All analysis data has been cleared successfully.');
    }
}

function deleteAccount() {
    var confirmed = confirm('⚠️ WARNING ⚠️\n\nAre you sure you want to delete your account?\n\nThis will permanently delete:\n• Your account and profile\n• All analysis history\n• All forensic reports\n• All settings and preferences\n\nThis action CANNOT be undone!');
    
    if (confirmed) {
        var doubleCheck = confirm('This is your final warning.\n\nType YES in the next prompt to confirm account deletion.');
        if (doubleCheck) {
            localStorage.clear();
            sessionStorage.clear();
            alert('Your account has been permanently deleted.');
            window.location.href = 'login.html';
        }
    }
}

window.saveProfile = saveProfile;
window.logout = logout;
window.clearData = clearData;
window.deleteAccount = deleteAccount;
