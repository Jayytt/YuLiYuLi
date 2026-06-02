# Phase 1: Foundation + Core Services Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete project skeleton with Nx Monorepo, Spring Boot microservices infrastructure, Docker Compose, Gateway, User service (auth), and a basic User frontend with B站-style layout.

**Architecture:** Nx Monorepo manages both Next.js frontend apps and Java Spring Boot backend services. Spring Cloud Gateway routes requests to microservices. Nacos handles service discovery and configuration. JWT authentication with Spring Security.

**Tech Stack:** Nx, React 18, Next.js 14, Tailwind CSS, Java 21, Spring Boot 3.x, Spring Cloud Alibaba, Nacos, Spring Cloud Gateway, MySQL 8.0, Redis 7, Docker Compose

**UI Constraint:** User-side frontend MUST match B站 official site styles exactly. Scrape from bilibili.com as baseline. Optimize allowed, divergence forbidden.

**Scope:** This plan covers Phase 1 only. Phases 2-5 will be separate plans.

---

## File Structure

```
YuLiYuLi/
├── apps/
│   ├── web-user/                    # Next.js 用户端
│   │   ├── src/
│   │   │   ├── app/                 # App Router pages
│   │   │   ├── components/          # 页面组件
│   │   │   ├── styles/              # 全局样式（从B站爬取）
│   │   │   └── lib/                 # 工具函数
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   ├── gateway/                     # Spring Cloud Gateway
│   │   ├── src/main/java/com/yuliyuli/gateway/
│   │   │   ├── GatewayApplication.java
│   │   │   ├── config/
│   │   │   └── filter/
│   │   ├── src/main/resources/
│   │   │   └── application.yml
│   │   └── pom.xml
│   └── user-service/                # 用户服务
│       ├── src/main/java/com/yuliyuli/user/
│       │   ├── UserServiceApplication.java
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── entity/
│       │   ├── dto/
│       │   └── config/
│       ├── src/test/java/com/yuliyuli/user/
│       ├── src/main/resources/
│       │   └── application.yml
│       └── pom.xml
├── libs/
│   └── shared/                      # 前端共享组件
├── packages/
│   └── common-types/                # 共享 TypeScript 类型
├── docker/
│   └── docker-compose.yml
├── pom.xml                          # Java 父 POM
├── nx.json
├── package.json
├── tsconfig.base.json
└── .gitignore
```

---

## Task 1: Initialize Nx Monorepo Workspace

**Files:**
- Create: `nx.json`
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "yuliyuli",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev:user": "npx nx serve web-user",
    "dev:admin": "npx nx serve web-admin",
    "build": "npx nx run-many -t build",
    "lint": "npx nx run-many -t lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "axios": "1.7.0"
  },
  "devDependencies": {
    "@nx/next": "19.0.0",
    "@nx/react": "19.0.0",
    "@nx/js": "19.0.0",
    "nx": "19.0.0",
    "typescript": "5.4.0",
    "tailwindcss": "3.4.0",
    "postcss": "8.4.0",
    "autoprefixer": "10.4.0",
    "@types/react": "18.3.0",
    "@types/react-dom": "18.3.0",
    "@types/node": "20.12.0"
  }
}
```

- [ ] **Step 2: Create nx.json**

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": [],
    "production": ["default", "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)", "!{projectRoot}/.eslintrc.json"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production"],
      "cache": true
    }
  }
}
```

