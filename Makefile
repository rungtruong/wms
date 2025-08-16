# WMS Deployment Makefile

# Variables
HOST = forest-vps
USER = root
PROJECT_DIR = /opt/wms

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help setup deploy deploy-quick backup restore monitor logs status restart clean setup-ssl

# Default target
help:
	@echo "$(BLUE)WMS Deployment Commands$(NC)"
	@echo "========================"
	@echo "$(GREEN)setup$(NC)           - Setup VPS (first time only)"
	@echo "$(GREEN)deploy$(NC)          - Full deployment (sync, build, deploy, nginx)"
	@echo "$(GREEN)deploy-quick$(NC)    - Quick deployment (skip nginx setup)"
	@echo "$(GREEN)backup$(NC)          - Create database backup"
	@echo "$(GREEN)restore$(NC)         - Restore database from backup (use BACKUP_FILE=filename)"
	@echo "$(GREEN)monitor$(NC)         - Show application status"
	@echo "$(GREEN)logs$(NC)            - Show application logs (use SERVICE=service_name)"
	@echo "$(GREEN)status$(NC)          - Check services status"
	@echo "$(GREEN)restart$(NC)         - Restart service (use SERVICE=service_name)"
	@echo "$(GREEN)watch$(NC)           - Continuous monitoring"
	@echo "$(GREEN)clean$(NC)           - Clean up Docker resources"
	@echo "$(GREEN)setup-ssl$(NC)       - Setup SSL certificates with Let's Encrypt"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make setup           # First time VPS setup"
	@echo "  make deploy          # Deploy application"
	@echo "  make logs SERVICE=backend"
	@echo "  make restart SERVICE=frontend"
	@echo "  make restore BACKUP_FILE=wms_backup_20231201_120000.sql.gz"

# Setup VPS (first time only)
setup:
	@echo "$(BLUE)Setting up VPS...$(NC)"
	@python3 scripts/setup-vps.py --host $(HOST) --user $(USER)
	@echo "$(GREEN)VPS setup completed!$(NC)"

# Full deployment
deploy:
	@echo "$(BLUE)Starting full deployment...$(NC)"
	@python3 deploy.py --host $(HOST) --user $(USER) --project-dir $(PROJECT_DIR)
	@echo "$(GREEN)Deployment completed!$(NC)"

# Quick deployment (skip nginx setup)
deploy-quick:
	@echo "$(BLUE)Starting quick deployment (skip nginx)...$(NC)"
	@python3 deploy.py --host $(HOST) --user $(USER) --project-dir $(PROJECT_DIR) --skip-nginx
	@echo "$(GREEN)Quick deployment completed!$(NC)"

# Database backup
backup:
	@echo "$(BLUE)Creating database backup...$(NC)"
	@python3 scripts/backup.py backup --host $(HOST) --user $(USER)
	@echo "$(GREEN)Backup completed!$(NC)"

# Database restore
restore:
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Error: BACKUP_FILE is required$(NC)"; \
		echo "Usage: make restore BACKUP_FILE=filename"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(BACKUP_FILE)...$(NC)"
	@python3 scripts/backup.py restore --file $(BACKUP_FILE) --host $(HOST) --user $(USER)
	@echo "$(GREEN)Restore completed!$(NC)"

# List backups
list-backups:
	@echo "$(BLUE)Available backups:$(NC)"
	@python3 scripts/backup.py list --host $(HOST) --user $(USER)

# Monitor application
monitor:
	@python3 scripts/monitor.py status --host $(HOST) --user $(USER)

# Show logs
logs:
	@if [ -n "$(SERVICE)" ]; then \
		python3 scripts/monitor.py logs --service $(SERVICE) --host $(HOST) --user $(USER); \
	else \
		python3 scripts/monitor.py logs --host $(HOST) --user $(USER); \
	fi

# Check status
status:
	@python3 scripts/monitor.py status --host $(HOST) --user $(USER)

# Restart service
restart:
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: SERVICE is required$(NC)"; \
		echo "Usage: make restart SERVICE=service_name"; \
		echo "Available services: postgres, redis, backend, frontend"; \
		exit 1; \
	fi
	@python3 scripts/monitor.py restart --service $(SERVICE) --host $(HOST) --user $(USER)

# Continuous monitoring
watch:
	@python3 scripts/monitor.py watch --host $(HOST) --user $(USER)

# Clean up Docker resources
clean:
	@echo "$(YELLOW)Cleaning up Docker resources...$(NC)"
	@ssh $(USER)@$(HOST) "cd $(PROJECT_DIR) && docker-compose -f docker-compose.production.yml down"
	@ssh $(USER)@$(HOST) "docker system prune -f"
	@ssh $(USER)@$(HOST) "docker volume prune -f"
	@echo "$(GREEN)Cleanup completed!$(NC)"

# Setup SSL certificates
setup-ssl:
	@echo "$(BLUE)Setting up SSL certificates...$(NC)"
	@ssh $(USER)@$(HOST) "apt update && apt install -y certbot python3-certbot-nginx"
	@ssh $(USER)@$(HOST) "certbot --nginx -d wms.foresttruong.info -d api.foresttruong.info --non-interactive --agree-tos --email admin@foresttruong.info"
	@ssh $(USER)@$(HOST) "systemctl reload nginx"
	@echo "$(GREEN)SSL certificates installed!$(NC)"

# Update application (pull latest code and redeploy)
update:
	@echo "$(BLUE)Updating application...$(NC)"
	@git pull origin main
	@make deploy-quick
	@echo "$(GREEN)Application updated!$(NC)"

# Development helpers
dev-build:
	@echo "$(BLUE)Building for development...$(NC)"
	@docker-compose build

# Production build test
prod-build-test:
	@echo "$(BLUE)Testing production build...$(NC)"
	@docker-compose -f docker-compose.production.yml build

# Show application URLs
show-urls:
	@echo "$(BLUE)Application URLs:$(NC)"
	@echo "Frontend: $(GREEN)https://wms.foresttruong.info$(NC)"
	@echo "Backend API: $(GREEN)https://api.foresttruong.info$(NC)"
	@echo "API Documentation: $(GREEN)https://api.foresttruong.info/api$(NC)"

# Emergency stop
emergency-stop:
	@echo "$(RED)Emergency stop - shutting down all services...$(NC)"
	@ssh $(USER)@$(HOST) "cd $(PROJECT_DIR) && docker-compose -f docker-compose.production.yml down"
	@echo "$(YELLOW)All services stopped!$(NC)"

# Emergency start
emergency-start:
	@echo "$(BLUE)Emergency start - starting all services...$(NC)"
	@ssh $(USER)@$(HOST) "cd $(PROJECT_DIR) && docker-compose -f docker-compose.production.yml up -d"
	@echo "$(GREEN)All services started!$(NC)"