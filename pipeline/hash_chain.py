import hashlib
import json
import time
from datetime import datetime

class EvidenceChain:
    def __init__(self, case_id: str):
        self.case_id = case_id
        self.chain = []
        self.start_time = time.monotonic()
    
    def _hash_data(self, data: str) -> str:
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    
    def _get_timestamp(self) -> str:
        return datetime.utcnow().isoformat() + 'Z'
    
    def add_file(self, filepath: str) -> str:
        with open(filepath, 'rb') as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        
        prev_hash = self.chain[-1]['sha256'] if self.chain else '0' * 64
        
        entry = {
            'step': len(self.chain) + 1,
            'event': f'File uploaded: {filepath}',
            'sha256': file_hash,
            'timestamp': self._get_timestamp(),
            'prev_hash': prev_hash
        }
        self.chain.append(entry)
        return file_hash
    
    def add_analysis_result(self, result: dict) -> str:
        result_json = json.dumps(result, sort_keys=True)
        result_hash = self._hash_data(result_json)
        
        prev_hash = self.chain[-1]['sha256'] if self.chain else '0' * 64
        
        entry = {
            'step': len(self.chain) + 1,
            'event': f'Analysis completed: {result.get("filename", "unknown")}',
            'sha256': result_hash,
            'timestamp': self._get_timestamp(),
            'prev_hash': prev_hash
        }
        self.chain.append(entry)
        return result_hash
    
    def add_report(self, report_path: str) -> str:
        with open(report_path, 'rb') as f:
            report_hash = hashlib.sha256(f.read()).hexdigest()
        
        prev_hash = self.chain[-1]['sha256'] if self.chain else '0' * 64
        
        entry = {
            'step': len(self.chain) + 1,
            'event': f'Report generated: {report_path}',
            'sha256': report_hash,
            'timestamp': self._get_timestamp(),
            'prev_hash': prev_hash
        }
        self.chain.append(entry)
        return report_hash
    
    def get_chain_log(self):
        return self.chain
    
    def verify_chain_integrity(self) -> bool:
        for i in range(1, len(self.chain)):
            if self.chain[i]['prev_hash'] != self.chain[i-1]['sha256']:
                return False
        return True
    
    def export_chain_json(self) -> str:
        return json.dumps({
            'case_id': self.case_id,
            'chain': self.chain,
            'verified': self.verify_chain_integrity()
        }, indent=2)