- [ ] **Step 3: Create tsconfig.base.json**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@yuliyuli/shared": ["libs/shared/src/index.ts"],
      "@yuliyuli/common-types": ["packages/common-types/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

- [ ] **Step 4: Update .gitignore**

Append to existing `.gitignore`:

```
# Node
node_modules/
dist/
.next/
.vercel/
*.tsbuildinfo

# Nx
.nx/cache
.nx/workspace-data

# IDE
.idea/
*.iml

# Java
target/
*.class
*.jar
*.war

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Docker volumes
docker/data/
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: node_modules created, no errors

- [ ] **Step 6: Commit**

```bash
git add nx.json package.json tsconfig.base.json .gitignore
git commit -m "chore: initialize Nx monorepo workspace"
```

---

## Task 2: Create Shared TypeScript Types Package

**Files:**
- Create: `packages/common-types/src/index.ts`
- Create: `packages/common-types/src/user.ts`
- Create: `packages/common-types/src/video.ts`
- Create: `packages/common-types/src/api.ts`
- Create: `packages/common-types/package.json`
- Create: `packages/common-types/tsconfig.json`

- [ ] **Step 1: Create API response types**

```typescript
// packages/common-types/src/api.ts
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
```

- [ ] **Step 2: Create user types**

```typescript
// packages/common-types/src/user.ts
export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: number;
  birthday: string | null;
  level: number;
  coin: number;
  following: number;
  follower: number;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  bio?: string;
  gender?: number;
  birthday?: string;
}
```

- [ ] **Step 3: Create video types**

```typescript
// packages/common-types/src/video.ts
export interface Video {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  viewCount: number;
  danmakuCount: number;
  likeCount: number;
  coinCount: number;
  favoriteCount: number;
  shareCount: number;
  categoryId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  tags: string[];
  createdAt: string;
}

export interface VideoUploadRequest {
  title: string;
  description: string;
  categoryId: number;
  tags: string[];
  cover: File;
  video: File;
}

