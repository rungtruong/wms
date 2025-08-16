#!/usr/bin/env python3

import os
import sys
import subprocess
import json
import time
from datetime import datetime

class WMSMonitor:
    def __init__(self, host="forest-vps", user="root", project_dir="/opt/wms"):
        self.host = host
        self.user = user
        self.project_dir = project_dir
        
    def run_remote_command(self, command, check=False):
        """Run command on remote server via SSH"""
        ssh_command = f"ssh {self.user}@{self.host} '{command}'"
        result = subprocess.run(ssh_command, shell=True, capture_output=True, text=True)
        return result
    
    def check_services_status(self):
        """Check Docker services status"""
        print("=== Docker Services Status ===")
        result = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml ps")
        print(result.stdout)
        
        # Check individual service health
        services = ['postgres', 'redis', 'backend', 'frontend']
        for service in services:
            health_result = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml exec -T {service} echo 'OK' 2>/dev/null")
            status = "✅ Running" if health_result.returncode == 0 else "❌ Not Running"
            print(f"{service}: {status}")
    
    def check_system_resources(self):
        """Check system resources"""
        print("\n=== System Resources ===")
        
        # CPU usage
        cpu_result = self.run_remote_command("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1")
        print(f"CPU Usage: {cpu_result.stdout.strip()}%")
        
        # Memory usage
        mem_result = self.run_remote_command("free -h | grep Mem | awk '{print $3"/"$2}'")
        print(f"Memory Usage: {mem_result.stdout.strip()}")
        
        # Disk usage
        disk_result = self.run_remote_command("df -h / | tail -1 | awk '{print $5}'")
        print(f"Disk Usage: {disk_result.stdout.strip()}")
        
        # Docker disk usage
        docker_disk = self.run_remote_command("docker system df")
        print(f"\nDocker Disk Usage:")
        print(docker_disk.stdout)
    
    def check_application_health(self):
        """Check application endpoints"""
        print("\n=== Application Health ===")
        
        # Check backend health
        backend_health = self.run_remote_command("curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/health")
        backend_status = "✅ Healthy" if backend_health.stdout.strip() == "200" else f"❌ Unhealthy ({backend_health.stdout.strip()})"
        print(f"Backend API: {backend_status}")
        
        # Check frontend
        frontend_health = self.run_remote_command("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000")
        frontend_status = "✅ Healthy" if frontend_health.stdout.strip() == "200" else f"❌ Unhealthy ({frontend_health.stdout.strip()})"
        print(f"Frontend: {frontend_status}")
        
        # Check database connection
        db_health = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U postgres")
        db_status = "✅ Connected" if db_health.returncode == 0 else "❌ Connection Failed"
        print(f"Database: {db_status}")
        
        # Check Redis
        redis_health = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping")
        redis_status = "✅ Connected" if "PONG" in redis_health.stdout else "❌ Connection Failed"
        print(f"Redis: {redis_status}")
    
    def check_logs(self, service=None, lines=50):
        """Check application logs"""
        print(f"\n=== Application Logs (last {lines} lines) ===")
        
        if service:
            log_result = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml logs --tail={lines} {service}")
        else:
            log_result = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml logs --tail={lines}")
        
        print(log_result.stdout)
    
    def check_ssl_certificates(self):
        """Check SSL certificate status"""
        print("\n=== SSL Certificates ===")
        
        domains = ['wms.foresttruong.info', 'api.foresttruong.info']
        
        for domain in domains:
            cert_result = self.run_remote_command(f"echo | openssl s_client -servername {domain} -connect {domain}:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null")
            if cert_result.returncode == 0:
                print(f"{domain}: ✅ Valid")
                print(cert_result.stdout)
            else:
                print(f"{domain}: ❌ Invalid or Not Found")
    
    def restart_service(self, service):
        """Restart a specific service"""
        print(f"\n=== Restarting {service} ===")
        result = self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml restart {service}")
        if result.returncode == 0:
            print(f"✅ {service} restarted successfully")
        else:
            print(f"❌ Failed to restart {service}")
            print(result.stderr)
    
    def full_status_check(self):
        """Run complete status check"""
        print(f"WMS Monitoring Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        self.check_services_status()
        self.check_system_resources()
        self.check_application_health()
        self.check_ssl_certificates()
    
    def watch_mode(self, interval=30):
        """Continuous monitoring mode"""
        print(f"Starting continuous monitoring (interval: {interval}s)")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                os.system('clear')
                self.full_status_check()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\nMonitoring stopped.")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='WMS Application Monitor')
    parser.add_argument('action', nargs='?', default='status', 
                       choices=['status', 'logs', 'restart', 'watch'], 
                       help='Action to perform')
    parser.add_argument('--service', help='Specific service name')
    parser.add_argument('--lines', type=int, default=50, help='Number of log lines to show')
    parser.add_argument('--interval', type=int, default=30, help='Watch mode interval in seconds')
    parser.add_argument('--host', default='forest-vps', help='VPS hostname')
    parser.add_argument('--user', default='root', help='SSH user')
    
    args = parser.parse_args()
    
    monitor = WMSMonitor(args.host, args.user)
    
    if args.action == 'status':
        monitor.full_status_check()
    elif args.action == 'logs':
        monitor.check_logs(args.service, args.lines)
    elif args.action == 'restart':
        if not args.service:
            print("Error: --service is required for restart action")
            sys.exit(1)
        monitor.restart_service(args.service)
    elif args.action == 'watch':
        monitor.watch_mode(args.interval)

if __name__ == "__main__":
    main()