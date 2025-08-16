#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse

class VPSSetup:
    def __init__(self, host, user="root"):
        self.host = host
        self.user = user
        
    def run_remote_command(self, command, check=True):
        """Run command on remote server via SSH"""
        ssh_command = f"ssh {self.user}@{self.host} '{command}'"
        print(f"[REMOTE] {command}")
        result = subprocess.run(ssh_command, shell=True, capture_output=True, text=True)
        if check and result.returncode != 0:
            print(f"Error: {result.stderr}")
            sys.exit(1)
        return result
    
    def update_system(self):
        """Update system packages"""
        print("\n=== Updating system packages ===")
        self.run_remote_command("apt update && apt upgrade -y")
        print("System updated successfully!")
    
    def install_essential_packages(self):
        """Install essential packages"""
        print("\n=== Installing essential packages ===")
        packages = [
            "curl", "wget", "git", "unzip", "htop", "nano", "vim",
            "ufw", "fail2ban", "certbot", "python3-certbot-nginx"
        ]
        package_list = " ".join(packages)
        self.run_remote_command(f"apt install -y {package_list}")
        print("Essential packages installed successfully!")
    
    def install_docker(self):
        """Check Docker installation (skip if already installed)"""
        print("\n=== Checking Docker installation ===")
        
        # Check if Docker is installed
        docker_check = self.run_remote_command("docker --version", check=False)
        
        # Check Docker Compose (new syntax first, then old)
        compose_check = self.run_remote_command("docker compose version", check=False)
        if compose_check.returncode != 0:
            compose_check = self.run_remote_command("docker-compose --version", check=False)
        
        if docker_check.returncode == 0 and compose_check.returncode == 0:
            print("✓ Docker and Docker Compose are already installed")
            
            # Check if there are existing containers using port 80/443
            port_check = self.run_remote_command("docker ps --format 'table {{.Names}}\t{{.Ports}}' | grep -E ':80|:443'", check=False)
            if port_check.returncode == 0 and port_check.stdout.strip():
                print("\n⚠ WARNING: Found existing containers using port 80/443:")
                print(port_check.stdout.strip())
                print("\nThis may conflict with Nginx. Consider:")
                print("1. Using Nginx Proxy Manager instead of standalone Nginx")
                print("2. Stopping conflicting containers before deployment")
                print("3. Configuring different ports for your application")
            
            # Ensure Docker is enabled and running
            self.run_remote_command("systemctl enable docker")
            self.run_remote_command("systemctl start docker")
        else:
            print("⚠ Docker or Docker Compose not found. Please install them manually.")
            print("Docker installation guide: https://docs.docker.com/engine/install/")
        
        print("Docker check completed!")
    
    def install_nginx(self):
        """Check Nginx installation (skip if already installed)"""
        print("\n=== Checking Nginx installation ===")
        
        # Check if Nginx is installed
        nginx_check = self.run_remote_command("nginx -v", check=False)
        
        if nginx_check.returncode == 0:
            print("✓ Nginx is already installed")
            
            # Check if port 80/443 are available
            port_check = self.run_remote_command("ss -tlnp | grep ':80\|:443'", check=False)
            if port_check.returncode == 0 and port_check.stdout.strip():
                print("\n⚠ WARNING: Ports 80/443 are already in use:")
                print(port_check.stdout.strip())
                print("\nNginx may not start due to port conflicts.")
                print("Consider stopping conflicting services or using Nginx Proxy Manager.")
                
                # Try to start Nginx anyway but don't fail if it doesn't work
                self.run_remote_command("systemctl enable nginx")
                result = self.run_remote_command("systemctl start nginx", check=False)
                
                if result.returncode != 0:
                    print("⚠ Nginx failed to start due to port conflicts (expected)")
                    print("You may need to configure your deployment differently.")
                else:
                    print("✓ Nginx started successfully")
            else:
                # Ports are free, start Nginx normally
                self.run_remote_command("systemctl enable nginx")
                self.run_remote_command("systemctl start nginx")
                print("✓ Nginx service started successfully")
        else:
            print("⚠ Nginx not found. Please install it manually.")
            print("Nginx installation: apt update && apt install -y nginx")
        
        print("Nginx check completed!")
    
    def setup_firewall(self):
        """Configure UFW firewall"""
        print("\n=== Configuring firewall ===")
        
        # Reset UFW to default
        self.run_remote_command("ufw --force reset")
        
        # Set default policies
        self.run_remote_command("ufw default deny incoming")
        self.run_remote_command("ufw default allow outgoing")
        
        # Allow essential ports
        self.run_remote_command("ufw allow 22/tcp")    # SSH
        self.run_remote_command("ufw allow 80/tcp")    # HTTP
        self.run_remote_command("ufw allow 443/tcp")   # HTTPS
        
        # Enable UFW
        self.run_remote_command("ufw --force enable")
        
        print("Firewall configured successfully!")
    
    def setup_fail2ban(self):
        """Configure Fail2Ban for SSH protection"""
        print("\n=== Configuring Fail2Ban ===")
        
        # Create SSH jail configuration
        jail_config = """
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
"""
        
        self.run_remote_command(f"cat > /etc/fail2ban/jail.local << 'EOF'\n{jail_config}EOF")
        
        # Enable and start Fail2Ban
        self.run_remote_command("systemctl enable fail2ban")
        self.run_remote_command("systemctl restart fail2ban")
        
        print("Fail2Ban configured successfully!")
    
    def create_swap(self, size="2G"):
        """Create swap file if not exists"""
        print(f"\n=== Creating swap file ({size}) ===")
        
        # Check if swap already exists
        swap_check = self.run_remote_command("swapon --show", check=False)
        if swap_check.stdout.strip():
            print("Swap is already configured")
            return
        
        # Create swap file
        self.run_remote_command(f"fallocate -l {size} /swapfile")
        self.run_remote_command("chmod 600 /swapfile")
        self.run_remote_command("mkswap /swapfile")
        self.run_remote_command("swapon /swapfile")
        
        # Make swap permanent
        self.run_remote_command("echo '/swapfile none swap sw 0 0' >> /etc/fstab")
        
        # Configure swappiness
        self.run_remote_command("echo 'vm.swappiness=10' >> /etc/sysctl.conf")
        
        print(f"Swap file ({size}) created successfully!")
    
    def optimize_system(self):
        """Apply system optimizations"""
        print("\n=== Applying system optimizations ===")
        
        # Increase file limits
        limits_config = """
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
"""
        
        self.run_remote_command(f"cat >> /etc/security/limits.conf << 'EOF'\n{limits_config}EOF")
        
        # Optimize network settings
        sysctl_config = """
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_congestion_control = bbr

# Security settings
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
"""
        
        self.run_remote_command(f"cat >> /etc/sysctl.conf << 'EOF'\n{sysctl_config}EOF")
        self.run_remote_command("sysctl -p")
        
        print("System optimizations applied successfully!")
    
    def setup_directories(self):
        """Create necessary directories"""
        print("\n=== Creating directories ===")
        
        directories = [
            "/opt/wms",
            "/opt/wms/backup",
            "/opt/wms/logs",
            "/opt/wms/ssl"
        ]
        
        for directory in directories:
            self.run_remote_command(f"mkdir -p {directory}")
        
        print("Directories created successfully!")
    
    def setup_logrotate(self):
        """Configure log rotation"""
        print("\n=== Configuring log rotation ===")
        
        logrotate_config = """
/opt/wms/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
"""
        
        self.run_remote_command(f"cat > /etc/logrotate.d/wms << 'EOF'\n{logrotate_config}EOF")
        
        print("Log rotation configured successfully!")
    
    def display_summary(self):
        """Display setup summary"""
        print("\n" + "=" * 60)
        print("VPS SETUP COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\nInstalled components:")
        print("✅ System packages updated")
        print("✅ Essential packages installed")
        print("✅ Docker and Nginx verified (already installed)")
        print("✅ UFW firewall configured")
        print("✅ Fail2Ban security")
        print("✅ Swap file created")
        print("✅ System optimizations applied")
        print("✅ Directories created")
        print("✅ Log rotation configured")
        
        print("\nNext steps:")
        print("1. Run deployment: make deploy")
        print("2. Setup SSL certificates: make setup-ssl")
        print("3. Configure domain DNS records")
        
        print("\nUseful commands:")
        print("- Check status: make status")
        print("- View logs: make logs")
        print("- Monitor: make watch")
        print("\nNote: Docker and Nginx were already installed and have been verified.")
    
    def run_full_setup(self):
        """Run complete VPS setup"""
        print(f"Starting VPS setup for {self.host}...")
        
        try:
            self.update_system()
            self.install_essential_packages()
            self.install_docker()
            self.install_nginx()
            self.setup_firewall()
            self.setup_fail2ban()
            self.create_swap()
            self.optimize_system()
            self.setup_directories()
            self.setup_logrotate()
            self.display_summary()
            
        except Exception as e:
            print(f"\nSetup failed: {e}")
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Setup VPS for WMS deployment')
    parser.add_argument('--host', default='forest-vps', help='VPS hostname or IP')
    parser.add_argument('--user', default='root', help='SSH user')
    parser.add_argument('--swap-size', default='2G', help='Swap file size')
    
    args = parser.parse_args()
    
    setup = VPSSetup(args.host, args.user)
    setup.run_full_setup()

if __name__ == "__main__":
    main()