export interface Category {
  id: number;
  name: string;
  parentId: number;
  icon: string;
  order: number;
}
```

- [ ] **Step 4: Create package index**

```typescript
// packages/common-types/src/index.ts
export * from './api';
export * from './user';
export * from './video';
```

- [ ] **Step 5: Create package.json**

```json
{
  "name": "@yuliyuli/common-types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

- [ ] **Step 6: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../../dist/packages/common-types"
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 7: Commit**

```bash
git add packages/common-types/
git commit -m "feat: add shared TypeScript types package"
```

---

## Task 3: Create Java Parent POM

**Files:**
- Create: `pom.xml`

- [ ] **Step 1: Create parent POM**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.yuliyuli</groupId>
    <artifactId>yuliyuli-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>YuLiYuLi Parent</name>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>21</java.version>
        <spring-cloud.version>2023.0.1</spring-cloud.version>
        <spring-cloud-alibaba.version>2023.0.1.0</spring-cloud-alibaba.version>
        <mybatis-plus.version>3.5.6</mybatis-plus.version>
        <jwt.version>0.12.5</jwt.version>
        <hutool.version>5.8.27</hutool.version>
        <knife4j.version>4.4.0</knife4j.version>
        <rocketmq.version>2.2.3</rocketmq.version>
        <redisson.version>3.28.0</redisson.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Spring Cloud -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Spring Cloud Alibaba -->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- MyBatis Plus -->
            <dependency>
                <groupId>com.baomidou</groupId>
                <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
                <version>${mybatis-plus.version}</version>
            </dependency>

            <!-- JWT -->
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-api</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-impl</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-jackson</artifactId>
                <version>${jwt.version}</version>
            </dependency>

            <!-- Hutool -->
            <dependency>
                <groupId>cn.hutool</groupId>
                <artifactId>hutool-all</artifactId>
                <version>${hutool.version}</version>
            </dependency>

            <!-- Knife4j (Swagger) -->
            <dependency>
                <groupId>com.github.xiaoymin</groupId>
                <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
                <version>${knife4j.version}</version>
            </dependency>

            <!-- RocketMQ -->
            <dependency>
                <groupId>org.apache.rocketmq</groupId>
                <artifactId>rocketmq-spring-boot-starter</artifactId>
                <version>${rocketmq.version}</version>
            </dependency>

            <!-- Redisson -->
            <dependency>
                <groupId>org.redisson</groupId>
                <artifactId>redisson-spring-boot-starter</artifactId>
                <version>${redisson.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <modules>
        <module>apps/gateway</module>
        <module>apps/user-service</module>
    </modules>
</project>
```

- [ ] **Step 2: Commit**

```bash
git add pom.xml
git commit -m "feat: add Java parent POM with Spring Cloud Alibaba dependencies"
```

---

## Task 4: Create Docker Compose Infrastructure

**Files:**
- Create: `docker/docker-compose.yml`
- Create: `docker/.env`

- [ ] **Step 1: Create .env file**

```env
# MySQL
MYSQL_ROOT_PASSWORD=yuliyuli123
MYSQL_DATABASE=yuliyuli

# Redis
REDIS_PASSWORD=yuliyuli123

# Nacos
NACOS_PASSWORD=nacos

# Ports
MYSQL_PORT=3306
REDIS_PORT=6379
MONGODB_PORT=27017
NACOS_PORT=8848
ELASTICSEARCH_PORT=9200
ROCKETMQ_NAMESRV_PORT=9876
```

- [ ] **Step 2: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: yuliyuli-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    ports:
      - "${MYSQL_PORT}:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
      - ./init/mysql:/docker-entrypoint-initdb.d
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    networks:
      - yuliyuli

  redis:
    image: redis:7-alpine
    container_name: yuliyuli-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - ./data/redis:/data
    networks:
      - yuliyuli

  mongodb:
    image: mongo:7
    container_name: yuliyuli-mongodb
    ports:
      - "${MONGODB_PORT}:27017"
    volumes:
      - ./data/mongodb:/data/db
    networks:
      - yuliyuli

  nacos:
    image: nacos/nacos-server:v2.3.1
    container_name: yuliyuli-nacos
    environment:
      MODE: standalone
      NACOS_AUTH_ENABLE: 'true'
      SPRING_DATASOURCE_PLATFORM: mysql
      MYSQL_SERVICE_HOST: mysql
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_USER: root
      MYSQL_SERVICE_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    ports:
      - "${NACOS_PORT}:8848"
      - "9848:9848"
    depends_on:
      - mysql
    networks:
      - yuliyuli

  elasticsearch:
    image: elasticsearch:8.13.0
    container_name: yuliyuli-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "${ELASTICSEARCH_PORT}:9200"
    volumes:
      - ./data/elasticsearch:/usr/share/elasticsearch/data
    networks:
      - yuliyuli

  rocketmq-namesrv:
    image: apache/rocketmq:5.1.4
    container_name: yuliyuli-rocketmq-namesrv
    command: sh mqnamesrv
    ports:
      - "${ROCKETMQ_NAMESRV_PORT}:9876"
    networks:
      - yuliyuli

  rocketmq-broker:
    image: apache/rocketmq:5.1.4
    container_name: yuliyuli-rocketmq-broker
    command: sh mqbroker -n rocketmq-namesrv:9876 --enable-controller
    ports:
      - "10911:10911"
    depends_on:
      - rocketmq-namesrv
    networks:
      - yuliyuli

networks:
  yuliyuli:
    driver: bridge
```

- [ ] **Step 3: Start infrastructure**

Run: `cd docker && docker-compose up -d`
Expected: All containers start successfully. Verify with `docker-compose ps`

- [ ] **Step 4: Commit**

```bash
git add docker/
git commit -m "feat: add Docker Compose infrastructure (MySQL, Redis, MongoDB, Nacos, ES, RocketMQ)"
```

---

## Task 5: Create Gateway Service

**Files:**
- Create: `apps/gateway/pom.xml`
- Create: `apps/gateway/src/main/java/com/yuliyuli/gateway/GatewayApplication.java`
- Create: `apps/gateway/src/main/java/com/yuliyuli/gateway/filter/AuthGlobalFilter.java`
- Create: `apps/gateway/src/main/resources/application.yml`

- [ ] **Step 1: Create gateway pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.yuliyuli</groupId>
        <artifactId>yuliyuli-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>gateway</artifactId>
    <name>Gateway Service</name>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: Create GatewayApplication.java**

```java
package com.yuliyuli.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

- [ ] **Step 3: Create AuthGlobalFilter.java**

```java
package com.yuliyuli.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    /** Public endpoints that don't require authentication */
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

    /** Admin-only endpoints */
    private static final List<String> ADMIN_LIST = List.of(
            "/api/admin/**"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Allow public endpoints
        for (String pattern : WHITE_LIST) {
            if (PATH_MATCHER.match(pattern, path)) {
                return chain.filter(exchange);
            }
        }

        // Extract token
        String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (token == null || !token.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }
        token = token.substring(7);

        // Validate JWT
        Claims claims;
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return unauthorized(exchange);
        }

        // Check admin endpoints require admin role
        for (String pattern : ADMIN_LIST) {
            if (PATH_MATCHER.match(pattern, path)) {
                String role = claims.get("role", String.class);
                if (!"ADMIN".equals(role) && !"SUPER_ADMIN".equals(role)) {
                    return forbidden(exchange);
                }
            }
        }

        // Forward user info to downstream services
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", claims.getSubject())
                .header("X-User-Role", claims.get("role", String.class))
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return -100;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    private Mono<Void> forbidden(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return response.setComplete();
    }
}
```

- [ ] **Step 4: Create application.yml**

```yaml
server:
  port: 8080

spring:
  application:
    name: gateway
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        username: nacos
        password: nacos
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
        - id: video-service
          uri: lb://video-service
          predicates:
            - Path=/api/video/**
        - id: comment-service
          uri: lb://comment-service
          predicates:
            - Path=/api/comment/**
        - id: danmaku-service
          uri: lb://danmaku-service
          predicates:
            - Path=/api/danmaku/**
        - id: search-service
          uri: lb://search-service
          predicates:
            - Path=/api/search/**
        - id: message-service
          uri: lb://message-service
          predicates:
            - Path=/api/message/**
        - id: recommend-service
          uri: lb://recommend-service
          predicates:
            - Path=/api/recommend/**
        - id: favorite-service
          uri: lb://favorite-service
          predicates:
            - Path=/api/favorite/**
        - id: follow-service
          uri: lb://follow-service
          predicates:
            - Path=/api/follow/**
        - id: feed-service
          uri: lb://feed-service
          predicates:
            - Path=/api/feed/**
        - id: admin-service
          uri: lb://admin-service
          predicates:
            - Path=/api/admin/**
        - id: config-service
          uri: lb://config-service
          predicates:
            - Path=/api/config/**
        - id: statistics-service
          uri: lb://statistics-service
          predicates:
            - Path=/api/statistics/**

jwt:
  secret: yuliyuli-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256
```

- [ ] **Step 5: Commit**

```bash
git add apps/gateway/
git commit -m "feat: add Gateway service with JWT auth filter and route config"
```

---

## Task 6: Create User Service — Entity & Repository

**Files:**
- Create: `apps/user-service/pom.xml`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/UserServiceApplication.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/entity/User.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/repository/UserRepository.java`
- Create: `apps/user-service/src/main/resources/application.yml`
- Create: `docker/init/mysql/01-user-schema.sql`

- [ ] **Step 1: Create user-service pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.yuliyuli</groupId>
        <artifactId>yuliyuli-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>user-service</artifactId>
    <name>User Service</name>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: Create UserServiceApplication.java**

```java
package com.yuliyuli.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.yuliyuli.user.repository")
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

- [ ] **Step 3: Create User entity**

```java
package com.yuliyuli.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_user")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String nickname;

    private String avatar;

    private String bio;

    /** 0: unknown, 1: male, 2: female */
    private Integer gender;

    private String birthday;

    private Integer level;

    private Long coin;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
```

- [ ] **Step 4: Create UserRepository**

```java
package com.yuliyuli.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository extends BaseMapper<User> {
}
```

- [ ] **Step 5: Create database schema**

```sql
-- docker/init/mysql/01-user-schema.sql
CREATE DATABASE IF NOT EXISTS yuliyuli_user;
USE yuliyuli_user;

CREATE TABLE t_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar VARCHAR(500) DEFAULT '',
    bio VARCHAR(500) DEFAULT '',
    gender TINYINT DEFAULT 0,
    birthday VARCHAR(20) DEFAULT NULL,
    level INT DEFAULT 0,
    coin BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- [ ] **Step 6: Create application.yml**

```yaml
server:
  port: 8081

spring:
  application:
    name: user-service
  datasource:
    url: jdbc:mysql://localhost:3306/yuliyuli_user?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: yuliyuli123
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: localhost
      port: 6379
      password: yuliyuli123
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        username: nacos
        password: nacos
      config:
        server-addr: localhost:8848
        username: nacos
        password: nacos
        file-extension: yml

mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

jwt:
  secret: yuliyuli-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256
  expiration: 604800000  # 7 days in milliseconds
```

- [ ] **Step 7: Commit**

```bash
git add apps/user-service/ docker/init/
git commit -m "feat: add User service entity, repository, and database schema"
```

---

## Task 7: Create User Service — DTO & Service Layer

**Files:**
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/dto/LoginRequest.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/dto/RegisterRequest.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/dto/UserDTO.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/dto/LoginResponse.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/service/UserService.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/config/JwtUtil.java`

- [ ] **Step 1: Create DTOs**

```java
// apps/user-service/src/main/java/com/yuliyuli/user/dto/LoginRequest.java
package com.yuliyuli.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;
}
```

```java
// apps/user-service/src/main/java/com/yuliyuli/user/dto/RegisterRequest.java
package com.yuliyuli.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度3-20位")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度6-32位")
    private String password;

    @NotBlank(message = "昵称不能为空")
    @Size(max = 20, message = "昵称最长20位")
    private String nickname;
}
```

```java
// apps/user-service/src/main/java/com/yuliyuli/user/dto/UserDTO.java
package com.yuliyuli.user.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String bio;
    private Integer gender;
    private String birthday;
    private Integer level;
    private Long coin;
    private LocalDateTime createdAt;
}
```

```java
// apps/user-service/src/main/java/com/yuliyuli/user/dto/LoginResponse.java
package com.yuliyuli.user.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;

    public LoginResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
