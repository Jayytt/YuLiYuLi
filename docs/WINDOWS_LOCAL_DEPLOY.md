# Windows 本地部署指南

> 适用于 Windows 10/11 + Docker Desktop 环境，用于本地预览前后端完整效果。

## 环境要求

| 工具 | 版本要求 | 验证命令 |
|------|---------|---------|
| JDK | 21+ | `java -version` |
| Maven | 3.x | `mvn -version` |
| Docker Desktop | 24.0+ | `docker --version` |
| Docker Compose | v2.x | `docker compose version` |

---

## 第一步：构建所有 Java 微服务

在项目根目录打开 Git Bash，执行以下命令（耗时约 5–15 分钟）：

```bash
cd D:/Code/YuLiYuLi

for service in gateway user-service video-service danmaku-service comment-service \
    search-service message-service recommend-service favorite-service follow-service \
    feed-service admin-service config-service statistics-service; do
  echo "=== Building $service ==="
  (cd apps/$service && mvn clean package -DskipTests -q) && echo "$service OK" || echo "$service FAILED"
done
```

> 如果某个服务 FAILED，运行 `cd apps/<服务名> && mvn clean package -DskipTests` 查看详细报错。

---

## 第二步：创建 .env 文件

`docker/.env` 文件已在本地创建，**不会被推送到 Git**（已在 .gitignore 中排除）。

如果文件不存在，从模板复制：

```bash
cd D:/Code/YuLiYuLi/docker
cp .env.example .env
```

本地开发无需修改密码，默认值可直接使用。

---

## 第三步：分批启动服务

> 必须分批启动，否则 Nacos 会因 MySQL 未就绪而失败。

```bash
cd D:/Code/YuLiYuLi/docker

# 1. 先启动基础设施
docker compose up -d mysql redis mongodb elasticsearch rocketmq-namesrv rocketmq-broker

# 2. 等待 MySQL 初始化完成（约 30 秒）
sleep 30

# 3. 启动 Nacos（依赖 MySQL）
docker compose up -d nacos

# 4. 等待 Nacos 就绪（约 20 秒）
sleep 20

# 5. 启动所有剩余服务
docker compose up -d
```

---

## 第四步：验证服务状态

```bash
cd D:/Code/YuLiYuLi/docker

# 查看所有容器运行状态
docker compose ps

# 检查 API 网关（服务注册到 Nacos 需约 1–2 分钟）
curl http://localhost:8080/actuator/health

# 检查前端是否响应
curl -I http://localhost:3000
curl -I http://localhost:3001
```

---

## 访问地址

| 服务 | 地址 |
|------|------|
| 用户端前端 | http://localhost:3000 |
| 管理后台 | http://localhost:3001 |
| API 网关 | http://localhost:8080 |
| Nacos 控制台 | http://localhost:8848 （账号：nacos / nacos） |
| Elasticsearch | http://localhost:9200 |

---

## 常用运维命令

```bash
cd D:/Code/YuLiYuLi/docker

# 查看某个服务的日志
docker compose logs -f gateway
docker compose logs -f user-service

# 重启单个服务
docker compose restart user-service

# 停止所有服务
docker compose down

# 停止并删除数据（慎用，会清空数据库）
docker compose down -v

# 重新构建并启动某个服务
docker compose up -d --build user-service

# 查看资源占用
docker stats
```

---

## 注意事项

### 内存不足

全部服务启动约需 **8 GB RAM**。内存不足时可只启动部分服务查看前端效果：

```bash
cd D:/Code/YuLiYuLi/docker

# 只启基础设施 + 核心服务
docker compose up -d mysql redis mongodb nacos gateway user-service video-service web-user web-admin
```

### MySQL 初始化

首次启动时，`docker/init/mysql/` 目录下的 SQL 脚本会自动执行，创建所有数据库（约需 1 分钟）。

### 服务启动顺序

各服务需要向 Nacos 注册后才能被网关路由。启动后等待 1–2 分钟再测试接口是正常现象。

---

## 故障排查

### 网关 /actuator/health 返回 503

Nacos 注册未完成，等待 1–2 分钟后重试。

### MySQL 连接拒绝

```bash
docker compose exec mysql mysql -uroot -p -e "SELECT 1"
```

### Nacos 注册失败

```bash
curl http://localhost:8848/nacos/v1/ns/service/list?pageNo=1&pageSize=10
```

### 查看所有容器日志

```bash
docker compose logs -f --tail=100
```
