if (localStorage.getItem('auth') !== 'true') {
    window.location.href = 'login.html';
}

// Apply saved theme on page load
var savedTheme = localStorage.getItem('theme') || 'dark';
var themeBtn = document.getElementById('themeBtn');

if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
} else {
    themeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// Theme toggle
var theme = localStorage.getItem('theme') || 'dark';

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
    alert('Notifications:\n\n• Analysis complete - Report ready\n• Deepfake detected: 92.3% confidence\n• Report generated successfully');
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

var canvas = document.getElementById('heatmap');
var ctx = canvas.getContext('2d');

function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
}

function draw() {
    var w = canvas.width;
    var h = canvas.height;
    
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0f1419');
    bg.addColorStop(1, '#1a2332');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    
    var lh = 3;
    var gap = 2;
    var num = Math.floor(h / (lh + gap));
    
    for (var i = 0; i < num; i++) {
        var y = i * (lh + gap);
        var intensity = Math.random();
        var color;
        
        if (intensity > 0.95) {
            color = 'rgba(255, 255, 200, ' + (0.8 + Math.random() * 0.2) + ')';
        } else if (intensity > 0.7) {
            color = 'rgba(34, 197, 94, ' + (0.3 + Math.random() * 0.3) + ')';
        } else if (intensity > 0.4) {
            color = 'rgba(22, 163, 74, ' + (0.2 + Math.random() * 0.2) + ')';
        } else {
            color = 'rgba(20, 83, 45, ' + (0.1 + Math.random() * 0.1) + ')';
        }
        
        ctx.fillStyle = color;
        var lw = w * (0.8 + Math.random() * 0.2);
        var xo = (w - lw) / 2;
        ctx.fillRect(xo, y, lw, lh);
    }
    
    var cy = h / 2;
    var ar = h * 0.2;
    
    for (var i = 0; i < 50; i++) {
        var x = Math.random() * w;
        var y = cy - ar/2 + Math.random() * ar;
        var size = 2 + Math.random() * 4;
        
        if (Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.6 + Math.random() * 0.4) + ')';
            ctx.fillRect(x, y, size, size);
        }
    }
}

window.addEventListener('resize', resize);
resize();

function copy() {
    var hash = document.getElementById('hash').textContent;
    navigator.clipboard.writeText(hash).then(function() {
        var btn = document.querySelector('.copy');
        btn.textContent = '✓';
        setTimeout(function() {
            btn.textContent = '📋';
        }, 2000);
    });
}

document.querySelector('.primary').addEventListener('click', function() {
    generatePDFReport();
});