```

- [ ] **Step 2: Create JwtUtil**

```java
// apps/user-service/src/main/java/com/yuliyuli/user/config/JwtUtil.java
package com.yuliyuli.user.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String role) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

- [ ] **Step 3: Create UserService**

```java
// apps/user-service/src/main/java/com/yuliyuli/user/service/UserService.java
package com.yuliyuli.user.service;

import cn.hutool.crypto.digest.BCrypt;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.user.config.JwtUtil;
import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.entity.User;
import com.yuliyuli.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );

        if (user == null || !BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), "USER");
        UserDTO userDTO = toDTO(user);
        return new LoginResponse(token, userDTO);
    }

    public void register(RegisterRequest request) {
        // Check if username exists
        Long count = userRepository.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, request.getUsername())
        );
        if (count > 0) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(BCrypt.hashpw(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setLevel(0);
        user.setCoin(0L);
        userRepository.insert(user);
    }

    public UserDTO getUserById(Long userId) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return toDTO(user);
    }

    public void updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (request.getNickname() != null) user.setNickname(request.getNickname());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getBirthday() != null) user.setBirthday(request.getBirthday());

        userRepository.updateById(user);
    }

    public void logout(String token) {
        // Add token to blacklist with remaining TTL
        try {
            var claims = jwtUtil.parseToken(token);
            long remainingTtl = claims.getExpiration().getTime() - System.currentTimeMillis();
            if (remainingTtl > 0) {
                redisTemplate.opsForValue().set(
                        TOKEN_BLACKLIST_PREFIX + token, "1", remainingTtl, TimeUnit.MILLISECONDS
                );
            }
        } catch (Exception ignored) {
            // Token already invalid
        }
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setGender(user.getGender());
        dto.setBirthday(user.getBirthday());
        dto.setLevel(user.getLevel());
        dto.setCoin(user.getCoin());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
```

