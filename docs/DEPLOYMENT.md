# YuLiYuLi 部署指南

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (反向代理)                      │
│                    :80 / :443                            │
├──────────────────────┬──────────────────────────────────┤
│   web-user (:3000)   │        web-admin (:3001)         │
│      Nuxt 3          │          Next.js                 │
├──────────────────────┴──────────────────────────────────┤
│                  gateway (:8080)                         │
│              Spring Cloud Gateway                       │
├────────┬────────┬────────┬────────┬────────┬────────────┤
│ user   │ video  │ danmaku│ comment│ search │ message    │
│ :8081  │ :8082  │ :8083  │ :8084  │ :8085  │ :8086      │
├────────┼────────┼────────┼────────┼────────┼────────────┤
│recommend│favorite│ follow │  feed  │ admin  │ config     │
│ :8087  │ :8088  │ :8089  │ :8090  │ :8091  │ :8092      │
├────────┴────────┴────────┴────────┴────────┴────────────┤
│               statistics (:8093)                         │
├─────────────────────────────────────────────────────────┤
│                    基础设施层                              │
│  MySQL(:3306) Redis(:6379) MongoDB(:27017)               │
│  Nacos(:8848) ES(:9200) RocketMQ(:9876)                  │
└─────────────────────────────────────────────────────────┘
```

## 环境要求

| 组件 | 最低配置 |
|------|---------|
| 操作系统 | Ubuntu 22.04 LTS / CentOS 8+ |
| CPU | 4 核 |
| 内存 | 8 GB |
| 磁盘 | 100 GB SSD |
| Docker | 24.0+ |
| Docker Compose | v2.20+ |

## 快速部署（开发/测试）

### 1. 克隆代码

```bash
git clone https://github.com/Jayytt/YuLiYuLi.git
cd YuLiYuLi
```

### 2. 构建 Java 微服务

需要 JDK 21 和 Maven：

```bash
# 安装 JDK 21（如果没有）
sudo apt install openjdk-21-jdk -y

# 构建所有 Java 服务
for service in gateway user-service video-service danmaku-service comment-service \
    search-service message-service recommend-service favorite-service follow-service \
    feed-service admin-service config-service statistics-service; do
  echo "Building $service..."
  (cd apps/$service && mvn clean package -DskipTests)
done
```

### 3. 启动全部服务

```bash
cd docker

# 复制并修改环境变量（生产环境务必修改密码）
cp .env .env.local
vi .env.local   # 修改所有密码和密钥

# 启动
docker compose up -d
```

### 4. 验证服务

```bash
# 查看所有容器状态
docker compose ps

# 检查网关是否正常
curl http://localhost:8080/actuator/health

# 检查前端
curl -I http://localhost:3000
curl -I http://localhost:3001
```

### 5. 访问

| 服务 | 地址 |
|------|------|
| 用户端 | http://localhost:3000 |
| 管理后台 | http://localhost:3001 |
| API 网关 | http://localhost:8080 |
| Nacos 控制台 | http://localhost:8848 (nacos/nacos) |

## 生产环境部署

### 1. 服务器准备

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose（如未自带）
sudo apt install docker-compose-plugin -y

# 验证
docker --version
docker compose version
```

### 2. 配置环境变量

```bash
cd docker
cp .env .env.local
```

编辑 `.env.local`，**必须修改以下项**：

```bash
# 数据库密码 — 使用强密码
MYSQL_ROOT_PASSWORD=<替换为强密码>

# Redis 密码
REDIS_PASSWORD=<替换为强密码>

# JWT 密钥 — 至少 32 字节
JWT_SECRET=<替换为随机密钥，可用 openssl rand -hex 32 生成>

# Nacos 密码
SPRING_CLOUD_NACOS_DISCOVERY_PASSWORD=<替换为密码>

# 前端 API 地址 — 改为你的服务器域名或 IP
NEXT_PUBLIC_API_URL=http://your-domain.com/api
```

### 3. 配置 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/yuliyuli
server {
    listen 80;
    server_name your-domain.com;

    # 用户端前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 管理后台
    location /admin {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # API 网关
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 视频上传大小限制
        client_max_body_size 500m;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/yuliyuli /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. 配置 HTTPS（推荐）

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 5. 启动服务

```bash
cd docker
docker compose --env-file .env.local up -d
```

### 6. 数据库初始化

MySQL 初始化脚本会自动执行（`docker/init/mysql/` 目录下的 SQL 文件）。首次启动时会自动创建以下数据库：

- `yuliyuli_user` — 用户服务
- `yuliyuli_video` — 视频服务
- `yuliyuli_comment` — 评论服务
- `yuliyuli_favorite` — 收藏服务
- `yuliyuli_follow` — 关注服务
- `yuliyuli_message` — 消息服务
- `yuliyuli_admin` — 管理服务
- `yuliyuli_config` — 配置服务
- `yuliyuli_statistics` — 统计服务

## 常用运维命令

```bash
cd docker

# 查看日志
docker compose logs -f gateway          # 查看某个服务日志
docker compose logs -f --tail=100       # 查看最近 100 行全部日志

# 重启单个服务
docker compose restart user-service

# 停止全部
docker compose down

# 停止并清除数据卷（慎用，会删除数据库数据）
docker compose down -v

# 重新构建并启动某个服务
docker compose up -d --build user-service

# 查看资源占用
docker stats
```

## 端口总览

| 端口 | 服务 |
|------|------|
| 3000 | web-user (用户端前端) |
| 3001 | web-admin (管理后台) |
| 3306 | MySQL |
| 6379 | Redis |
| 8080 | gateway (API 网关) |
| 8081 | user-service |
| 8082 | video-service |
| 8083 | danmaku-service |
| 8084 | comment-service |
| 8085 | search-service |
| 8086 | message-service |
| 8087 | recommend-service |
| 8088 | favorite-service |
| 8089 | follow-service |
| 8090 | feed-service |
| 8091 | admin-service |
| 8092 | config-service |
| 8093 | statistics-service |
| 8848 | Nacos (服务注册中心) |
| 9200 | Elasticsearch |
| 9876 | RocketMQ NameServer |

## 故障排查

### 服务启动失败

```bash
# 查看具体错误
docker compose logs <service-name>

# 常见原因：数据库未就绪
# 解决：等待 MySQL 启动后再启动依赖服务
docker compose up -d mysql redis mongodb
sleep 30
docker compose up -d
```

### MySQL 连接拒绝

```bash
# 检查 MySQL 是否就绪
docker compose exec mysql mysql -uroot -p -e "SELECT 1"
```

### Nacos 注册失败

```bash
# 确认 Nacos 可访问
curl http://localhost:8848/nacos/v1/ns/service/list?pageNo=1&pageSize=10
```

### 磁盘空间不足

```bash
# 清理未使用的 Docker 资源
docker system prune -a --volumes
```