function generatePDFReport() {
    // Create a printable version
    var printWindow = window.open('', '_blank');
    var reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Forensic Analysis Report - Deepfake Detection</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            color: #000;
            background: #fff;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
        }
        .header h1 { 
            font-size: 28px; 
            color: #0f172a; 
            margin-bottom: 10px;
        }
        .header p { 
            color: #64748b; 
            font-size: 14px;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section h2 { 
            font-size: 18px; 
            color: #0f172a; 
            margin-bottom: 15px;
            border-left: 4px solid #3B82F6;
            padding-left: 10px;
        }
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item { 
            padding: 15px; 
            background: #f8fafc; 
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .info-label { 
            font-size: 12px; 
            color: #64748b; 
            font-weight: 600;
            margin-bottom: 5px;
        }
        .info-value { 
            font-size: 16px; 
            font-weight: 700;
            color: #0f172a;
        }
        .alert-box {
            background: #fef2f2;
            border: 2px solid #ef4444;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .alert-title {
            font-size: 18px;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .alert-text {
            color: #991b1b;
            line-height: 1.6;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            margin-right: 10px;
        }
        .badge-red { background: #fee2e2; color: #dc2626; border: 1px solid #ef4444; }
        .badge-green { background: #d1fae5; color: #059669; border: 1px solid #10b981; }
        .badge-blue { background: #dbeafe; color: #2563eb; border: 1px solid #3B82F6; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
        }
        .timestamp {
            text-align: right;
            font-size: 12px;
            color: #64748b;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background: #f8fafc;
            font-weight: 700;
            color: #0f172a;
        }
        .hash-code {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background: #f1f5f9;
            padding: 10px;
            border-radius: 6px;
            word-break: break-all;
            color: #2563eb;
            border: 1px solid #cbd5e1;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FORENSIC ANALYSIS REPORT</h1>
        <p>Deepfake Detection & Media Verification System</p>
    </div>
    
    <div class="timestamp">
        Generated: ${new Date().toLocaleString()}
    </div>

    <div class="section">
        <h2>Case Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">CASE ID</div>
                <div class="info-value">CHAK36-CS-05</div>
            </div>
            <div class="info-item">
                <div class="info-label">SESSION ID</div>
                <div class="info-value">F-882-X90</div>
            </div>
            <div class="info-item">
                <div class="info-label">ANALYST</div>
                <div class="info-value">${localStorage.getItem('user') || 'Agent Smith'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">ANALYSIS DATE</div>
                <div class="info-value">${new Date().toLocaleDateString()}</div>
            </div>
        </div>
    </div>

    <div class="alert-box">
        <div class="alert-title">⚠️ CRITICAL FINDING: MANIPULATION DETECTED</div>
        <div class="alert-text">
            This media file has been flagged as potentially manipulated with a high confidence score. 
            The deepfake detection algorithm has identified significant anomalies consistent with 
            synthetic media generation or post-processing manipulation.
        </div>
    </div>

    <div class="section">
        <h2>Classification Status</h2>
        <p style="margin-bottom: 15px;">
            <span class="status-badge badge-red">MANIPULATED</span>
            <span class="status-badge badge-blue">IMAGE</span>
            <span class="status-badge badge-green">AUTHENTICATED</span>
        </p>
    </div>

    <div class="section">
        <h2>Analysis Summary</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Deepfake Score</td>
                <td><strong style="color: #dc2626;">92.3%</strong></td>
                <td><span class="status-badge badge-red">HIGH RISK</span></td>
            </tr>
            <tr>
                <td>ELA Score</td>
                <td>12.5%</td>
                <td>Moderate</td>
            </tr>
            <tr>
                <td>EXIF Status</td>
                <td>CLEAN</td>
                <td><span class="status-badge badge-green">VERIFIED</span></td>
            </tr>
            <tr>
                <td>Confidence Level</td>
                <td><strong>87.4%</strong></td>
                <td>High</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Technical Details</h2>
        <div class="info-item" style="margin-bottom: 15px;">
            <div class="info-label">ENCRYPTION</div>
            <div class="info-value">AES-256 Bit Secure</div>
        </div>
        <div class="info-item">
            <div class="info-label">SHA-256 HASH</div>
            <div class="hash-code">a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2</div>
        </div>
    </div>

    <div class="section">
        <h2>Analysis Methodology</h2>
        <p style="line-height: 1.8; color: #475569;">
            This forensic analysis was conducted using a multi-layered neural network trained on 
            extensive datasets of authentic and synthetic media. The system employs Error Level 
            Analysis (ELA), metadata verification, and deep learning-based pattern recognition to 
            identify potential manipulation indicators.
        </p>
    </div>

    <div class="section">
        <h2>Compliance & Security</h2>
        <ul style="line-height: 2; color: #475569; margin-left: 20px;">
            <li>✓ IT Act 65B Compliant</li>
            <li>✓ Local Processing - No Cloud Upload</li>
            <li>✓ SHA-256 Secured Chain of Custody</li>
            <li>✓ End-to-End Encryption Enabled</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>© 2024 Deepfake Enterprise Suite. All Rights Reserved.</strong></p>
        <p style="margin-top: 10px;">
            This report is generated for forensic analysis purposes only. 
            Results should be verified by qualified experts before legal proceedings.
        </p>
        <p style="margin-top: 10px; font-size: 10px;">
            Report ID: RPT-${Date.now()} | Server Status: Optimal | Processing Time: 2m 45s
        </p>
    </div>
</body>
</html>
    `;
    
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = function() {
        setTimeout(function() {
            printWindow.print();
        }, 250);
    };
});
