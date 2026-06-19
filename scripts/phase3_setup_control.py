import os
import shutil
import re

track1_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/control_suite/track1"
track2_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/control_suite/track2"
src_dir = "/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/coherent_suite"

def setup_control():
    # 1. Setup Track 1 workspace
    print(f"Setting up Track 1 Control workspace at {track1_dir}...")
    os.makedirs(track1_dir, exist_ok=True)
    with open(os.path.join(track1_dir, "README.md"), "w", encoding="utf-8") as f:
        f.write("# HanziFlow - Control Workspace (Track 1)\nThis directory is for the Control agent build of HanziFlow.\n")

    # 2. Setup Track 2 workspace (copy and poison)
    print(f"Setting up Track 2 Control workspace at {track2_dir}...")
    if os.path.exists(track2_dir):
        shutil.rmtree(track2_dir)
        
    shutil.copytree(src_dir, track2_dir, ignore=shutil.ignore_patterns('node_modules', '.git'))
    
    server_path = os.path.join(track2_dir, "server", "server.ts")
    if not os.path.exists(server_path):
        print(f"Error: server.ts not found at {server_path}")
        return
        
    print("Poisoning server.ts in control track 2...")
    with open(server_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Vulnerability 1: SQLi
    orig_db = """    // Parametric database injection insertion mock (using SQL variables in normal flow)
    const listId = crypto.randomUUID();"""
    buggy_db = """    // VULNERABLE: Direct string interpolation into raw SQL query (simulated SQL injection)
    const listId = crypto.randomUUID();
    const sqlQuery = "INSERT INTO vocabulary_lists (id, title, count) VALUES ('" + listId + "', '" + title + "', " + dataRows.length + ");";
    console.log("Database Executing: " + sqlQuery);"""
    content = content.replace(orig_db, buggy_db)

    # Vulnerability 2: PII Leakage
    orig_pii = "const { scrubbedText, replacementMap } = scrubPII(content);"
    buggy_pii = """// VULNERABLE: Bypassing PII scrubbing, logging and saving raw user input
    // const { scrubbedText, replacementMap } = scrubPII(content);
    const scrubbedText = content;
    const replacementMap = {};
    console.log("Processing raw student journal payload: " + content);"""
    content = content.replace(orig_pii, buggy_pii)

    # Vulnerability 3: Playback Speed Range Overflow
    orig_speed = "validatePlaybackSpeed(speed);"
    buggy_speed = """// VULNERABLE: Playback speed slider check is disabled
    // validatePlaybackSpeed(speed);
    console.log("Audio Synthesis requested speed parameter: " + speed);"""
    content = content.replace(orig_speed, buggy_speed)

    # Vulnerability 4: Auth Bypass
    orig_auth = "const authHeader = req.headers.authorization;"
    buggy_auth = """// VULNERABLE: Authorization checks bypassed. Accepts all requests without valid JWT token.
  // const authHeader = req.headers.authorization;
  const authHeader = "Bearer admin-bypass-token";"""
    content = content.replace(orig_auth, buggy_auth)

    # Vulnerability 5: Unhandled File Upload Error
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
        
    print("Successfully set up control workspaces!")

if __name__ == "__main__":
    setup_control()
