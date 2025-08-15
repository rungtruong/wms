#!/usr/bin/env python3
"""
Individual Service Build Script for WMS Project
Allows building specific services with advanced options
"""

import argparse
import subprocess
import sys
import os
import json
from typing import Dict, List, Optional

class ServiceBuilder:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.config = self.load_build_config()
        
    def load_build_config(self) -> Dict:
        """Load build configuration"""
        config_file = os.path.join(self.project_root, 'build-config.json')
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return json.load(f)
        return self.get_default_config()
        
    def get_default_config(self) -> Dict:
        """Get default build configuration"""
        return {
            "services": {
                "frontend": {
                    "context": "./frontend",
                    "dockerfile": "Dockerfile",
                    "image_name": "wms-frontend",
                    "build_args": {},
                    "ports": ["3000:3000"]
                },
                "backend": {
                    "context": "./backend",
                    "dockerfile": "Dockerfile", 
                    "image_name": "wms-backend",
                    "build_args": {},
                    "ports": ["3001:3001"]
                }
            },
            "registry": {
                "url": "",
                "namespace": "wms"
            }
        }
        
    def log(self, message: str, level: str = "INFO"):
        colors = {
            "INFO": "\033[94m",
            "SUCCESS": "\033[92m",
            "WARNING": "\033[93m",
            "ERROR": "\033[91m"
        }
        color = colors.get(level, "\033[0m")
        print(f"{color}[{level}]\033[0m {message}")
        
    def run_command(self, cmd: List[str], cwd: Optional[str] = None) -> bool:
        """Execute command and return success status"""
        try:
            self.log(f"Executing: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                cwd=cwd or self.project_root,
                check=True,
                text=True
            )
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed: {e}", "ERROR")
            return False
        except FileNotFoundError:
            self.log(f"Command not found: {cmd[0]}", "ERROR")
            return False
            
    def build_service(self, service: str, **kwargs) -> bool:
        """Build specific service with options"""
        if service not in self.config["services"]:
            self.log(f"Service '{service}' not found in configuration", "ERROR")
            return False
            
        service_config = self.config["services"][service]
        
        # Prepare build command
        cmd = ["docker", "build"]
        
        # Add build arguments
        build_args = service_config.get("build_args", {})
        build_args.update(kwargs.get("build_args", {}))
        
        for key, value in build_args.items():
            cmd.extend(["--build-arg", f"{key}={value}"])
            
        # Add cache options
        if kwargs.get("no_cache"):
            cmd.append("--no-cache")
            
        # Add platform if specified
        if kwargs.get("platform"):
            cmd.extend(["--platform", kwargs["platform"]])
            
        # Add target stage if specified
        if kwargs.get("target"):
            cmd.extend(["--target", kwargs["target"]])
            
        # Add dockerfile if different
        dockerfile = kwargs.get("dockerfile", service_config["dockerfile"])
        if dockerfile != "Dockerfile":
            cmd.extend(["-f", dockerfile])
            
        # Add image tag
        tag = kwargs.get("tag", "latest")
        registry_url = self.config["registry"]["url"]
        namespace = self.config["registry"]["namespace"]
        
        if registry_url:
            image_name = f"{registry_url}/{namespace}/{service_config['image_name']}:{tag}"
        else:
            image_name = f"{service_config['image_name']}:{tag}"
            
        cmd.extend(["-t", image_name])
        
        # Add context
        cmd.append(service_config["context"])
        
        # Execute build
        success = self.run_command(cmd)
        
        if success:
            self.log(f"Successfully built {service} as {image_name}", "SUCCESS")
            
            # Save image info
            if kwargs.get("save_info"):
                self.save_image_info(service, image_name, tag)
                
            # Push if requested
            if kwargs.get("push"):
                return self.push_image(image_name)
                
        return success
        
    def push_image(self, image_name: str) -> bool:
        """Push image to registry"""
        self.log(f"Pushing {image_name}...")
        return self.run_command(["docker", "push", image_name])
        
    def save_image_info(self, service: str, image_name: str, tag: str):
        """Save built image information"""
        info_file = os.path.join(self.project_root, f".build-info-{service}.json")
        info = {
            "service": service,
            "image_name": image_name,
            "tag": tag,
            "build_time": subprocess.check_output(
                ["date", "+%Y-%m-%d %H:%M:%S"], text=True
            ).strip()
        }
        
        with open(info_file, 'w') as f:
            json.dump(info, f, indent=2)
            
        self.log(f"Build info saved to {info_file}")
        
    def run_service(self, service: str, **kwargs) -> bool:
        """Run service container"""
        if service not in self.config["services"]:
            self.log(f"Service '{service}' not found", "ERROR")
            return False
            
        service_config = self.config["services"][service]
        tag = kwargs.get("tag", "latest")
        
        # Prepare run command
        cmd = ["docker", "run"]
        
        # Add detach mode
        if kwargs.get("detach", True):
            cmd.append("-d")
            
        # Add name
        container_name = f"wms-{service}-{tag}"
        cmd.extend(["--name", container_name])
        
        # Add ports
        for port in service_config["ports"]:
            cmd.extend(["-p", port])
            
        # Add environment variables
        env_vars = kwargs.get("env", {})
        for key, value in env_vars.items():
            cmd.extend(["-e", f"{key}={value}"])
            
        # Add volumes
        volumes = kwargs.get("volumes", [])
        for volume in volumes:
            cmd.extend(["-v", volume])
            
        # Add image name
        image_name = f"{service_config['image_name']}:{tag}"
        cmd.append(image_name)
        
        return self.run_command(cmd)

def main():
    parser = argparse.ArgumentParser(description='Build individual services for WMS')
    parser.add_argument('service', choices=['frontend', 'backend'], help='Service to build')
    parser.add_argument('--tag', default='latest', help='Image tag')
    parser.add_argument('--no-cache', action='store_true', help='Build without cache')
    parser.add_argument('--push', action='store_true', help='Push after building')
    parser.add_argument('--platform', help='Target platform (e.g., linux/amd64)')
    parser.add_argument('--target', help='Build target stage')
    parser.add_argument('--dockerfile', help='Custom Dockerfile path')
    parser.add_argument('--build-arg', action='append', help='Build arguments (key=value)')
    parser.add_argument('--save-info', action='store_true', help='Save build information')
    parser.add_argument('--run', action='store_true', help='Run container after building')
    parser.add_argument('--env', action='append', help='Environment variables for run (key=value)')
    
    args = parser.parse_args()
    
    builder = ServiceBuilder()
    
    # Parse build arguments
    build_args = {}
    if args.build_arg:
        for arg in args.build_arg:
            if '=' in arg:
                key, value = arg.split('=', 1)
                build_args[key] = value
                
    # Parse environment variables
    env_vars = {}
    if args.env:
        for env in args.env:
            if '=' in env:
                key, value = env.split('=', 1)
                env_vars[key] = value
    
    # Build service
    success = builder.build_service(
        args.service,
        tag=args.tag,
        no_cache=args.no_cache,
        push=args.push,
        platform=args.platform,
        target=args.target,
        dockerfile=args.dockerfile,
        build_args=build_args,
        save_info=args.save_info
    )
    
    if not success:
        sys.exit(1)
        
    # Run container if requested
    if args.run:
        success = builder.run_service(
            args.service,
            tag=args.tag,
            env=env_vars
        )
        
        if not success:
            sys.exit(1)
    
    builder.log(f"Service '{args.service}' processed successfully!", "SUCCESS")

if __name__ == '__main__':
    main()