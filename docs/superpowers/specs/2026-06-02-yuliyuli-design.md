# YuLiYuLi — 仿B站全栈项目设计文档

## 概述

YuLiYuLi 是一个高度还原 B站（Bilibili）的全栈视频平台项目，包含用户端和管理端两个前端应用，后端采用 Spring Cloud 微服务架构。

**目标：** 用户端 UI/UX 与 B站一致，管理端作为 CMS 控制用户端的内容和页面布局。

## 技术栈

| 层面 | 选型 |
|------|------|
| 前端框架 | React 18 + Next.js 14 (App Router) |
| 前端工程化 | Nx Monorepo |
| UI 样式 | Tailwind CSS + CSS Modules |
| 后端语言 | Java 21 |
| 后端框架 | Spring Boot 3.x |
| 微服务框架 | Spring Cloud Alibaba |
| 注册/配置中心 | Nacos |
| API 网关 | Spring Cloud Gateway |
| 限流熔断 | Sentinel |
| 分布式事务 | Seata |
| 消息队列 | RocketMQ |
| 关系数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 文档数据库 | MongoDB 7 |
| 搜索引擎 | Elasticsearch 8 |
| 视频处理 | FFmpeg |
| 认证 | JWT |
| 视频存储 | 本地文件系统 |
| API 风格 | REST |
| 实时通信 | WebSocket (STOMP) |
| 部署 | Docker Compose |

## 项目结构

Monorepo 结构，前后端在同一仓库：

```
YuLiYuLi/
├── apps/
│   ├── web-user/          # 用户端 Next.js 应用
│   ├── web-admin/         # 管理端 Next.js 应用
│   ├── gateway/           # Spring Cloud Gateway
│   ├── user-service/      # 用户服务
│   ├── video-service/     # 视频服务
│   ├── danmaku-service/   # 弹幕服务
│   ├── comment-service/   # 评论服务
│   ├── search-service/    # 搜索服务
│   ├── message-service/   # 消息服务
│   ├── recommend-service/ # 推荐服务
│   ├── favorite-service/  # 收藏服务
│   ├── follow-service/    # 关注服务
│   ├── feed-service/      # 动态服务
│   ├── admin-service/     # 管理服务
│   ├── config-service/    # 配置服务
│   └── statistics-service/# 统计服务
├── libs/
│   ├── shared/            # 前端共享组件库
│   ├── ui/                # 通用 UI 组件
│   └── utils/             # 共享工具函数
├── packages/
│   └── common-types/      # 共享 TypeScript 类型
├── docker/
│   └── docker-compose.yml # 基础设施编排
├── nx.json
├── package.json
└── pom.xml                # Java 父 POM
```

## 微服务架构（14 个服务）

### 网关层

| 服务 | 职责 | 端口 |
|------|------|------|
| Gateway | 路由转发、JWT 验证、限流、跨域、权限校验（用户/管理员） | 8080 |

### 核心业务服务

| 服务 | 职责 | 数据库 | 端口 |
|------|------|--------|------|
| User | 注册、登录、个人信息、JWT 签发、头像上传 | MySQL + Redis | 8081 |
| Video | 视频上传、FFmpeg 转码（360P/480P/720P/1080P）、播放、分区管理、缩略图生成 | MySQL + 本地文件系统 | 8082 |
| Danmaku | 弹幕发送、WebSocket 实时推送、弹幕密度统计 | MongoDB + Redis | 8083 |
| Comment | 评论 CRUD、楼中楼、点赞、热评排序 | MySQL + MongoDB | 8084 |

### 扩展服务

| 服务 | 职责 | 数据库 | 端口 |
|------|------|--------|------|
| Search | 视频/用户全文检索、搜索建议、热门搜索词 | Elasticsearch | 8085 |
| Message | 系统通知、私信、@提醒、已读状态 | MySQL + Redis | 8086 |
| Recommend | 首页推荐、猜你喜欢、热门排行、分区推荐 | Redis + MongoDB | 8087 |
| Favorite | 收藏夹管理、收藏/取消收藏、收藏夹分类 | MySQL | 8088 |
| Follow | 关注/粉丝列表、关注状态、互关检测 | MySQL | 8089 |
| Feed | 用户动态流、投稿动态、关注动态推送 | MongoDB | 8090 |

### 管理服务

| 服务 | 职责 | 数据库 | 端口 |
|------|------|--------|------|
| Admin | 内容审核、用户管理（封禁/解封）、角色权限（RBAC）、举报处理 | MySQL | 8091 |
| Config | 页面布局配置、分类树管理、Banner 管理、站点配置、敏感词库 | MySQL + Redis | 8092 |
| Statistics | 数据看板（用户增长、播放统计、热门搜索、分区热度） | MySQL + Redis | 8093 |

## 用户端页面

### 首页
- 顶部导航栏：Logo、搜索框、分区导航、用户头像/消息/投稿
- Banner 轮播图（管理端配置）
- 推荐视频信息流（瀑布流/网格布局）
- 分区入口（动画、游戏、音乐、舞蹈等）
- 排行榜入口

