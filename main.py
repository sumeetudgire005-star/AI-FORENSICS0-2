from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import time
from datetime import datetime

app = FastAPI(title="AI Forensic Evidence Verification Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp"
REPORTS_DIR = "reports"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

analysis_cache = {}

@app.get("/health")
async def health_check():
    import requests
    ollama_status = "offline"
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=2)
        if resp.status_code == 200:
            ollama_status = "online"
    except:
        pass
    
    return {
        "status": "healthy",
        "ollama": ollama_status,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze")
async def analyze_evidence(files: list[UploadFile] = File(...)):
    start_time = time.time()
    case_id = str(uuid.uuid4())[:8]
    
    case_dir = os.path.join(TEMP_DIR, case_id)
    os.makedirs(case_dir, exist_ok=True)
    
    from pipeline.router import route_file
    from pipeline.hash_chain import EvidenceChain
    from pipeline.llama_client import generate_forensic_narrative
    from pipeline.report_generator import generate_report
    
    chain = EvidenceChain(case_id)
    results = []
    
    for upload_file in files:
        filepath = os.path.join(case_dir, upload_file.filename)
        with open(filepath, 'wb') as f:
            content = await upload_file.read()
            f.write(content)
        
        chain.add_file(filepath)
        result = route_file(filepath)
        chain.add_analysis_result(result)
        results.append(result)
    
    case_meta = {
        'case_id': case_id,
        'date': datetime.now().strftime('%Y-%m-%d')
    }
    narrative = generate_forensic_narrative(results, case_meta)
    
    report_path = generate_report(case_id, results, narrative, chain.get_chain_log())
    final_report_path = os.path.join(REPORTS_DIR, os.path.basename(report_path))
    if os.path.exists(report_path):
        os.rename(report_path, final_report_path)
    
    if os.path.exists(final_report_path):
        chain.add_report(final_report_path)
    
    processing_time = time.time() - start_time
    
    analysis_cache[case_id] = {
        'results': results,
        'chain': chain.get_chain_log(),
        'report_path': final_report_path,
        'narrative': narrative
    }
    
    return {
        "case_id": case_id,
        "results": results,
        "report_url": f"/report/{case_id}",
        "chain": chain.get_chain_log(),
        "processing_time_seconds": round(processing_time, 2),
        "narrative": narrative
    }

@app.get("/report/{case_id}")
async def get_report(case_id: str):
    report_path = os.path.join(REPORTS_DIR, f"forensic_report_{case_id}.pdf")
    if os.path.exists(report_path):
        return FileResponse(report_path, media_type='application/pdf', filename=f"forensic_report_{case_id}.pdf")
    return JSONResponse({"error": "Report not found"}, status_code=404)

@app.get("/chain/{case_id}")
async def get_chain(case_id: str):
    if case_id in analysis_cache:
        return {"case_id": case_id, "chain": analysis_cache[case_id]['chain']}
    return JSONResponse({"error": "Case not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    print("Starting AI Forensic Evidence Verification Engine Backend...")
    print("Backend will be available at: http://localhost:8001")
    print("API docs at: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001)
