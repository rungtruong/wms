#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse
from pathlib import Path

class WMSDeployer:
    def __init__(self, host, user="root", project_dir="/opt/wms"):
        self.host = host
        self.user = user
        self.project_dir = project_dir
        self.local_project_dir = Path.cwd()
        
    def run_local_command(self, command, check=True):
        """Run command locally"""
        print(f"[LOCAL] {command}")
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if check and result.returncode != 0:
            print(f"Error: {result.stderr}")
            sys.exit(1)
        return result
    
    def run_remote_command(self, command, check=True):
        """Run command on remote server via SSH"""
        ssh_command = f"ssh {self.user}@{self.host} '{command}'"
        print(f"[REMOTE] {command}")
        result = subprocess.run(ssh_command, shell=True, capture_output=True, text=True)
        if check and result.returncode != 0:
            print(f"Error: {result.stderr}")
            sys.exit(1)
        return result
    
    def sync_files(self):
        """Sync project files to remote server"""
        print("\n=== Syncing files to remote server ===")
        
        # Create project directory on remote
        self.run_remote_command(f"mkdir -p {self.project_dir}")
        
        # Sync files using rsync
        rsync_command = f"rsync -avz --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='dist' --exclude='build' --exclude='.env*' . {self.user}@{self.host}:{self.project_dir}/"
        self.run_local_command(rsync_command)
        
        print("Files synced successfully!")
    
    def setup_environment(self):
        """Setup environment files on remote server"""
        print("\n=== Setting up environment ===")
        
        # Copy production environment files
        backend_env = f"""
# Database
DATABASE_URL="postgresql://postgres:forest_prod@postgres:5432/wms_db"

# Redis Cache
REDIS_URL="redis://redis:6379"

# JWT Authentication
JWT_SECRET="62c6c6b459c797b701237057cf8e9b7f89874d6b73aca097edf0c31b65bad49c"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="production"

# CORS Configuration
FRONTEND_URLS="https://wms.foresttruong.info,http://localhost:3000"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply.forestsolution@gmail.com"
SMTP_PASS="cgdr tprq zcuf ovru"
SMTP_FROM="WMS <noreply.forestsolution@gmail.com>"
"""
        
        frontend_env = f"""
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api-wms.foresttruong.info/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Warranty Management System
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=production

# JWT Configuration
NEXT_PUBLIC_JWT_EXPIRY=24h

# UI Configuration
NEXT_PUBLIC_ITEMS_PER_PAGE=10
NEXT_PUBLIC_MAX_FILE_SIZE=5242880

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
"""
        
        # Write environment files
        self.run_remote_command(f"cat > {self.project_dir}/backend/.env.production << 'EOF'\n{backend_env}EOF")
        self.run_remote_command(f"cat > {self.project_dir}/frontend/.env.production << 'EOF'\n{frontend_env}EOF")
        
        print("Environment files created successfully!")
    
    def install_dependencies(self):
        """Install Docker and Docker Compose if not present"""
        print("\n=== Installing dependencies ===")
        
        # Check if Docker is installed
        docker_check = self.run_remote_command("which docker", check=False)
        if docker_check.returncode != 0:
            print("Installing Docker...")
            self.run_remote_command("curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh")
            self.run_remote_command("systemctl enable docker && systemctl start docker")
        
        # Check if Docker Compose is installed
        compose_check = self.run_remote_command("which docker-compose", check=False)
        if compose_check.returncode != 0:
            print("Installing Docker Compose...")
            self.run_remote_command("curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose")
            self.run_remote_command("chmod +x /usr/local/bin/docker-compose")
        
        print("Dependencies installed successfully!")
    
    def deploy(self):
        """Deploy the application"""
        print("\n=== Deploying application ===")
        
        # Stop existing containers
        self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml down", check=False)
        
        # Remove old images
        self.run_remote_command("docker system prune -f", check=False)
        
        # Build and start containers
        self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml up -d --build")
        
        # Wait for services to be healthy
        print("Waiting for services to be healthy...")
        self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml ps")
        
        print("Application deployed successfully!")
    
    def check_port_conflicts(self):
        """Check if ports 80/443 are in use"""
        port_check = self.run_remote_command("ss -tlnp | grep ':80\|:443'", check=False)
        if port_check.returncode == 0 and port_check.stdout.strip():
            print("\n⚠ WARNING: Ports 80/443 are already in use:")
            print(port_check.stdout.strip())
            
            # Check if it's Nginx Proxy Manager
            docker_check = self.run_remote_command("docker ps --format 'table {{.Names}}\t{{.Ports}}' | grep nginx-proxy-manager", check=False)
            if docker_check.returncode == 0:
                print("\n🔍 Detected Nginx Proxy Manager running.")
                print("📖 Please see NGINX_PROXY_MANAGER_GUIDE.md for configuration options.")
                return True
            return True
        return False
    
    def setup_nginx(self, skip_on_conflict=True):
        """Setup Nginx reverse proxy"""
        print("\n=== Setting up Nginx ===")
        
        # Check for port conflicts
        if skip_on_conflict and self.check_port_conflicts():
            print("\n⚠ Skipping Nginx setup due to port conflicts.")
            print("Use --skip-nginx flag or configure Nginx Proxy Manager instead.")
            return False
        
        nginx_config = f"""
server {{
    listen 80;
    server_name wms.foresttruong.info;
    return 301 https://$server_name$request_uri;
}}

server {{
    listen 443 ssl http2;
    server_name wms.foresttruong.info;
    
    # SSL configuration (you need to setup SSL certificates)
    # ssl_certificate /path/to/certificate.crt;
    # ssl_certificate_key /path/to/private.key;
    
    location / {{
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }}
}}

server {{
    listen 80;
    server_name api.foresttruong.info;
    return 301 https://$server_name$request_uri;
}}

server {{
    listen 443 ssl http2;
    server_name api.foresttruong.info;
    
    # SSL configuration (you need to setup SSL certificates)
    # ssl_certificate /path/to/certificate.crt;
    # ssl_certificate_key /path/to/private.key;
    
    location / {{
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }}
}}
"""
        
        # Install Nginx if not present
        nginx_check = self.run_remote_command("which nginx", check=False)
        if nginx_check.returncode != 0:
            self.run_remote_command("apt update && apt install -y nginx")
        
        # Write Nginx configuration
        self.run_remote_command(f"cat > /etc/nginx/sites-available/wms << 'EOF'\n{nginx_config}EOF")
        self.run_remote_command("ln -sf /etc/nginx/sites-available/wms /etc/nginx/sites-enabled/")
        self.run_remote_command("rm -f /etc/nginx/sites-enabled/default")
        
        # Test and reload Nginx
        self.run_remote_command("nginx -t")
        self.run_remote_command("systemctl enable nginx && systemctl reload nginx")
        
        print("Nginx configured successfully!")
        print("Note: You need to setup SSL certificates for HTTPS")
        return True
    
    def run_full_deployment(self, skip_nginx=False):
        """Run complete deployment process"""
        print(f"Starting deployment to {self.host}...")
        
        try:
            self.sync_files()
            self.setup_environment()
            self.install_dependencies()
            self.deploy()
            
            nginx_configured = False
            if not skip_nginx:
                nginx_configured = self.setup_nginx()
            
            print("\n=== Deployment completed successfully! ===")
            
            if nginx_configured:
                print(f"Frontend: https://wms.foresttruong.info")
                print(f"Backend API: https://api-wms.foresttruong.info")
            else:
                print(f"Frontend: http://{self.host}:3000")
                print(f"Backend API: http://{self.host}:3001")
                print("\n📖 For domain setup, see NGINX_PROXY_MANAGER_GUIDE.md")
            
        except Exception as e:
            print(f"\nDeployment failed: {e}")
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Deploy WMS to VPS')
    parser.add_argument('--host', default='forest-vps', help='VPS hostname or IP')
    parser.add_argument('--user', default='root', help='SSH user')
    parser.add_argument('--project-dir', default='/opt/wms', help='Project directory on VPS')
    parser.add_argument('--skip-nginx', action='store_true', help='Skip Nginx setup')
    
    args = parser.parse_args()
    
    deployer = WMSDeployer(args.host, args.user, args.project_dir)
    deployer.run_full_deployment(skip_nginx=args.skip_nginx)

if __name__ == "__main__":
    main()