Note: Add `UpdateProfileRequest` DTO:

```java
// apps/user-service/src/main/java/com/yuliyuli/user/dto/UpdateProfileRequest.java
package com.yuliyuli.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nickname;
    private String avatar;
    private String bio;
    private Integer gender;
    private String birthday;
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/user-service/src/main/java/com/yuliyuli/user/dto/ apps/user-service/src/main/java/com/yuliyuli/user/service/ apps/user-service/src/main/java/com/yuliyuli/user/config/JwtUtil.java
git commit -m "feat: add User service DTOs, JwtUtil, and UserService"
```

---

## Task 8: Create User Service — Controller & Tests

**Files:**
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/controller/UserController.java`
- Create: `apps/user-service/src/main/java/com/yuliyuli/user/config/GlobalExceptionHandler.java`
- Create: `apps/user-service/src/test/java/com/yuliyuli/user/service/UserServiceTest.java`
- Create: `apps/user-service/src/test/java/com/yuliyuli/user/controller/UserControllerTest.java`
- Create: `apps/user-service/src/test/resources/application-test.yml`

- [ ] **Step 1: Create GlobalExceptionHandler**

```java
// apps/user-service/src/main/java/com/yuliyuli/user/config/GlobalExceptionHandler.java
package com.yuliyuli.user.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

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

