# Phase 3: Extended Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the remaining 6 microservices — Favorite, Follow, Feed, Recommend, Message, and Search.

**Architecture:** Each service follows the same pattern: Entity → Repository → DTO → Service → Controller. All register with Nacos and are routed through Gateway.

**Tech Stack:** Spring Boot 3.x, MyBatis-Plus, MongoDB, Redis, Elasticsearch, Nacos

**Prerequisites:** Phase 1+2 complete (Gateway, User, Video, Danmaku, Comment services + frontend)

---

## Task 1: Favorite Service (MySQL)

**Files:**
- Create: `docker/init/mysql/04-favorite-schema.sql`
- Create: `apps/favorite-service/pom.xml`
- Create: `apps/favorite-service/src/main/java/com/yuliyuli/favorite/` (all layers)
- Create: `apps/favorite-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_favorite;
USE yuliyuli_favorite;

CREATE TABLE t_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    video_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_user_video (user_id, video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Entity, Repository, DTO, Service, Controller following same pattern as Comment service. Port 8088.

Service methods: `addFavorite(userId, videoId)`, `removeFavorite(userId, videoId)`, `isFavorited(userId, videoId)`, `getUserFavorites(userId)`.

Controller endpoints: `POST /api/favorite/add`, `POST /api/favorite/remove`, `GET /api/favorite/check/{videoId}`, `GET /api/favorite/list`.

- [ ] **Step 2: Commit**

```bash
git add apps/favorite-service/ docker/init/mysql/04-favorite-schema.sql
git commit -m "feat: add Favorite service"
```

---

## Task 2: Follow Service (MySQL)

**Files:**
- Create: `docker/init/mysql/05-follow-schema.sql`
- Create: `apps/follow-service/pom.xml`
- Create: `apps/follow-service/src/main/java/com/yuliyuli/follow/` (all layers)
- Create: `apps/follow-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_follow;
USE yuliyuli_follow;

CREATE TABLE t_follow (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'who follows',
    follow_user_id BIGINT NOT NULL COMMENT 'who is followed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_follow (user_id, follow_user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_follow_user_id (follow_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Port 8089. Service: `follow(userId, followUserId)`, `unfollow(userId, followUserId)`, `isFollowing(userId, followUserId)`, `getFollowing(userId)`, `getFollowers(userId)`, `getFollowingCount(userId)`, `getFollowerCount(userId)`.

Controller: `POST /api/follow/add`, `POST /api/follow/remove`, `GET /api/follow/check/{userId}`, `GET /api/following`, `GET /api/followers`.

- [ ] **Step 2: Commit**

```bash
git add apps/follow-service/ docker/init/mysql/05-follow-schema.sql
git commit -m "feat: add Follow service"
```

---

## Task 3: Feed Service (MongoDB)

**Files:**
- Create: `apps/feed-service/pom.xml`
- Create: `apps/feed-service/src/main/java/com/yuliyuli/feed/` (all layers)
- Create: `apps/feed-service/src/main/resources/application.yml`

- [ ] **Step 1: Create all service files**

MongoDB document:
```java
@Document(collection = "feed")
public class Feed {
    @Id
    private String id;
    private Long userId;
    private String userName;
    private String userAvatar;
    /** VIDEO, DYNAMIC */
    private String type;
    private Long videoId;
    private String videoTitle;
    private String videoCover;
    private String content;
    private LocalDateTime createdAt;
}
```

Port 8090. Repository: `findByUserIdInOrderByCreatedAtDesc(List<Long> userIds, Pageable pageable)`.

Service: `publishFeed(userId, type, videoId, content)`, `getUserFeed(userId, page, size)`, `getFollowingFeed(userId, followingUserIds, page, size)`.

Controller: `POST /api/feed/publish`, `GET /api/feed/list`, `GET /api/feed/following`.

- [ ] **Step 2: Commit**

```bash
git add apps/feed-service/
git commit -m "feat: add Feed service with MongoDB"
```

---

## Task 4: Recommend Service (Redis)

**Files:**
- Create: `apps/recommend-service/pom.xml`
- Create: `apps/recommend-service/src/main/java/com/yuliyuli/recommend/` (all layers)
- Create: `apps/recommend-service/src/main/resources/application.yml`

- [ ] **Step 1: Create all service files**

Port 8087. Uses Redis sorted sets for hot videos. No separate database needed.

Service: `getRecommendVideos(page, size)` — returns popular videos sorted by view count. `getHotVideos(categoryId)` — hot videos by category. `recordView(videoId)` — increment view score in Redis.

Controller: `GET /api/recommend/list`, `GET /api/recommend/hot`.

- [ ] **Step 2: Commit**

```bash
git add apps/recommend-service/
git commit -m "feat: add Recommend service"
```

---

## Task 5: Message Service (MySQL + Redis)

**Files:**
- Create: `docker/init/mysql/06-message-schema.sql`
- Create: `apps/message-service/pom.xml`
- Create: `apps/message-service/src/main/java/com/yuliyuli/message/` (all layers)
- Create: `apps/message-service/src/main/resources/application.yml`

- [ ] **Step 1: Create schema + all service files**

Schema:
```sql
CREATE DATABASE IF NOT EXISTS yuliyuli_message;
USE yuliyuli_message;

CREATE TABLE t_message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    type TINYINT DEFAULT 0 COMMENT '0: system, 1: personal',
    is_read TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_sender_id (sender_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Port 8086. Service: `sendSystemMessage(content)`, `sendPersonalMessage(senderId, receiverId, content)`, `getMessages(userId, page, size)`, `markAsRead(messageId)`, `getUnreadCount(userId)`.

Controller: `POST /api/message/send`, `GET /api/message/list`, `POST /api/message/read/{id}`, `GET /api/message/unread-count`.

- [ ] **Step 2: Commit**

```bash
git add apps/message-service/ docker/init/mysql/06-message-schema.sql
git commit -m "feat: add Message service"
```

---

## Task 6: Search Service (Elasticsearch)

**Files:**
- Create: `apps/search-service/pom.xml`
- Create: `apps/search-service/src/main/java/com/yuliyuli/search/` (all layers)
- Create: `apps/search-service/src/main/resources/application.yml`

- [ ] **Step 1: Create all service files**

Port 8085. Uses Elasticsearch for full-text search.

Document:
```java
@Document(indexName = "video")
public class VideoDocument {
    @Id
    private String id;
    private Long videoId;
    private String title;
    private String description;
    private String userName;
    private Long viewCount;
    private Long categoryId;
    private LocalDateTime createdAt;
}
```

Service: `searchVideos(keyword, page, size)` — ES full-text search on title+description. `indexVideo(videoDocument)` — index a video. `getSearchSuggestions(keyword)` — search autocomplete.

Controller: `GET /api/search/videos`, `POST /api/search/index`, `GET /api/search/suggest`.

- [ ] **Step 2: Commit**

```bash
git add apps/search-service/
git commit -m "feat: add Search service with Elasticsearch"
```
