import streamlit as st
import requests
import base64
from io import BytesIO
from PIL import Image

st.set_page_config(
    page_title="AI Forensic Evidence Verification",
    page_icon="🔍",
    layout="wide"
)

st.markdown("""
<style>
    .main-header {
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    .main-header h1 {
        color: white;
        margin: 0;
    }
    .main-header p {
        color: #e0e0e0;
        margin: 0.5rem 0 0 0;
    }
    .verdict-authentic {
        color: #10b981;
        font-weight: bold;
    }
    .verdict-suspicious {
        color: #f59e0b;
        font-weight: bold;
    }
    .verdict-tampered {
        color: #ef4444;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = None
if 'case_id' not in st.session_state:
    st.session_state.case_id = None

st.markdown("""
<div class="main-header">
    <h1>🔍 AI Forensic Evidence Verification Engine</h1>
    <p>Chakravyuh 2.0 | Detect deepfakes, document fraud, voice cloning</p>
</div>
""", unsafe_allow_html=True)

with st.sidebar:
    st.header("⚙️ Settings")
    api_url = st.text_input("Backend API URL", value="http://localhost:8001")
    
    if st.session_state.case_id:
        st.success(f"Case ID: {st.session_state.case_id}")
    
    if st.button("🔄 New Analysis"):
        st.session_state.analysis_results = None
        st.session_state.case_id = None
        st.rerun()
    
    st.markdown("---")
    st.markdown("### About")
    st.markdown("This system uses AI to detect tampering in digital evidence for legal proceedings.")

if st.session_state.analysis_results is None:
    st.header("📤 Upload Evidence Files")
    st.markdown("Upload images, documents, or audio files for forensic analysis")
    
    uploaded_files = st.file_uploader(
        "Choose files",
        type=['jpg', 'jpeg', 'png', 'pdf', 'wav', 'mp3'],
        accept_multiple_files=True
    )
    
    if uploaded_files:
        st.write(f"**{len(uploaded_files)} file(s) selected:**")
        for file in uploaded_files:
            st.write(f"- {file.name} ({file.size / 1024:.1f} KB)")
    
    if st.button("🔬 Analyze Evidence", type="primary", disabled=not uploaded_files):
        with st.spinner("Analyzing evidence... This may take a moment"):
            try:
                files = [('files', (f.name, f.getvalue(), f.type)) for f in uploaded_files]
                response = requests.post(f"{api_url}/analyze", files=files, timeout=120)
                
                if response.status_code == 200:
                    st.session_state.analysis_results = response.json()
                    st.session_state.case_id = st.session_state.analysis_results['case_id']
                    st.rerun()
                else:
                    st.error(f"Analysis failed: {response.text}")
            except Exception as e:
                st.error(f"Error: {str(e)}")
                st.info("Make sure the backend is running: `python main.py`")

else:
    results = st.session_state.analysis_results
    
    st.header("📊 Analysis Summary")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Files", len(results['results']))
    
    with col2:
        tampered = sum(1 for r in results['results'] if r['final_verdict'] == 'TAMPERED')
        st.metric("Tampered", tampered, delta=None if tampered == 0 else "⚠️")
    
    with col3:
        st.metric("Processing Time", f"{results['processing_time_seconds']}s")
    
    with col4:
        tampered_count = sum(1 for r in results['results'] if r['final_verdict'] == 'TAMPERED')
        suspicious_count = sum(1 for r in results['results'] if r['final_verdict'] == 'SUSPICIOUS')
        if tampered_count > 0:
            risk = "HIGH"
            risk_color = "🔴"
        elif suspicious_count > 0:
            risk = "MEDIUM"
            risk_color = "🟡"
        else:
            risk = "LOW"
            risk_color = "🟢"
        st.metric("Risk Level", f"{risk_color} {risk}")
    
    st.markdown("---")
    
    st.header("🔍 Evidence Analysis")
    
    for i, result in enumerate(results['results'], 1):
        with st.expander(f"📄 Evidence #{i}: {result['filename']}", expanded=True):
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.subheader("Verdict")
                verdict = result['final_verdict']
                confidence = result['final_confidence']
                
                if verdict == 'AUTHENTIC':
                    st.markdown(f'<p class="verdict-authentic">✓ {verdict} ({confidence:.1%} confidence)</p>', unsafe_allow_html=True)
                elif verdict == 'SUSPICIOUS':
                    st.markdown(f'<p class="verdict-suspicious">⚠ {verdict} ({confidence:.1%} confidence)</p>', unsafe_allow_html=True)
                else:
                    st.markdown(f'<p class="verdict-tampered">✗ {verdict} ({confidence:.1%} confidence)</p>', unsafe_allow_html=True)
                
                st.write("**Reasoning:**", result['reasoning'])
                
                with st.expander("🔧 Technical Details"):
                    st.json(result)
            
            with col2:
                if 'ela_heatmap_b64' in result and result['ela_heatmap_b64']:
                    try:
                        img_data = base64.b64decode(result['ela_heatmap_b64'])
                        img = Image.open(BytesIO(img_data))
                        st.image(img, caption="ELA Heatmap", use_container_width=True)
                    except:
                        pass
                
                if 'spectrogram_b64' in result and result['spectrogram_b64']:
                    try:
                        img_data = base64.b64decode(result['spectrogram_b64'])
                        img = Image.open(BytesIO(img_data))
                        st.image(img, caption="Audio Spectrogram", use_container_width=True)
                    except:
                        pass
    
    st.markdown("---")
    
    st.header("📝 Forensic Narrative")
    st.markdown(results.get('narrative', 'No narrative available'))
    
    st.markdown("---")
    
    st.header("📥 Download Report")
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📄 Download PDF Report", type="primary"):
            try:
                report_url = f"{api_url}/report/{st.session_state.case_id}"
                st.markdown(f"[Click here to download]({report_url})")
            except:
                st.error("Could not generate download link")
    
    with col2:
        if st.button("🔗 View SHA-256 Chain"):
            try:
                chain_response = requests.get(f"{api_url}/chain/{st.session_state.case_id}")
                if chain_response.status_code == 200:
                    st.json(chain_response.json())
            except:
                st.error("Could not fetch chain data")
