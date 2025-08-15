#!/usr/bin/env python3
"""
Build and Push Script for WMS Project
Handles building and pushing Docker images to registry
"""

import argparse
import subprocess
import sys
import os
import json
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime

class BuildPushManager:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.config = self.load_build_config()
        self.build_info = {}
        
    def load_build_config(self) -> Dict:
        """Load build configuration"""
        config_file = os.path.join(self.project_root, 'build-config.json')
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return json.load(f)
        return {}
        
    def log(self, message: str, level: str = "INFO"):
        colors = {
            "INFO": "\033[94m",
            "SUCCESS": "\033[92m",
            "WARNING": "\033[93m",
            "ERROR": "\033[91m",
            "DEBUG": "\033[90m"
        }
        color = colors.get(level, "\033[0m")
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{color}[{timestamp}] [{level}]\033[0m {message}")
        
    def run_command(self, cmd: List[str], cwd: Optional[str] = None, capture_output: bool = False) -> Tuple[bool, str]:
        """Execute command and return success status and output"""
        try:
            self.log(f"Executing: {' '.join(cmd)}", "DEBUG")
            result = subprocess.run(
                cmd,
                cwd=cwd or self.project_root,
                check=True,
                text=True,
                capture_output=capture_output
            )
            return True, result.stdout if capture_output else ""
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed: {e}", "ERROR")
            if capture_output and e.stdout:
                self.log(f"Output: {e.stdout}", "DEBUG")
            if capture_output and e.stderr:
                self.log(f"Error: {e.stderr}", "DEBUG")
            return False, e.stderr if capture_output else ""
        except FileNotFoundError:
            self.log(f"Command not found: {cmd[0]}", "ERROR")
            return False, ""
            
    def check_docker_login(self, registry_url: str) -> bool:
        """Check if logged into Docker registry"""
        if not registry_url:
            return True
            
        success, output = self.run_command(
            ["docker", "system", "info", "--format", "{{.RegistryConfig}}"],
            capture_output=True
        )
        
        if success and registry_url in output:
            self.log(f"Already logged into {registry_url}", "SUCCESS")
            return True
            
        self.log(f"Not logged into {registry_url}", "WARNING")
        return False
        
    def docker_login(self, registry_url: str, username: str = None, password: str = None) -> bool:
        """Login to Docker registry"""
        if not registry_url:
            return True
            
        cmd = ["docker", "login"]
        
        if username:
            cmd.extend(["-u", username])
            
        if password:
            cmd.extend(["-p", password])
            
        cmd.append(registry_url)
        
        success, _ = self.run_command(cmd)
        
        if success:
            self.log(f"Successfully logged into {registry_url}", "SUCCESS")
        else:
            self.log(f"Failed to login to {registry_url}", "ERROR")
            
        return success
        
    def get_image_tags(self, service: str, tag: str, environment: str = None) -> List[str]:
        """Generate image tags for service"""
        tags = [tag]
        
        # Add environment suffix if specified
        if environment and environment in self.config.get("environments", {}):
            env_config = self.config["environments"][environment]
            suffix = env_config.get("tag_suffix", "")
            if suffix:
                tags.append(f"{tag}{suffix}")
                
        # Add latest tag for production
        if environment == "production" and tag != "latest":
            tags.append("latest")
            
        return tags
        
    def build_image(self, service: str, **kwargs) -> Tuple[bool, List[str]]:
        """Build Docker image for service"""
        if service not in self.config.get("services", {}):
            self.log(f"Service '{service}' not found in configuration", "ERROR")
            return False, []
            
        service_config = self.config["services"][service]
        registry_url = self.config.get("registry", {}).get("url", "")
        namespace = self.config.get("registry", {}).get("namespace", "wms")
        
        # Get build arguments
        build_args = service_config.get("build_args", {}).copy()
        
        # Add environment-specific build args
        environment = kwargs.get("environment")
        if environment and environment in self.config.get("environments", {}):
            env_build_args = self.config["environments"][environment].get("build_args", {})
            build_args.update(env_build_args)
            
        # Add custom build args
        build_args.update(kwargs.get("build_args", {}))
        
        # Generate tags
        base_tag = kwargs.get("tag", "latest")
        tags = self.get_image_tags(service, base_tag, environment)
        
        # Build image names
        image_names = []
        for tag in tags:
            if registry_url:
                image_name = f"{registry_url}/{namespace}/{service_config['image_name']}:{tag}"
            else:
                image_name = f"{service_config['image_name']}:{tag}"
            image_names.append(image_name)
            
        # Prepare build command
        cmd = ["docker", "build"]
        
        # Add build arguments
        for key, value in build_args.items():
            cmd.extend(["--build-arg", f"{key}={value}"])
            
        # Add build options
        if kwargs.get("no_cache"):
            cmd.append("--no-cache")
            
        if kwargs.get("platform"):
            cmd.extend(["--platform", kwargs["platform"]])
        elif self.config.get("build_options", {}).get("default_platform"):
            cmd.extend(["--platform", self.config["build_options"]["default_platform"]])
            
        if kwargs.get("target"):
            cmd.extend(["--target", kwargs["target"]])
            
        # Add cache options
        cache_from = self.config.get("build_options", {}).get("cache_from", [])
        for cache in cache_from:
            cmd.extend(["--cache-from", cache])
            
        # Add dockerfile
        dockerfile = kwargs.get("dockerfile", service_config["dockerfile"])
        if dockerfile != "Dockerfile":
            cmd.extend(["-f", dockerfile])
            
        # Add all tags
        for image_name in image_names:
            cmd.extend(["-t", image_name])
            
        # Add context
        cmd.append(service_config["context"])
        
        # Execute build
        start_time = time.time()
        self.log(f"Building {service} with tags: {', '.join(tags)}")
        
        success, _ = self.run_command(cmd)
        
        build_time = time.time() - start_time
        
        if success:
            self.log(f"Successfully built {service} in {build_time:.2f}s", "SUCCESS")
            
            # Store build info
            self.build_info[service] = {
                "image_names": image_names,
                "tags": tags,
                "build_time": build_time,
                "timestamp": datetime.now().isoformat()
            }
            
            return True, image_names
        else:
            self.log(f"Failed to build {service}", "ERROR")
            return False, []
            
    def push_images(self, image_names: List[str]) -> bool:
        """Push images to registry"""
        if not image_names:
            return True
            
        success_count = 0
        
        for image_name in image_names:
            self.log(f"Pushing {image_name}...")
            start_time = time.time()
            
            success, _ = self.run_command(["docker", "push", image_name])
            
            push_time = time.time() - start_time
            
            if success:
                self.log(f"Successfully pushed {image_name} in {push_time:.2f}s", "SUCCESS")
                success_count += 1
            else:
                self.log(f"Failed to push {image_name}", "ERROR")
                
        return success_count == len(image_names)
        
    def save_build_manifest(self, output_file: str = None):
        """Save build manifest with all build information"""
        if not output_file:
            output_file = os.path.join(self.project_root, "build-manifest.json")
            
        manifest = {
            "build_timestamp": datetime.now().isoformat(),
            "services": self.build_info,
            "config": self.config
        }
        
        with open(output_file, 'w') as f:
            json.dump(manifest, f, indent=2)
            
        self.log(f"Build manifest saved to {output_file}")
        
    def cleanup_old_images(self, keep_tags: int = 5):
        """Clean up old Docker images"""
        self.log(f"Cleaning up old images, keeping {keep_tags} most recent...")
        
        # Get all images
        success, output = self.run_command(
            ["docker", "images", "--format", "{{.Repository}}:{{.Tag}}\t{{.CreatedAt}}"],
            capture_output=True
        )
        
        if not success:
            self.log("Failed to get image list", "ERROR")
            return
            
        # Group images by repository
        repo_images = {}
        for line in output.strip().split('\n'):
            if '\t' in line:
                image, created = line.split('\t', 1)
                repo = image.split(':')[0]
                if repo not in repo_images:
                    repo_images[repo] = []
                repo_images[repo].append((image, created))
                
        # Remove old images
        for repo, images in repo_images.items():
            if len(images) > keep_tags:
                # Sort by creation time (newest first)
                images.sort(key=lambda x: x[1], reverse=True)
                old_images = images[keep_tags:]
                
                for image, _ in old_images:
                    self.log(f"Removing old image: {image}")
                    self.run_command(["docker", "rmi", image])

def main():
    parser = argparse.ArgumentParser(description='Build and push Docker images for WMS')
    parser.add_argument('services', nargs='*', choices=['frontend', 'backend', 'all'], 
                       default=['all'], help='Services to build')
    parser.add_argument('--tag', default='latest', help='Image tag')
    parser.add_argument('--environment', choices=['development', 'staging', 'production'],
                       help='Target environment')
    parser.add_argument('--no-cache', action='store_true', help='Build without cache')
    parser.add_argument('--push', action='store_true', help='Push images after building')
    parser.add_argument('--platform', help='Target platform')
    parser.add_argument('--target', help='Build target stage')
    parser.add_argument('--build-arg', action='append', help='Build arguments (key=value)')
    parser.add_argument('--registry-url', help='Docker registry URL')
    parser.add_argument('--registry-username', help='Registry username')
    parser.add_argument('--registry-password', help='Registry password')
    parser.add_argument('--save-manifest', help='Save build manifest to file')
    parser.add_argument('--cleanup', action='store_true', help='Clean up old images')
    parser.add_argument('--keep-tags', type=int, default=5, help='Number of tags to keep during cleanup')
    
    args = parser.parse_args()
    
    manager = BuildPushManager()
    
    # Parse build arguments
    build_args = {}
    if args.build_arg:
        for arg in args.build_arg:
            if '=' in arg:
                key, value = arg.split('=', 1)
                build_args[key] = value
                
    # Determine services to build
    if 'all' in args.services:
        services = ['frontend', 'backend']
    else:
        services = args.services
        
    # Login to registry if pushing
    if args.push:
        registry_url = args.registry_url or manager.config.get("registry", {}).get("url")
        if registry_url:
            if not manager.check_docker_login(registry_url):
                if not manager.docker_login(registry_url, args.registry_username, args.registry_password):
                    manager.log("Failed to login to registry", "ERROR")
                    sys.exit(1)
                    
    # Build and push services
    all_success = True
    
    for service in services:
        manager.log(f"Processing service: {service}")
        
        # Build image
        success, image_names = manager.build_image(
            service,
            tag=args.tag,
            environment=args.environment,
            no_cache=args.no_cache,
            platform=args.platform,
            target=args.target,
            build_args=build_args
        )
        
        if not success:
            all_success = False
            continue
            
        # Push images if requested
        if args.push:
            if not manager.push_images(image_names):
                all_success = False
                
    # Save build manifest
    if args.save_manifest or manager.build_info:
        manager.save_build_manifest(args.save_manifest)
        
    # Cleanup old images
    if args.cleanup:
        manager.cleanup_old_images(args.keep_tags)
        
    if all_success:
        manager.log("All operations completed successfully!", "SUCCESS")
    else:
        manager.log("Some operations failed", "ERROR")
        sys.exit(1)

if __name__ == '__main__':
    main()