- [ ] **Step 2: Create UserController**

```java
// apps/user-service/src/main/java/com/yuliyuli/user/controller/UserController.java
package com.yuliyuli.user.controller;

import com.yuliyuli.user.dto.*;
import com.yuliyuli.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "登录成功",
                "data", response
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "注册成功",
                "data", ""
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("X-User-Id") Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<Map<String, Object>> getUserInfoById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", user
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(userId, request);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "更新成功",
                "data", ""
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            userService.logout(authorization.substring(7));
        }
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "退出成功",
                "data", ""
        ));
    }
}
```

- [ ] **Step 3: Create test application.yml**

```yaml
# apps/user-service/src/test/resources/application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;MODE=MySQL
    driver-class-name: org.h2.Driver
    username: sa
    password:
  data:
    redis:
      host: localhost
      port: 6379
  cloud:
    nacos:
      discovery:
        enabled: false
      config:
        enabled: false

mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true

jwt:
  secret: test-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256
  expiration: 604800000
```

- [ ] **Step 4: Create UserServiceTest**

```java
// apps/user-service/src/test/java/com/yuliyuli/user/service/UserServiceTest.java
package com.yuliyuli.user.service;

import com.yuliyuli.user.dto.LoginRequest;
import com.yuliyuli.user.dto.LoginResponse;
import com.yuliyuli.user.dto.RegisterRequest;
import com.yuliyuli.user.dto.UserDTO;
import com.yuliyuli.user.entity.User;
import com.yuliyuli.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void register_shouldCreateUser() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setNickname("Test User");

        when(userRepository.selectCount(any())).thenReturn(0L);
        when(userRepository.insert(any(User.class))).thenReturn(1);

        assertDoesNotThrow(() -> userService.register(request));
        verify(userRepository).insert(any(User.class));
    }

    @Test
    void register_shouldThrowWhenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existing");
        request.setPassword("password123");
        request.setNickname("Test");

        when(userRepository.selectCount(any())).thenReturn(1L);

        assertThrows(RuntimeException.class, () -> userService.register(request));
    }

    @Test
    void getUserById_shouldReturnUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("test");
        user.setNickname("Test");
        user.setLevel(0);
        user.setCoin(0L);

        when(userRepository.selectById(1L)).thenReturn(user);

        UserDTO result = userService.getUserById(1L);
        assertEquals("test", result.getUsername());
        assertEquals("Test", result.getNickname());
    }

    @Test
    void getUserById_shouldThrowWhenNotFound() {
        when(userRepository.selectById(999L)).thenReturn(null);
        assertThrows(RuntimeException.class, () -> userService.getUserById(999L));
    }
}
```

