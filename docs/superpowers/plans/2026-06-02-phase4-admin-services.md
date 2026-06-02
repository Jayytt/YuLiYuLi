# Phase 4: Admin Services & Admin Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 3 admin microservices (Admin, Config, Statistics) and the admin frontend application.

**Architecture:** Admin services follow the same Entity → Repository → DTO → Service → Controller pattern. Admin frontend is a Next.js app with sidebar navigation, port 3001.

**Tech Stack:** Spring Boot 3.x, MyBatis-Plus, MySQL, Redis, Next.js 14, Tailwind CSS, Ant Design (admin UI)

**Prerequisites:** Phase 1-3 complete (all 11 microservices + user frontend)

---

## Task 1: Admin Service (MySQL)

**Files:**
- Create: `docker/init/mysql/07-admin-schema.sql`
- Create: `apps/admin-service/pom.xml`
- Create: `apps/admin-service/src/main/java/com/yuliyuli/admin/` (all layers)
- Create: `apps/admin-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_admin;
USE yuliyuli_admin;

CREATE TABLE t_admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN' COMMENT 'ADMIN, SUPER_ADMIN',
    status TINYINT DEFAULT 1 COMMENT '0: disabled, 1: enabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL COMMENT 'VIDEO, COMMENT, DANMAKU',
    target_id BIGINT NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status TINYINT DEFAULT 0 COMMENT '0: pending, 1: ignored, 2: warned, 3: deleted, 4: banned',
    handler_id BIGINT DEFAULT NULL,
    handle_note VARCHAR(500) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    handled_at DATETIME DEFAULT NULL,
    deleted TINYINT DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default super admin (password: admin123)
INSERT INTO t_admin_user (username, password, nickname, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '超级管理员', 'SUPER_ADMIN');
```

Port 8091. Service methods:
- `adminLogin(username, password)` — admin JWT login
- `getVideoList(page, size, status)` — list videos for audit
- `auditVideo(videoId, status)` — approve/reject video
- `getUserList(page, size, keyword)` — search users
- `toggleUserStatus(userId)` — ban/unban user
- `getReportList(page, size, status)` — list reports
- `handleReport(reportId, status, handlerId, note)` — process report

Controller endpoints: `POST /api/admin/login`, `GET /api/admin/video/list`, `POST /api/admin/video/audit`, `GET /api/admin/user/list`, `POST /api/admin/user/toggle-status`, `GET /api/admin/report/list`, `POST /api/admin/report/handle`.

- [ ] **Step 2: Commit**

```bash
git add apps/admin-service/ docker/init/mysql/07-admin-schema.sql
git commit -m "feat: add Admin service"
```

---

## Task 2: Config Service (MySQL + Redis)

**Files:**
- Create: `docker/init/mysql/08-config-schema.sql`
- Create: `apps/config-service/pom.xml`
- Create: `apps/config-service/src/main/java/com/yuliyuli/config/` (all layers)
- Create: `apps/config-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_config;
USE yuliyuli_config;

CREATE TABLE t_banner (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500) DEFAULT '',
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1 COMMENT '0: hidden, 1: visible',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_site_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description VARCHAR(200) DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_sensitive_word (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default site config
INSERT INTO t_site_config (config_key, config_value, description) VALUES
('site_name', 'YuLiYuLi', '站点名称'),
('site_description', '仿B站视频平台', '站点描述'),
('upload_max_size', '500', '上传文件最大大小(MB)'),
('upload_allowed_formats', 'mp4,avi,mov,flv', '允许上传的视频格式');
```

Port 8092. Service methods:
- `getBanners()` — get active banners (cached in Redis)
- `createBanner(banner)` / `updateBanner(banner)` / `deleteBanner(id)` — CRUD
- `getSiteConfig()` / `updateSiteConfig(key, value)` — site config CRUD
- `getSensitiveWords(page, size)` / `addSensitiveWord(word)` / `deleteSensitiveWord(id)` — sensitive word CRUD

Controller: `GET /api/config/banners`, `POST /api/config/banner`, `PUT /api/config/banner/{id}`, `DELETE /api/config/banner/{id}`, `GET /api/config/site`, `PUT /api/config/site`, `GET /api/config/sensitive-word/list`, `POST /api/config/sensitive-word`, `DELETE /api/config/sensitive-word/{id}`.

Note: `GET /api/config/banners` and `GET /api/config/site` are in the gateway white list (public access).

- [ ] **Step 2: Commit**

```bash
git add apps/config-service/ docker/init/mysql/08-config-schema.sql
git commit -m "feat: add Config service"
```

---

## Task 3: Statistics Service (MySQL + Redis)

