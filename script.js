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
    alert('Notifications:\n\n• Analysis complete for case CHAK36-CS-05\n• New evidence uploaded to case DB-442\n• System update available');
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

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var selectBtn = document.getElementById('selectBtn');
var analyzeBtn = document.getElementById('analyzeBtn');
var selectedFile = null;

selectBtn.addEventListener('click', function() {
    fileInput.click();
});

dropzone.addEventListener('click', function(e) {
    if (e.target !== selectBtn) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', function(e) {
    handleFile(e.target.files[0]);
});

dropzone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropzone.style.borderColor = '#3B82F6';
});

dropzone.addEventListener('dragleave', function() {
    dropzone.style.borderColor = '#374151';
});

dropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropzone.style.borderColor = '#374151';
    handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    if (!file) return;
    
    var validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/wav', 'audio/mpeg'];
    
    if (validTypes.indexOf(file.type) === -1) {
        alert('Invalid file type');
        return;
    }
    
    selectedFile = file;
    dropzone.querySelector('h3').textContent = 'Selected: ' + file.name;
    dropzone.querySelector('p').textContent = 'Size: ' + (file.size / 1024 / 1024).toFixed(2) + ' MB';
    analyzeBtn.disabled = false;
}

analyzeBtn.addEventListener('click', function() {
    if (!selectedFile) return;
    sessionStorage.setItem('file', selectedFile.name);
    window.location.href = 'analysis.html';
});

// Preview card interactions
var previewCards = document.querySelectorAll('.preview-card');

previewCards[0].addEventListener('click', function() {
    showInfoModal('AI-Powered Detection', 
        'Our advanced neural network system uses state-of-the-art deep learning algorithms to detect deepfakes and manipulated media.\n\n' +
        'Features:\n' +
        '• Multi-layer CNN architecture\n' +
        '• 92.3% accuracy rate\n' +
        '• Real-time processing\n' +
        '• Trained on 10M+ samples\n' +
        '• Detects face swaps, lip-sync, and full synthesis\n\n' +
        'The AI analyzes facial landmarks, temporal consistency, and artifact patterns to identify synthetic content.'
    );
});

previewCards[1].addEventListener('click', function() {
    showInfoModal('Digital Verification',
        'Comprehensive metadata analysis and integrity verification for digital evidence.\n\n' +
        'Verification Methods:\n' +
        '• EXIF metadata extraction\n' +
        '• Error Level Analysis (ELA)\n' +
        '• SHA-256 hash verification\n' +
        '• Chain of custody tracking\n' +
        '• Timestamp validation\n' +
        '• Geolocation verification\n\n' +
        'Ensures evidence authenticity and maintains forensic integrity for legal proceedings.'
    );
});

function showInfoModal(title, content) {
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content info-modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p style="white-space: pre-line; line-height: 1.8;">${content}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-save" onclick="this.closest('.modal').remove()">Got it</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.showInfoModal = showInfoModal;