- [ ] **Step 5: Create UserControllerTest**

```java
// apps/user-service/src/test/java/com/yuliyuli/user/controller/UserControllerTest.java
package com.yuliyuli.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuliyuli.user.dto.LoginRequest;
import com.yuliyuli.user.dto.LoginResponse;
import com.yuliyuli.user.dto.RegisterRequest;
import com.yuliyuli.user.dto.UserDTO;
import com.yuliyuli.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void login_shouldReturnToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("test");
        request.setPassword("password");

        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("test");

        LoginResponse response = new LoginResponse("jwt-token", userDTO);
        when(userService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.token").value("jwt-token"));
    }

    @Test
    void register_shouldReturnSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password");
        request.setNickname("New User");

        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
```

- [ ] **Step 6: Run tests**

Run: `cd apps/user-service && mvn test`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add apps/user-service/src/main/java/com/yuliyuli/user/controller/ apps/user-service/src/main/java/com/yuliyuli/user/config/GlobalExceptionHandler.java apps/user-service/src/test/
git commit -m "feat: add UserController with login/register/profile endpoints and tests"
```

---

## Task 9: Create User Frontend — Project Setup

**Files:**
- Create: `apps/web-user/project.json`
- Create: `apps/web-user/next.config.js`
- Create: `apps/web-user/tailwind.config.ts`
- Create: `apps/web-user/postcss.config.js`
- Create: `apps/web-user/tsconfig.json`
- Create: `apps/web-user/package.json`
- Create: `apps/web-user/src/app/layout.tsx`
- Create: `apps/web-user/src/app/globals.css`
- Create: `apps/web-user/src/app/page.tsx`

- [ ] **Step 1: Create project.json for Nx**

```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/web-user/src",
  "projectType": "application",
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "web-user:build",
        "dev": true,
        "port": 3000
      },
      "configurations": {
        "development": {
          "buildTarget": "web-user:build:development"
        },
        "production": {
          "buildTarget": "web-user:build:production",
          "dev": false
        }
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "defaultConfiguration": "production",
      "options": {},
      "configurations": {
        "development": {
          "outputPath": "dist/apps/web-user"
        },
        "production": {
          "outputPath": "dist/apps/web-user"
        }
      }
    }
  }
}
```

- [ ] **Step 2: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bili-pink': '#fb7299',
        'bili-blue': '#00a1d6',
        'bili-bg': '#f4f4f4',
        'bili-card': '#ffffff',
        'bili-text': '#212121',
        'bili-text-secondary': '#999999',
        'bili-border': '#e3e5e7',
        'bili-hover': '#e3e5e7',
      },
      fontFamily: {
        'harmony': ['HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      maxWidth: {
        'bili': '1140px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@yuliyuli/shared": ["../../libs/shared/src/index.ts"],
      "@yuliyuli/common-types": ["../../packages/common-types/src/index.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create globals.css with B站 base styles**

```css
/* apps/web-user/src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* B站基础样式 — 从 bilibili.com 爬取并适配 */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f4f4f4;
  --text-primary: #212121;
  --text-secondary: #999999;
  --brand-pink: #fb7299;
  --brand-blue: #00a1d6;
  --border-color: #e3e5e7;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

/* B站通用容器 */
.container-bili {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 10px;
}

