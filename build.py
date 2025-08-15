#!/usr/bin/env python3
"""
Docker Build Script for WMS Project
Builds frontend, backend, and manages Docker containers
"""

import argparse
import subprocess
import sys
import os
import time
from typing import List, Optional

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

class DockerBuilder:
    def __init__(self, project_root: str = "."):
        self.project_root = os.path.abspath(project_root)
        self.services = ['frontend', 'backend']
        
    def log(self, message: str, color: str = Colors.OKBLUE):
        print(f"{color}[BUILD]{Colors.ENDC} {message}")
        
    def error(self, message: str):
        print(f"{Colors.FAIL}[ERROR]{Colors.ENDC} {message}")
        
    def success(self, message: str):
        print(f"{Colors.OKGREEN}[SUCCESS]{Colors.ENDC} {message}")
        
    def warning(self, message: str):
        print(f"{Colors.WARNING}[WARNING]{Colors.ENDC} {message}")
        
    def run_command(self, cmd: List[str], cwd: Optional[str] = None) -> bool:
        """Run a command and return success status"""
        try:
            self.log(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd, 
                cwd=cwd or self.project_root, 
                check=True,
                capture_output=False
            )
            return result.returncode == 0
        except subprocess.CalledProcessError as e:
            self.error(f"Command failed with exit code {e.returncode}")
            return False
        except FileNotFoundError:
            self.error(f"Command not found: {cmd[0]}")
            return False
            
    def check_docker(self) -> bool:
        """Check if Docker is available"""
        try:
            subprocess.run(['docker', '--version'], capture_output=True, check=True)
            subprocess.run(['docker-compose', '--version'], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            self.error("Docker or docker-compose not found. Please install Docker.")
            return False
            
    def build_service(self, service: str, no_cache: bool = False, push: bool = False, tag: str = "latest") -> bool:
        """Build a specific service"""
        if service not in self.services:
            self.error(f"Unknown service: {service}. Available: {', '.join(self.services)}")
            return False
            
        self.log(f"Building {service} service...")
        
        # Build command
        cmd = ['docker', 'build']
        if no_cache:
            cmd.append('--no-cache')
            
        # Add tag
        image_name = f"wms-{service}:{tag}"
        cmd.extend(['-t', image_name])
        
        # Add context
        cmd.append(f"./{service}")
        
        success = self.run_command(cmd)
        
        if success:
            self.success(f"Successfully built {service} as {image_name}")
            
            # Push if requested
            if push:
                return self.push_image(image_name)
        else:
            self.error(f"Failed to build {service}")
            
        return success
        
    def build_all(self, no_cache: bool = False, push: bool = False, tag: str = "latest") -> bool:
        """Build all services"""
        self.log("Building all services...")
        
        success = True
        for service in self.services:
            if not self.build_service(service, no_cache, push, tag):
                success = False
                
        if success:
            self.success("All services built successfully!")
        else:
            self.error("Some services failed to build")
            
        return success
        
    def push_image(self, image_name: str) -> bool:
        """Push image to registry"""
        self.log(f"Pushing {image_name}...")
        return self.run_command(['docker', 'push', image_name])
        
    def compose_build(self, no_cache: bool = False) -> bool:
        """Build using docker-compose"""
        self.log("Building with docker-compose...")
        
        cmd = ['docker-compose', 'build']
        if no_cache:
            cmd.append('--no-cache')
            
        return self.run_command(cmd)
        
    def compose_up(self, detach: bool = True, build: bool = True) -> bool:
        """Start services with docker-compose"""
        self.log("Starting services with docker-compose...")
        
        cmd = ['docker-compose', 'up']
        if detach:
            cmd.append('-d')
        if build:
            cmd.append('--build')
            
        return self.run_command(cmd)
        
    def compose_down(self, volumes: bool = False) -> bool:
        """Stop services with docker-compose"""
        self.log("Stopping services...")
        
        cmd = ['docker-compose', 'down']
        if volumes:
            cmd.append('-v')
            
        return self.run_command(cmd)
        
    def clean(self, all_images: bool = False) -> bool:
        """Clean up Docker resources"""
        self.log("Cleaning up Docker resources...")
        
        # Remove stopped containers
        self.run_command(['docker', 'container', 'prune', '-f'])
        
        # Remove unused networks
        self.run_command(['docker', 'network', 'prune', '-f'])
        
        # Remove unused volumes
        self.run_command(['docker', 'volume', 'prune', '-f'])
        
        if all_images:
            # Remove all unused images
            self.run_command(['docker', 'image', 'prune', '-a', '-f'])
        else:
            # Remove only dangling images
            self.run_command(['docker', 'image', 'prune', '-f'])
            
        self.success("Cleanup completed")
        return True

def main():
    parser = argparse.ArgumentParser(description='Docker Build Script for WMS Project')
    parser.add_argument('action', choices=['build', 'up', 'down', 'clean', 'push'], 
                       help='Action to perform')
    parser.add_argument('--service', choices=['frontend', 'backend'], 
                       help='Specific service to build')
    parser.add_argument('--no-cache', action='store_true', 
                       help='Build without cache')
    parser.add_argument('--tag', default='latest', 
                       help='Docker image tag (default: latest)')
    parser.add_argument('--push', action='store_true', 
                       help='Push images after building')
    parser.add_argument('--volumes', action='store_true', 
                       help='Remove volumes when stopping (down action)')
    parser.add_argument('--all-images', action='store_true', 
                       help='Remove all unused images when cleaning')
    parser.add_argument('--foreground', action='store_true', 
                       help='Run in foreground (up action)')
    
    args = parser.parse_args()
    
    builder = DockerBuilder()
    
    # Check Docker availability
    if not builder.check_docker():
        sys.exit(1)
        
    success = True
    
    if args.action == 'build':
        if args.service:
            success = builder.build_service(args.service, args.no_cache, args.push, args.tag)
        else:
            success = builder.build_all(args.no_cache, args.push, args.tag)
            
    elif args.action == 'up':
        success = builder.compose_up(detach=not args.foreground, build=True)
        
    elif args.action == 'down':
        success = builder.compose_down(volumes=args.volumes)
        
    elif args.action == 'clean':
        success = builder.clean(all_images=args.all_images)
        
    elif args.action == 'push':
        if args.service:
            image_name = f"wms-{args.service}:{args.tag}"
            success = builder.push_image(image_name)
        else:
            builder.error("--service is required for push action")
            success = False
            
    if not success:
        sys.exit(1)
        
    builder.success(f"Action '{args.action}' completed successfully!")

if __name__ == '__main__':
    main()