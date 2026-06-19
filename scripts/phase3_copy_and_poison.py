import os
import shutil
import re

src_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/coherent_suite"
dest_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/coherent_debug"

def inject_vulnerabilities():
    print(f"Copying workspace from {src_dir} to {dest_dir}...")
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)
    
    # Copy all files
    shutil.copytree(src_dir, dest_dir, ignore=shutil.ignore_patterns('node_modules', '.git'))
    
    server_path = os.path.join(dest_dir, "server", "server.ts")
    if not os.path.exists(server_path):
        print(f"Error: server.ts not found at {server_path}")
        return
        
    print("Reading server.ts to inject vulnerabilities...")
    with open(server_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. SQL Injection: Replace database mock insert with vulnerable SQL string concatenation
    print("Injecting Vulnerability 1: SQL Injection...")
    orig_db = """    // Parametric database injection insertion mock (using SQL variables in normal flow)
    const listId = crypto.randomUUID();"""
    
    buggy_db = """    // VULNERABLE: Direct string interpolation into raw SQL query (simulated SQL injection)
    const listId = crypto.randomUUID();
    const sqlQuery = "INSERT INTO vocabulary_lists (id, title, count) VALUES ('" + listId + "', '" + title + "', " + dataRows.length + ");";
    console.log("Database Executing: " + sqlQuery);"""
    
    if orig_db in content:
        content = content.replace(orig_db, buggy_db)
    else:
        # Fallback regex replace
        content = re.sub(
            r'// Parametric database injection.*?const listId = crypto\.randomUUID\(\);',
            buggy_db,
            content,
            flags=re.DOTALL
        )

    # 2. PII Leakage: Bypass PII scrubbing
    print("Injecting Vulnerability 2: PII Leakage...")
    orig_pii = "const { scrubbedText, replacementMap } = scrubPII(content);"
    buggy_pii = """// VULNERABLE: Bypassing PII scrubbing, logging and saving raw user input
    // const { scrubbedText, replacementMap } = scrubPII(content);
    const scrubbedText = content;
    const replacementMap = {};
    console.log("Processing raw student journal payload: " + content);"""
    
    content = content.replace(orig_pii, buggy_pii)

    # 3. Input Range Overflow: Comment out playback speed checks
    print("Injecting Vulnerability 3: Playback Speed Range Overflow...")
    orig_speed = "validatePlaybackSpeed(speed);"
    buggy_speed = """// VULNERABLE: Playback speed slider check is disabled
    // validatePlaybackSpeed(speed);
    console.log("Audio Synthesis requested speed parameter: " + speed);"""
    
    content = content.replace(orig_speed, buggy_speed)

    # 4. Auth Bypass: Remove token middleware checks
    print("Injecting Vulnerability 4: Auth Bypass...")
    # Find auth verification and bypass it
    orig_auth = "const authHeader = req.headers.authorization;"
    buggy_auth = """// VULNERABLE: Authorization checks bypassed. Accepts all requests without valid JWT token.
  // const authHeader = req.headers.authorization;
  const authHeader = "Bearer admin-bypass-token";"""
    content = content.replace(orig_auth, buggy_auth)

    # 5. Unhandled File Upload Error: Remove try-catch and file end check
    print("Injecting Vulnerability 5: Unhandled File Upload Error...")
    orig_file = """    if (!file || !file.name || !file.name.endsWith('.csv')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid file upload. Please provide a valid CSV file.'
        }
      });
    }"""
    buggy_file = """    // VULNERABLE: No file verification check, potential server crash on empty or malformed files
    // if (!file || !file.name || !file.name.endsWith('.csv')) { ... }"""
    
    content = content.replace(orig_file, buggy_file)

    with open(server_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully injected all 5 vulnerabilities into coherent_debug/server/server.ts!")

if __name__ == "__main__":
    inject_vulnerabilities()
