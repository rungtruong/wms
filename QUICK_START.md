# Quick Start Guide

Hướng dẫn nhanh để deploy WMS lên VPS forest-vps

## Bước 1: Setup VPS (chỉ cần làm 1 lần)

```bash
make setup
```

Lệnh này sẽ:
- Cập nhật hệ thống
- Cài đặt Docker, Nginx
- Cấu hình firewall và bảo mật
- Tạo các thư mục cần thiết

## Bước 2: Deploy ứng dụng

```bash
make deploy
```

Lệnh này sẽ:
- Sync code lên VPS
- Build Docker images
- Khởi động các services
- Cấu hình Nginx reverse proxy

## Bước 3: Setup SSL (tùy chọn)

```bash
make setup-ssl
```

## Kiểm tra trạng thái

```bash
# Kiểm tra trạng thái tất cả services
make status

# Theo dõi liên tục
make watch

# Xem logs
make logs
```

## URLs sau khi deploy

- Frontend: https://wms.foresttruong.info
- Backend API: https://api.foresttruong.info

## Lệnh hữu ích khác

```bash
# Backup database
make backup

# Restart service
make restart SERVICE=backend

# Deploy nhanh (không setup nginx)
make deploy-quick

# Cập nhật ứng dụng
make update
```

## Troubleshooting

Nếu có lỗi:
1. Kiểm tra logs: `make logs`
2. Kiểm tra status: `make status`
3. Restart service: `make restart SERVICE=service_name`

Xem chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)