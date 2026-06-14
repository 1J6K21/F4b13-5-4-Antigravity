import json
import os
import glob
import re

uuids = {
    ("Q16", "control"): "366689b8-b118-450f-addb-53fec45b4c48",
    ("Q16", "compressed"): "e0aa8023-acc0-4c33-906f-161723c6c944",
    ("Q16", "raw"): "71ea1ed4-3308-4363-8366-d495ead76ef5",
    ("Q16", "innovations"): "af2d97d5-b2b8-45ea-a964-e2db31119d55",
    
    ("Q17", "control"): "facdb9b5-1fab-4138-a675-73b2ec64d502",
    ("Q17", "compressed"): "d0bc4b74-325b-449e-b7d6-3e058288da61",
    ("Q17", "raw"): "4423c383-39bc-4587-9966-aecb65a9ba36",
    ("Q17", "innovations"): "27b54c91-4f92-4132-83de-121f2fc97d00",
    
    ("Q18", "control"): "3da3a3b7-9863-4af6-beae-e5dfe2504da7",
    ("Q18", "compressed"): "d1a7fff6-056a-4c28-9844-3ff395daffb2",
    ("Q18", "raw"): "ceeb820d-fc3f-41e9-8be9-2d1d18440839",
    ("Q18", "innovations"): "2093b0ea-29f0-4258-997d-206177aebdfc",
    
    ("Q19", "control"): "317a1142-b054-4cae-94ec-02fdb68c74a0",
    ("Q19", "compressed"): "46ad5212-f299-40be-acfb-2de56edbc8f3",
    ("Q19", "raw"): "3014a8fa-be9c-4607-8d40-9aa4e93e8157",
    ("Q19", "innovations"): "d34828a5-bc5f-4a39-b71d-a5327241ec39",
    
    ("Q20", "control"): "65f67125-6f1b-462c-8000-27da2e8b41b2",
    ("Q20", "compressed"): "677f289f-7f76-4b6d-842f-7d520ce66172",
    ("Q20", "raw"): "04c8b853-71c3-4cca-a09b-25a96ddf8181",
    ("Q20", "innovations"): "5d3d3326-0002-47f2-a874-1929f617486c"
}

results = []

def extract_text_from_uuid(uid):
    log_path = f"/Users/jonathankalsky/.gemini/antigravity-cli/brain/{uid}/.system_generated/logs/transcript.jsonl"
    if not os.path.exists(log_path):
        return f"ERROR: Transcript not found for {uid}"
        
    last_response = ""
    with open(log_path, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('source') == 'MODEL' and 'content' in data:
                    last_response = data['content']
            except:
                pass
    return last_response

for (q, variant), uid in uuids.items():
    text = extract_text_from_uuid(uid)
    
    # Try to find file paths mentioned in the text
    # e.g., /Users/jonathankalsky/.../something.md
    paths = set(re.findall(r'(/Users/jonathankalsky/[a-zA-Z0-9_\-\./]+\.(?:md|js))', text))
    for path in paths:
        if os.path.exists(path):
            with open(path, 'r') as f:
                content = f.read()
            text += f"\n\n--- CONTENT OF ARTIFACT {path} ---\n{content}\n--- END ARTIFACT ---"

    results.append({
        "question": q,
        "variant": variant,
        "answer": text,
        "uuid": uid
    })

with open('results_q16_q20.json', 'w') as f:
    json.dump(results, f, indent=2)

print("Saved results_q16_q20.json")