**Files:**
- Create: `docker/init/mysql/09-statistics-schema.sql`
- Create: `apps/statistics-service/pom.xml`
- Create: `apps/statistics-service/src/main/java/com/yuliyuli/statistics/` (all layers)
- Create: `apps/statistics-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_statistics;
USE yuliyuli_statistics;

CREATE TABLE t_daily_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    new_users INT DEFAULT 0,
    new_videos INT DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    total_danmaku INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_category_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    category_id BIGINT NOT NULL,
    category_name VARCHAR(50) DEFAULT '',
    video_count INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_date_category (stat_date, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Port 8093. The statistics service reads from other services' databases (cross-database queries) or aggregates data. For simplicity, it reads directly from the other databases.

Service methods:
- `getDashboard()` — today's stats summary
- `getUserGrowthChart(days)` — user growth trend (last N days)
- `getVideoStatsChart(days)` — video stats trend
- `getCategoryRanking()` — category popularity ranking
- `getHotSearchKeywords()` — hot search keywords (from Redis)

Controller: `GET /api/statistics/dashboard`, `GET /api/statistics/user-growth`, `GET /api/statistics/video-stats`, `GET /api/statistics/category-ranking`, `GET /api/statistics/hot-keywords`.

- [ ] **Step 2: Commit**

```bash
git add apps/statistics-service/ docker/init/mysql/09-statistics-schema.sql
git commit -m "feat: add Statistics service"
```

---

## Task 4: Admin Frontend (web-admin)

**Files:**
- Create: `apps/web-admin/` (full Next.js app)
- Create: `apps/web-admin/project.json`
- Create: `apps/web-admin/package.json`
- Create: `apps/web-admin/next.config.js`
- Create: `apps/web-admin/tailwind.config.ts`
- Create: `apps/web-admin/postcss.config.js`
- Create: `apps/web-admin/tsconfig.json`
- Create: `apps/web-admin/src/` (all pages and components)

- [ ] **Step 1: Create project scaffold**

Project setup following web-user pattern:
```json
// package.json
{
  "name": "web-admin",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0"
  }
}
```

```json
// project.json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/web-admin/src",
  "projectType": "application",
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "web-admin:build",
        "dev": true,
        "port": 3001
      },
      "configurations": {
        "development": { "buildTarget": "web-admin:build:development" },
        "production": { "buildTarget": "web-admin:build:production", "dev": false }
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "defaultConfiguration": "production",
      "options": {},
      "configurations": {
        "development": { "outputPath": "dist/apps/web-admin" },
        "production": { "outputPath": "dist/apps/web-admin" }
      }
    }
  }
}
```

next.config.js — proxy `/api/*` to gateway on port 8080.
tailwind.config.ts — admin color scheme (blue/gray tones, not B站 pink).
tsconfig.json — extend base, paths for `@/*`.

- [ ] **Step 2: Create layout and API client**

`src/lib/api.ts` — same axios pattern as web-user with JWT interceptor.
`src/app/layout.tsx` — root layout with sidebar navigation.
`src/app/globals.css` — admin styles.

`src/components/Sidebar.tsx` — left sidebar with navigation links:
- 数据概览 (/)
- 视频管理 (/video)
- 用户管理 (/user)
- 评论管理 (/comment)
- 分类管理 (/category)
- Banner 管理 (/banner)
- 举报处理 (/report)
- 站点配置 (/settings)

`src/components/AdminHeader.tsx` — top header with admin info and logout.

- [ ] **Step 3: Create login page**

`src/app/login/page.tsx` — admin login form, POST to `/api/admin/login`, store token in localStorage, redirect to `/`.

- [ ] **Step 4: Create dashboard page**

`src/app/page.tsx` — data overview page:
- Stats cards (today's new users, new videos, total views, total comments)
- User growth chart (simple bar chart using CSS or a lightweight chart library)
- Category ranking table

- [ ] **Step 5: Create video management page**

`src/app/video/page.tsx` — video list with audit:
- Table: title, UP主, status, upload time, actions
- Filter by status (pending/published/rejected)
- Audit actions: approve, reject

- [ ] **Step 6: Create user management page**

`src/app/user/page.tsx` — user list:
- Table: username, nickname, level, status, created at, actions
- Search by keyword
- Toggle ban/unban

- [ ] **Step 7: Create banner management page**

`src/app/banner/page.tsx` — banner CRUD:
- Table: title, image preview, sort order, status, actions
- Add/edit modal with image URL, title, link, sort order
- Delete confirmation

- [ ] **Step 8: Create remaining pages**

`src/app/comment/page.tsx` — comment management (list + delete).
`src/app/category/page.tsx` — category tree management (CRUD).
`src/app/report/page.tsx` — report list with handle actions.
`src/app/settings/page.tsx` — site config form.

- [ ] **Step 9: Commit**

```bash
git add apps/web-admin/
git commit -m "feat: add Admin frontend"
```
