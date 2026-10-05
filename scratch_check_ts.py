import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.94.133.110', port=22, username='upse', password='7788', timeout=10)

cmds = [
    "tailscale serve --help",
    "tailscale funnel --help",
]

for cmd in cmds:
    print(f"\n--- Running: {cmd} ---")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out.strip())
    if err:
        print("STDERR:", err.strip())

ssh.close()