/* B站卡片样式 */
.card-bili {
  background: var(--bg-primary);
  border-radius: 6px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.card-bili:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* B站按钮样式 */
.btn-bili {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.btn-bili-primary {
  background-color: var(--brand-pink);
  color: white;
}

.btn-bili-primary:hover {
  background-color: #e6638a;
}

.btn-bili-secondary {
  background-color: var(--brand-blue);
  color: white;
}

.btn-bili-secondary:hover {
  background-color: #008fc5;
}

/* B站输入框 */
.input-bili {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-bili:focus {
  border-color: var(--brand-blue);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
```

- [ ] **Step 7: Create root layout**

```tsx
// apps/web-user/src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YuLiYuLi - 哔哩哔哩',
  description: 'YuLiYuLi - bilibili style video platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder homepage**

```tsx
// apps/web-user/src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-bili-bg">
      <header className="bg-white shadow-sm">
        <div className="container-bili h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-bili-pink text-xl font-bold">YuLiYuLi</h1>
            <nav className="flex gap-4 text-sm">
              <a href="#" className="hover:text-bili-pink">首页</a>
              <a href="#" className="hover:text-bili-pink">动画</a>
              <a href="#" className="hover:text-bili-pink">番剧</a>
              <a href="#" className="hover:text-bili-pink">游戏</a>
              <a href="#" className="hover:text-bili-pink">音乐</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="搜索视频"
              className="input-bili w-64"
            />
            <button className="btn-bili btn-bili-primary">登录</button>
          </div>
        </div>
      </header>
      <main className="container-bili py-4">
        <div className="text-center py-20 text-bili-text-secondary">
          <p className="text-lg">YuLiYuLi — B站风格视频平台</p>
          <p className="mt-2">Phase 1 基础搭建完成</p>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 9: Install dependencies and verify**

Run: `npm install`
Run: `npx nx serve web-user`
Expected: Next.js dev server starts on http://localhost:3000, page renders with B站-style header

- [ ] **Step 10: Commit**

```bash
git add apps/web-user/
git commit -m "feat: add web-user Next.js app with B站-style base layout and Tailwind config"
```

---

## Task 10: Verify Full Stack

- [ ] **Step 1: Start Docker infrastructure**

Run: `cd docker && docker-compose up -d`
Expected: All containers running

- [ ] **Step 2: Start Gateway**

Run: `cd apps/gateway && mvn spring-boot:run`
Expected: Gateway starts on port 8080, registers with Nacos

- [ ] **Step 3: Start User Service**

Run: `cd apps/user-service && mvn spring-boot:run`
Expected: User service starts on port 8081, registers with Nacos

- [ ] **Step 4: Start Frontend**

Run: `npx nx serve web-user`
Expected: Frontend starts on port 3000

- [ ] **Step 5: Test registration via curl**

Run:
```bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","nickname":"测试用户"}'
```
Expected: `{"code":200,"message":"注册成功","data":""}`

- [ ] **Step 6: Test login via curl**

Run:
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```
Expected: `{"code":200,"message":"登录成功","data":{"token":"eyJ...","user":{...}}}`

- [ ] **Step 7: Test get user info**

Run:
```bash
curl http://localhost:8080/api/user/info \
  -H "Authorization: Bearer <token-from-step-6>"
```
Expected: User info JSON response

- [ ] **Step 8: Commit final state**

```bash
git add -A
git commit -m "chore: Phase 1 foundation complete — Gateway, User service, web-user frontend"
```

---

## Phase 2-5 Preview

| Phase | Focus | Services |
|-------|-------|----------|
| Phase 2 | Core Experience | Video (upload/transcode), Danmaku (WebSocket), Comment, 首页+播放页 |
| Phase 3 | Extended Features | Search (ES), Favorite, Follow, Feed, Recommend, Message |
| Phase 4 | Admin | Admin service, Config service, Statistics service, 管理端前端 |
| Phase 5 | Polish | FFmpeg transcoding pipeline, performance optimization, full Docker deployment |