### 播放页
- 视频播放器（多清晰度切换：360P/480P/720P/1080P）
- 弹幕层（实时 WebSocket 推送，弹幕密度可调）
- 视频信息：标题、播放量、发布时间、标签
- UP 主信息卡片 + 关注按钮
- 评论区（热评/最新排序、楼中楼回复）
- 右侧推荐视频列表

### 搜索页
- 搜索框 + 搜索建议
- 搜索结果列表（视频、用户 Tab）
- 筛选条件：排序、时长、分区
- 热门搜索词展示

### 用户空间
- 用户信息卡片：头像、昵称、签名、关注/粉丝数
- Tab 切换：投稿视频、收藏夹、动态、关注列表
- 编辑资料（自己的空间）

### 投稿页
- 视频上传（分片上传、进度条）
- 视频信息填写：标题、简介、封面、分区、标签
- 上传进度：转码状态展示

### 消息中心
- 系统通知列表
- 私信对话列表
- @提醒列表
- 已读/未读状态

### 登录/注册
- 表单验证
- JWT Token 存储（HttpOnly Cookie 或 localStorage）

## 管理端功能

### 页面布局管理
- 首页分区排列顺序拖拽排序
- Banner 轮播图增删改
- 推荐位配置
- 页面主题/配色方案

### 内容管理
- 视频分类/标签树管理（增删改查）
- 视频审核（上架/下架）
- 评论管理（删除/屏蔽）
- 弹幕过滤词库管理

### 用户管理
- 用户列表搜索
- 封禁/解封操作
- 角色权限分配（管理员/超管）
- 管理员账号管理

### 数据看板
- 用户增长趋势图表
- 视频播放量统计
- 热门搜索词排行
- 分区热度排行

### 系统配置
- 站点基本信息
- 上传限制配置（文件大小、格式）
- 敏感词管理
- 公告管理

### 举报处理
- 举报列表（视频/评论举报）
- 处理操作（忽略/警告/删除/封禁）
- 处理记录

## API 设计原则

- RESTful 风格，资源导向
- 统一响应格式：`{ code, message, data }`
- 分页参数：`page`, `size`, `sort`
- JWT Token 通过 `Authorization: Bearer <token>` 传递
- 管理端 API 统一前缀 `/api/admin/`
- 用户端 API 统一前缀 `/api/`

## 数据库设计要点

### MySQL（核心数据）
- 用户表、视频表、评论表、收藏表、关注表
- 管理员表、角色表、权限表（RBAC）
- 配置表、分类表、Banner 表

### MongoDB（非结构化数据）
- 弹幕文档（按视频分片）
- 评论文档（支持嵌套楼中楼）
- 动态文档
- 操作日志

### Redis（缓存）
- 用户 Session / JWT 黑名单
- 热门视频缓存
- 推荐结果缓存
- 搜索热词缓存
- 在线用户计数

### Elasticsearch（搜索）
- 视频索引（标题、简介、标签）
- 用户索引（昵称、签名）

## 视频处理流水线

```
用户上传 → 分片接收 → 合并 → 写入本地存储
                ↓
        RocketMQ 发送转码消息
                ↓
        FFmpeg 转码（多清晰度）
        360P / 480P / 720P / 1080P
                ↓
        生成缩略图
                ↓
        更新视频状态（转码完成）
                ↓
        同步到 Elasticsearch 索引
```

## WebSocket 通信

- 弹幕：客户端连接 `/ws/danmaku/{videoId}`，实时收发弹幕
- 消息通知：连接 `/ws/notification`，推送系统通知和私信
- 在线人数：连接 `/ws/online/{videoId}`，实时更新观看人数

## 部署架构

Docker Compose 编排所有服务：

```yaml
# 基础设施
- MySQL 8.0
- Redis 7
- MongoDB 7
- Elasticsearch 8
- Nacos (注册中心 + 配置中心)
- RocketMQ (NameServer + Broker)

# 业务服务
- Gateway (8080)
- User Service (8081)
- Video Service (8082)
- Danmaku Service (8083)
- Comment Service (8084)
- Search Service (8085)
- Message Service (8086)
- Recommend Service (8087)
- Favorite Service (8088)
- Follow Service (8089)
- Feed Service (8090)
- Admin Service (8091)
- Config Service (8092)
- Statistics Service (8093)

# 前端
- Web User (3000)
- Web Admin (3001)
```

## 开发顺序建议

**Phase 1 — 基础设施 + 核心服务**
1. 项目骨架搭建（Nx Monorepo + Spring Boot 父工程）
2. Docker Compose 基础设施
3. Gateway + Nacos 配置
4. User 服务（注册/登录/JWT）
5. Video 服务（上传/播放，不含转码）

**Phase 2 — 核心体验**
6. Danmaku 服务（弹幕 WebSocket）
7. Comment 服务（评论系统）
8. 用户端首页 + 播放页

**Phase 3 — 扩展功能**
9. Search 服务 + Elasticsearch
10. Favorite + Follow 服务
11. Feed + Recommend 服务
12. Message 服务

**Phase 4 — 管理端**
13. Admin 服务（审核/用户管理）
14. Config 服务（布局/分类管理）
15. Statistics 服务（数据看板）
16. 管理端前端

**Phase 5 — 完善**
17. 视频转码流水线（FFmpeg + RocketMQ）
18. 性能优化（缓存策略、分页优化）
19. Docker Compose 全栈部署
