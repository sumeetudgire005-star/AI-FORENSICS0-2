# ForensicAI - Forensic Analysis Platform

A web-based forensic analysis platform for evidence processing and deepfake detection.

## Features

- Secure login system
- Evidence file upload (JPG, PNG, MP4, WAV, MP3)
- Real-time analysis with progress tracking
- Comprehensive forensic reports
- ELA (Error Level Analysis) heatmap visualization
- Deepfake detection scoring

## How to Run Locally

1. Download all files to a folder on your computer

2. Open `login.html` in your web browser
   - You can double-click the file
   - Or right-click and select "Open with" your browser

3. Login with any credentials (demo mode)
   - Email: any@email.com
   - Password: anything

4. Upload a file and run analysis

## Files Structure

```
├── login.html          # Login page
├── login-styles.css    # Login styles
├── login-script.js     # Login logic
├── index.html          # Home/Upload page
├── styles.css          # Home styles
├── script.js           # Home logic
├── analysis.html       # Analysis progress page
├── analysis-styles.css # Analysis styles
├── analysis-script.js  # Analysis logic
├── report.html         # Final report page
├── report-styles.css   # Report styles
└── report-script.js    # Report logic
```

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Notes

- All data is stored locally in browser (localStorage)
- No server required
- Demo mode - accepts any login credentials
- File upload is simulated (no actual processing)
