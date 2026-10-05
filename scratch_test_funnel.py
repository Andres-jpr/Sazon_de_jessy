import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.94.133.110', port=22, username='upse', password='7788', timeout=10)

def test_funnel():
    # Let's test funnel with --set-path /sazon on default (443)
    cmd = "sudo tailscale funnel --bg --set-path /sazon http://127.0.0.1:3050"
    print(f"\n--- Running: {cmd} ---")
    stdin, stdout, stderr = ssh.exec_command(cmd, get_pty=True)
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            chunk = stdout.channel.recv(1024).decode('utf-8', errors='replace')
            sys.stdout.write(chunk)
            if "[sudo] password" in chunk.lower():
                stdin.write("7788\n")
                stdin.flush()
    print("\n--- Status ---")
    stdin2, stdout2, stderr2 = ssh.exec_command("tailscale funnel status")
    print(stdout2.read().decode('utf-8', errors='replace'))

test_funnel()
ssh.close()
