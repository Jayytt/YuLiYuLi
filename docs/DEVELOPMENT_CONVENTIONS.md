# YuLiYuLi 开发规范

> 本文档是 YuLiYuLi 项目的开发规范，适用于个人开发和 AI 编码助手。所有新代码必须遵循此规范。

---

## 目录

1. [项目总览](#1-项目总览)
2. [Java 微服务规范](#2-java-微服务规范)
3. [API 规范](#3-api-规范)
4. [前端规范（Next.js）](#4-前端规范nextjs)
5. [数据库规范](#5-数据库规范)
6. [基础设施规范](#6-基础设施规范)
7. [Git 规范](#7-git-规范)
8. [Docker 部署规范](#8-docker-部署规范)
9. [安全规范](#9-安全规范)

---

## 1. 项目总览

### 1.1 仓库结构

```
YuLiYuLi/
├── apps/                          # 所有应用
│   ├── gateway/                   # API 网关（Spring Cloud Gateway）
│   ├── user-service/              # 用户服务
│   ├── video-service/             # 视频服务
│   ├── danmaku-service/           # 弹幕服务
│   ├── comment-service/           # 评论服务
│   ├── favorite-service/          # 收藏服务
│   ├── follow-service/            # 关注服务
│   ├── feed-service/              # 动态/信息流服务
│   ├── recommend-service/         # 推荐服务
│   ├── message-service/           # 消息服务
│   ├── search-service/            # 搜索服务
│   ├── admin-service/             # 后台管理服务
│   ├── config-service/            # 配置服务
│   ├── statistics-service/        # 统计服务
│   ├── web-user/                  # 用户前端（Next.js）
│   └── web-admin/                 # 管理后台前端（Next.js）
├── packages/
│   └── common-types/              # 前端共享 TypeScript 类型
├── docker/                        # Docker 配置
├── docs/                          # 项目文档
├── pom.xml                        # Java 父 POM
├── package.json                   # 前端根 package.json
├── nx.json                        # Nx monorepo 配置
└── tsconfig.base.json             # TypeScript 基础配置
```

### 1.2 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| Java 框架 | Spring Boot | 3.2.5 |
| 微服务 | Spring Cloud Alibaba | 2023.0.1.0 |
| 服务注册/配置 | Nacos | v2.3.1 |
| API 网关 | Spring Cloud Gateway | - |
| ORM | MyBatis-Plus | 3.5.6 |
| 数据库 | MySQL | 8.0 |
| 缓存 | Redis | 7 |
| 文档数据库 | MongoDB | 7 |
| 搜索引擎 | Elasticsearch | 8.13.0 |
| 消息队列 | RocketMQ | 5.1.4 |
| 认证 | JWT (jjwt) | 0.12.5 |
| 工具库 | Hutool | 5.8.27 |
| API 文档 | Knife4j (OpenAPI 3) | 4.4.0 |
| 前端框架 | Next.js | 14.2.0 |
| UI | React + Tailwind CSS | 18.3.0 / 3.4.0 |
| 构建工具 | Nx | 19.0.0 |
| 包管理 | pnpm | - |
| Java | JDK | 21 |
吧   ·
### 1.3 端口分配

| 服务 | 端口 |
|------|------|
| gateway | 8080 |
| user-service | 8081 |
| video-service | 8082 |
| danmaku-service | 8083 |
| comment-service | 8084 |
| search-service | 8085 |
| message-service | 8086 |
| recommend-service | 8087 |
| favorite-service | 8088 |
| follow-service | 8089 |
| feed-service | 8090 |
| admin-service | 8091 |
| config-service | 8092 |
| statistics-service | 8093 |
| web-user | 3000 |
| web-admin | 3001 |

---

## 2. Java 微服务规范

### 2.1 分层架构

每个微服务严格遵循四层架构，数据单向流动：

```
Controller → Service → Mapper → Database
    ↑            ↑
  DTO/Request   Entity
```

- **Controller**：接收请求、参数校验、调用 Service、返回统一格式响应
- **Service**：业务逻辑、缓存管理、事务控制
- **Mapper**：数据访问，继承 MyBatis-Plus 的 `BaseMapper`
- **Entity**：数据库表映射，只用于 Service 和 Mapper 层之间
- **DTO**：数据传输对象，Controller 层对外暴露的唯一数据结构

### 2.2 包结构

```
com.yuliyuli.{service-name}/
├── controller/          # REST 控制器
├── service/             # 业务逻辑
├── mapper/              # 数据访问层（MyBatis Mapper）
├── entity/              # 数据库实体
├── dto/                 # 数据传输对象
├── config/              # 配置类（异常处理、JWT、MyBatis 等）
├── mq/                  # RocketMQ 消息消费者/生产者（如有）
└── {ServiceName}Application.java  # 启动类
```

### 2.3 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写 | `com.yuliyuli.user.controller` |
| 类名 | PascalCase | `UserService`、`VideoController` |
| 方法名 | camelCase | `getUserById`、`login` |
| 常量 | UPPER_SNAKE_CASE | `TOKEN_BLACKLIST_PREFIX` |
| Entity 类名 | 单数名词，PascalCase | `User`、`Video` |
| Mapper | `{Entity}Mapper` | `UserMapper` |
| Service | `{Domain}Service` | `UserService`、`VideoService` |
| Controller | `{Domain}Controller` | `UserController` |
| DTO 请求 | `{Action}Request` | `LoginRequest`、`VideoUploadRequest` |
| DTO 响应 | `{Entity}DTO` | `UserDTO`、`VideoDTO` |

### 2.4 Entity 模板

每个 Entity 必须包含以下通用字段和注解：

```java
@Data
@TableName("t_xxx")
public class Xxx {

    @TableId(type = IdType.AUTO)
    private Long id;

    // ... 业务字段 ...

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
```

### 2.5 Mapper 模板

```java
@Mapper
public interface XxxMapper extends BaseMapper<Xxx> {

    // 仅在 BaseMapper 不满足需求时添加自定义方法
    // 使用 @Update / @Select 注解 + 原生 SQL
}
```

### 2.6 Service 模板

```java
@Service
@RequiredArgsConstructor
public class XxxService {

    private final XxxMapper xxxMapper;
    // 注入其他依赖（RedisTemplate、ObjectMapper 等）

    // 业务方法
    // 缓存策略：先查 Redis → miss 则查 DB → 回填缓存
    // 异常处理：业务异常直接 throw RuntimeException
}
```

### 2.7 Controller 模板

```java
@RestController
@RequestMapping("/api/xxx")
@RequiredArgsConstructor
public class XxxController {

    private final XxxService xxxService;

    @PostMapping("/action")
    public ResponseEntity<Map<String, Object>> action(@Valid @RequestBody XxxRequest request) {
        // 调用 service
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "操作成功",
                "data", result
        ));
    }
}
```

### 2.8 全局异常处理

每个微服务必须在 `config` 包下提供 `GlobalExceptionHandler`：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "code", 400,
                "message", e.getMessage(),
                "data", (Object) ""
        ));
    }
}
```

### 2.9 MyBatis-Plus 配置

每个使用分页查询的服务必须包含分页插件配置：

```java
@Configuration
public class MybatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }
}
```

---

## 3. API 规范

### 3.1 统一响应格式

所有 API 必须返回以下格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200=成功，400=业务错误，401=未认证，403=无权限 |
| message | string | 提示信息 |
| data | any | 响应数据，无数据时为空字符串 `""` |

### 3.2 路径规范

```
/api/{service-name}/{resource-or-action}
```

示例：
- `POST /api/user/login` — 用户登录
- `POST /api/user/register` — 用户注册
- `GET /api/user/info` — 获取当前用户信息
- `GET /api/user/info/{userId}` — 获取指定用户信息
- `PUT /api/user/profile` — 更新个人资料
- `GET /api/video/list` — 视频列表
- `GET /api/video/detail/{id}` — 视频详情
- `GET /api/video/stream/{id}` — 视频流
- `POST /api/video/upload` — 上传视频

管理接口加 `/admin` 前缀：
- `GET /api/user/admin/list` — 管理员获取用户列表
- `POST /api/video/admin/...` — 管理员视频操作

### 3.3 认证机制

**流程：**
1. 客户端在 `Authorization` 头携带 `Bearer {token}`
2. Gateway 的 `AuthGlobalFilter` 统一校验 JWT
3. 校验通过后，Gateway 注入 `X-User-Id` 和 `X-User-Role` 请求头转发给下游服务
4. 下游服务通过 `@RequestHeader("X-User-Id")` 获取当前用户 ID

**白名单接口**（无需认证）：
```java
private static final List<String> WHITE_LIST = List.of(
    "/api/user/login",
    "/api/user/register",
    "/api/video/list",
    "/api/video/detail/**",
    "/api/video/stream/**",
    "/api/comment/list/**",
    "/api/danmaku/list/**",
    "/api/search/**",
    "/api/recommend/**",
    "/api/config/**"
);
```

新增公开接口时，必须在 `AuthGlobalFilter.WHITE_LIST` 中注册。

**管理员接口**（需要 ADMIN 或 SUPER_ADMIN 角色）：
```java
private static final List<String> ADMIN_LIST = List.of(
    "/api/admin/**",
    "/api/video/admin/**",
    "/api/user/admin/**"
);
```

### 3.4 分页参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 0 | 页码（从 0 开始） |
| size | int | 10 | 每页条数 |

---

## 4. 前端规范（Next.js）

### 4.1 目录结构

```
apps/web-{user,admin}/src/
├── app/                 # Next.js App Router 路由页面
│   ├── layout.tsx       # 根布局
│   ├── page.tsx         # 首页
│   ├── globals.css      # 全局样式
│   └── {route}/
│       └── page.tsx     # 路由页面
├── components/          # 可复用组件
│   ├── Header.tsx
│   ├── VideoCard.tsx
│   └── ...
└── lib/                 # 工具库
    └── api.ts           # Axios 实例
```

### 4.2 组件规范

- 使用**函数组件** + TypeScript
- Props 用 `interface` 定义，命名为 `{ComponentName}Props`
- 组件文件用 **PascalCase** 命名
- 默认导出组件

```tsx
interface VideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
  // ...
}

export default function VideoCard({ id, title, coverUrl }: VideoCardProps) {
  return (/* ... */);
}
```

### 4.3 API 调用

统一使用 `src/lib/api.ts` 导出的 Axios 实例：

```tsx
import api from '@/lib/api';

// GET
const res = await api.get('/video/list', { params: { page: 0, size: 20 } });

// POST
const res = await api.post('/user/login', { username, password });
```

该实例已配置：
- `baseURL: '/api'`
- 请求拦截器自动注入 `Authorization: Bearer {token}`
- 响应拦截器自动解包 `response.data`
- 401 时自动清除 token 并跳转登录页

### 4.4 样式规范

- 主要使用 **Tailwind CSS** 工具类
- 主题色通过 CSS 变量定义（`var(--brand-blue)`、`var(--text-primary)` 等）
- 全局样式在 `globals.css` 中定义
- B 站风格的 UI 组件使用自定义 CSS 类（如 `bili-thumbnail`、`bili-line-clamp-2`）

### 4.5 共享类型

跨前端共享的 TypeScript 接口定义在 `packages/common-types/src/` 中：

```
packages/common-types/src/
├── index.ts       # 统一导出
├── api.ts         # 通用 API 类型
├── user.ts        # 用户相关类型
└── video.ts       # 视频相关类型
```

在前端项目中通过 `@yuliyuli/common-types` 路径引用（已在 `tsconfig.base.json` 中配置 path alias）。

---

## 5. 数据库规范

### 5.1 表设计

- 表名：`t_` 前缀 + 小写下划线（如 `t_user`、`t_video`、`t_comment`）
- 字段名：小写下划线（如 `user_name`、`cover_url`、`created_at`）
- 字符集：`utf8mb4`，排序规则：`utf8mb4_unicode_ci`

### 5.2 通用字段

每张表必须包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT AUTO_INCREMENT | 主键 |
| created_at | DATETIME | 创建时间，MyBatis-Plus 自动填充 |
| updated_at | DATETIME | 更新时间，MyBatis-Plus 自动填充 |
| deleted | INT DEFAULT 0 | 逻辑删除标记（0=正常，1=已删除） |

### 5.3 服务数据库隔离

每个微服务使用独立数据库：

| 服务 | 数据库 |
|------|--------|
| user-service | user_db |
| video-service | video_db |
| comment-service | comment_db |
| favorite-service | favorite_db |
| follow-service | follow_db |
| message-service | message_db |
| admin-service | admin_db |
| config-service | config_db |
| statistics-service | statistics_db |

弹幕（danmaku）、推荐（recommend）、动态（feed）使用 MongoDB，搜索（search）使用 Elasticsearch。

---

## 6. 基础设施规范

### 6.1 服务注册与配置

- 所有 Java 微服务通过 **Nacos** 注册和获取配置
- 配置中心地址、用户名、密码通过环境变量注入
- 每个服务的 `application.yml` 中声明 Nacos 连接信息

### 6.2 消息队列

- 使用 **RocketMQ** 处理异步任务
- 使用场景：视频转码、搜索索引更新、动态推送
- 消息消费者放在 `mq` 包下，命名为 `{Action}Consumer`
- 消息体用独立类定义，放在 `mq` 包下

### 6.3 缓存策略

- 使用 **Redis** 缓存热点数据
- 缓存 Key 前缀规范：
  - `user:info:{userId}` — 用户信息缓存（TTL 30 分钟）
  - `token:blacklist:{token}` — JWT 黑名单（TTL = token 剩余有效期）
- 缓存模式：Cache-Aside（先查缓存 → miss 查 DB → 回填缓存）
- 数据更新时主动删除相关缓存

### 6.4 数据存储选型

| 数据类型 | 存储 | 说明 |
|----------|------|------|
| 结构化业务数据 | MySQL | 用户、视频、评论、收藏等 |
| 弹幕 | MongoDB | 高写入、无固定 schema |
| 推荐数据 | MongoDB | 用户行为、推荐结果 |
| 信息流 | MongoDB | 动态 feed |
| 搜索索引 | Elasticsearch | 视频全文搜索 |
| 缓存/会话 | Redis | 用户缓存、Token 黑名单 |

---

## 7. Git 规范

### 7.1 分支策略

- `master` — 主分支，保持可部署状态
- 功能开发直接在 `master` 上进行（个人项目）
- 大功能可创建 feature 分支，完成后合并回 `master`

### 7.2 提交信息格式

```
type(scope): description
```

| type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| chore | 构建/工具/依赖变更 |
| refactor | 重构（不改变功能） |
| style | 样式调整 |
| docs | 文档变更 |
| test | 测试相关 |

示例：
```
feat(video): add video upload and transcoding
fix(user): fix login token expiration check
chore: update docker-compose environment variables
```

### 7.3 .gitignore

已配置忽略：
- `node_modules/`、`dist/`、`.next/`、`target/` — 构建产物
- `.env`、`.env.local`、`.env.*.local` — 环境变量
- `docker/data/` — Docker 数据卷
- `.nx/cache` — Nx 缓存
- `.idea/` — IDE 配置

---

## 8. Docker 部署规范

### 8.1 镜像构建

- Java 微服务：使用 `docker/Dockerfile.java`
- Node.js 前端：使用 `docker/Dockerfile.node`
- 构建上下文为各服务目录，Dockerfile 路径相对于上下文

### 8.2 环境变量

- 所有敏感配置通过 `.env` 文件注入，**禁止硬编码**
- docker-compose.yml 中通过 `${VAR_NAME}` 引用
- `.env` 文件不提交到 Git

### 8.3 网络

所有容器使用统一的 `yuliyuli` bridge 网络，容器间通过服务名互相访问。

### 8.4 启动顺序

```
Infrastructure (MySQL, Redis, MongoDB, ES, RocketMQ, Nacos)
    ↓
Java Services (Gateway → 各微服务)
    ↓
Frontend (web-user, web-admin)
```

---

## 9. 安全规范

### 9.1 认证与授权

- 密码使用 **BCrypt** 加密存储，禁止明文
- JWT 密钥通过 `${JWT_SECRET}` 环境变量注入
- Token 过期时间通过 `${JWT_EXPIRATION}` 配置
- 登出时将 Token 加入 Redis 黑名单

### 9.2 接口安全

- Gateway 层统一鉴权，白名单机制
- 管理接口额外校验角色（ADMIN / SUPER_ADMIN）
- 下游服务通过 `X-User-Id` 获取用户身份，**不可自行解析 Token**

### 9.3 数据安全

- 使用 MyBatis-Plus 参数化查询，**禁止 SQL 拼接**
- 用户输入通过 `@Valid` 注解校验
- 环境变量（数据库密码、JWT 密钥等）不得提交到代码仓库

### 9.4 接口防滥用

- 敏感操作（登录、注册）应考虑添加频率限制
- 文件上传需要校验文件类型和大小
