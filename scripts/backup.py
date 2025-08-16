#!/usr/bin/env python3

import os
import sys
import subprocess
import datetime
from pathlib import Path

class DatabaseBackup:
    def __init__(self, host="forest-vps", user="root", project_dir="/opt/wms"):
        self.host = host
        self.user = user
        self.project_dir = project_dir
        self.backup_dir = f"{project_dir}/backup"
        
    def run_remote_command(self, command, check=True):
        """Run command on remote server via SSH"""
        ssh_command = f"ssh {self.user}@{self.host} '{command}'"
        print(f"[REMOTE] {command}")
        result = subprocess.run(ssh_command, shell=True, capture_output=True, text=True)
        if check and result.returncode != 0:
            print(f"Error: {result.stderr}")
            sys.exit(1)
        return result
    
    def create_backup(self):
        """Create database backup"""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"wms_backup_{timestamp}.sql"
        
        print(f"Creating backup: {backup_filename}")
        
        # Create backup directory
        self.run_remote_command(f"mkdir -p {self.backup_dir}")
        
        # Create database backup
        backup_command = f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U postgres wms_db > {self.backup_dir}/{backup_filename}"
        self.run_remote_command(backup_command)
        
        # Compress backup
        self.run_remote_command(f"cd {self.backup_dir} && gzip {backup_filename}")
        
        print(f"Backup created successfully: {backup_filename}.gz")
        
        # Clean old backups (keep last 7 days)
        self.run_remote_command(f"find {self.backup_dir} -name '*.gz' -mtime +7 -delete")
        
        return f"{backup_filename}.gz"
    
    def restore_backup(self, backup_file):
        """Restore database from backup"""
        print(f"Restoring from backup: {backup_file}")
        
        # Check if backup file exists
        check_file = self.run_remote_command(f"test -f {self.backup_dir}/{backup_file}")
        
        # Decompress if needed
        if backup_file.endswith('.gz'):
            self.run_remote_command(f"cd {self.backup_dir} && gunzip -c {backup_file} > temp_restore.sql")
            sql_file = "temp_restore.sql"
        else:
            sql_file = backup_file
        
        # Stop application
        self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml stop backend frontend")
        
        # Restore database
        restore_command = f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml exec -T postgres psql -U postgres -d wms_db < {self.backup_dir}/{sql_file}"
        self.run_remote_command(restore_command)
        
        # Clean temp file
        if sql_file == "temp_restore.sql":
            self.run_remote_command(f"rm {self.backup_dir}/{sql_file}")
        
        # Start application
        self.run_remote_command(f"cd {self.project_dir} && docker-compose -f docker-compose.production.yml start backend frontend")
        
        print("Database restored successfully!")
    
    def list_backups(self):
        """List available backups"""
        result = self.run_remote_command(f"ls -la {self.backup_dir}/*.gz 2>/dev/null || echo 'No backups found'")
        print("Available backups:")
        print(result.stdout)

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Database backup management')
    parser.add_argument('action', choices=['backup', 'restore', 'list'], help='Action to perform')
    parser.add_argument('--file', help='Backup file name for restore')
    parser.add_argument('--host', default='forest-vps', help='VPS hostname')
    parser.add_argument('--user', default='root', help='SSH user')
    
    args = parser.parse_args()
    
    backup_manager = DatabaseBackup(args.host, args.user)
    
    if args.action == 'backup':
        backup_manager.create_backup()
    elif args.action == 'restore':
        if not args.file:
            print("Error: --file is required for restore action")
            sys.exit(1)
        backup_manager.restore_backup(args.file)
    elif args.action == 'list':
        backup_manager.list_backups()

if __name__ == "__main__":
    main()