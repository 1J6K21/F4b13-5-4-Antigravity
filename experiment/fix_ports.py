import os
import json

base_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment"
workspaces = ["control_workspace", "fable_compressed_workspace", "fable_raw_workspace", "fable_innovations_workspace"]
projects = ["final_app", "startup_mvp", "nexus-core"]

next_script = "node -e \"const net=require('net');const s=net.createServer();s.listen(0,()=>{const p=s.address().port;s.close(()=>{require('child_process').spawn('npx',['next','dev','-p',p],{stdio:'inherit'})})})\""
vite_script = "node -e \"const net=require('net');const s=net.createServer();s.listen(0,()=>{const p=s.address().port;s.close(()=>{require('child_process').spawn('npx',['vite','--port',p,'--strictPort'],{stdio:'inherit'})})})\""

for w in workspaces:
    for p in projects:
        pkg_path = os.path.join(base_dir, w, p, "package.json")
        if os.path.exists(pkg_path):
            with open(pkg_path, "r") as f:
                pkg = json.load(f)
            
            if "scripts" in pkg and "dev" in pkg["scripts"]:
                dev_script = pkg["scripts"]["dev"]
                if "next dev" in dev_script and "node -e" not in dev_script:
                    pkg["scripts"]["dev"] = next_script
                    print(f"Fixed Next.js port in {w}/{p}")
                elif "vite" in dev_script and "node -e" not in dev_script:
                    pkg["scripts"]["dev"] = vite_script
                    print(f"Fixed Vite port in {w}/{p}")
            
            with open(pkg_path, "w") as f:
                json.dump(pkg, f, indent=2)

print("All projects updated to automatically find an open port!")
