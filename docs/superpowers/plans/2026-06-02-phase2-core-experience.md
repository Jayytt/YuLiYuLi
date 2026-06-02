# Phase 2: Core Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Video, Danmaku, and Comment services along with the user-facing homepage and video player page — the core B站 experience.

**Architecture:** Three new Spring Boot microservices (Video, Danmaku, Comment) registered with Nacos, routed through Gateway. Danmaku uses WebSocket (STOMP) for real-time push. Frontend pages use B站-identical styling.

**Tech Stack:** Spring Boot 3.x, MyBatis-Plus, MongoDB, Redis, WebSocket (STOMP), FFmpeg (placeholder), Next.js 14, Tailwind CSS

**UI Constraint:** User-side frontend MUST match B站 official site styles exactly.

**Prerequisites:** Phase 1 complete (Nx monorepo, Gateway, User service, web-user frontend, Docker Compose)

---

## Task 1: Video Service — Schema, Entity, Repository

**Files:**
- Create: `docker/init/mysql/02-video-schema.sql`
- Create: `apps/video-service/pom.xml`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/VideoServiceApplication.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/entity/Video.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/entity/Category.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/repository/VideoRepository.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/repository/CategoryRepository.java`
- Create: `apps/video-service/src/main/resources/application.yml`

- [ ] **Step 1: Create video database schema**

```sql
-- docker/init/mysql/02-video-schema.sql
CREATE DATABASE IF NOT EXISTS yuliyuli_video;
USE yuliyuli_video;

CREATE TABLE t_video (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000) DEFAULT '',
    cover_url VARCHAR(500) DEFAULT '',
    video_url VARCHAR(500) DEFAULT '',
    duration INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    danmaku_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    coin_count BIGINT DEFAULT 0,
    favorite_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    category_id BIGINT DEFAULT 0,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) DEFAULT '',
    user_avatar VARCHAR(500) DEFAULT '',
    status TINYINT DEFAULT 0 COMMENT '0: pending, 1: published, 2: rejected',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    icon VARCHAR(200) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO t_category (name, parent_id, icon, sort_order) VALUES
('动画', 0, '', 1), ('番剧', 0, '', 2), ('游戏', 0, '', 3),
('音乐', 0, '', 4), ('舞蹈', 0, '', 5), ('科技', 0, '', 6),
('生活', 0, '', 7), ('美食', 0, '', 8), ('鬼畜', 0, '', 9),
('时尚', 0, '', 10), ('娱乐', 0, '', 11), ('影视', 0, '', 12);
```

- [ ] **Step 2: Create video-service pom.xml**

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
    <artifactId>video-service</artifactId>
    <name>Video Service</name>
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
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
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

- [ ] **Step 3: Create VideoServiceApplication.java**

```java
package com.yuliyuli.video;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.yuliyuli.video.repository")
public class VideoServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VideoServiceApplication.class, args);
    }
}
```

- [ ] **Step 4: Create Video entity**

```java
package com.yuliyuli.video.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_video")
public class Video {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private String videoUrl;
    private Integer duration;
    private Long viewCount;
    private Long danmakuCount;
    private Long likeCount;
    private Long coinCount;
    private Long favoriteCount;
    private Long shareCount;
    private Long categoryId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    @TableLogic
    private Integer deleted;
}
```

- [ ] **Step 5: Create Category entity**

```java
package com.yuliyuli.video.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Long parentId;
    private String icon;
    private Integer sortOrder;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableLogic
    private Integer deleted;
}
```

- [ ] **Step 6: Create repositories**

```java
package com.yuliyuli.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.video.entity.Video;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoRepository extends BaseMapper<Video> {
}
```

```java
package com.yuliyuli.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.video.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryRepository extends BaseMapper<Category> {
}
```

- [ ] **Step 7: Create application.yml**

```yaml
server:
  port: 8082

spring:
  application:
    name: video-service
  servlet:
    multipart:
      max-file-size: 500MB
      max-request-size: 500MB
  datasource:
    url: jdbc:mysql://localhost:3306/yuliyuli_video?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
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

video:
  upload-dir: ./uploads/videos
  cover-dir: ./uploads/covers
```

- [ ] **Step 8: Commit**

```bash
git add apps/video-service/ docker/init/mysql/02-video-schema.sql
git commit -m "feat: add Video service entity, repository, and database schema"
```

---

## Task 2: Video Service — DTO, Service, Controller

**Files:**
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/dto/VideoDTO.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/dto/VideoUploadRequest.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/dto/VideoQueryRequest.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/service/VideoService.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/service/CategoryService.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/controller/VideoController.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/controller/CategoryController.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/config/GlobalExceptionHandler.java`

- [ ] **Step 1: Create DTOs**

```java
package com.yuliyuli.video.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VideoDTO {
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private String videoUrl;
    private Integer duration;
    private Long viewCount;
    private Long danmakuCount;
    private Long likeCount;
    private Long coinCount;
    private Long favoriteCount;
    private Long shareCount;
    private Long categoryId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private LocalDateTime createdAt;
}
```

```java
package com.yuliyuli.video.dto;

import lombok.Data;

@Data
public class VideoUploadRequest {
    private String title;
    private String description;
    private Long categoryId;
    private String tags;
}
```

```java
package com.yuliyuli.video.dto;

import lombok.Data;

@Data
public class VideoQueryRequest {
    private Integer page = 1;
    private Integer size = 20;
    private Long categoryId;
    private String keyword;
    private String sort = "new"; // new, hot
}
```

- [ ] **Step 2: Create VideoService**

```java
package com.yuliyuli.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.video.dto.VideoDTO;
import com.yuliyuli.video.dto.VideoQueryRequest;
import com.yuliyuli.video.dto.VideoUploadRequest;
import com.yuliyuli.video.entity.Video;
import com.yuliyuli.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final StringRedisTemplate redisTemplate;

    public VideoDTO upload(VideoUploadRequest request, Long userId, String userName, String userAvatar) {
        Video video = new Video();
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setCategoryId(request.getCategoryId());
        video.setUserId(userId);
        video.setUserName(userName);
        video.setUserAvatar(userAvatar);
        video.setStatus(1); // auto-publish for now
        video.setViewCount(0L);
        video.setDanmakuCount(0L);
        video.setLikeCount(0L);
        video.setCoinCount(0L);
        video.setFavoriteCount(0L);
        video.setShareCount(0L);
        videoRepository.insert(video);
        return toDTO(video);
    }

    public VideoDTO getVideoById(Long videoId) {
        Video video = videoRepository.selectById(videoId);
        if (video == null) {
            throw new RuntimeException("视频不存在");
        }
        // Increment view count
        video.setViewCount(video.getViewCount() + 1);
        videoRepository.updateById(video);
        return toDTO(video);
    }

    public List<VideoDTO> listVideos(VideoQueryRequest request) {
        Page<Video> page = new Page<>(request.getPage(), request.getSize());
        LambdaQueryWrapper<Video> wrapper = new LambdaQueryWrapper<Video>()
                .eq(Video::getStatus, 1)
                .eq(Video::getDeleted, 0);

        if (request.getCategoryId() != null) {
            wrapper.eq(Video::getCategoryId, request.getCategoryId());
        }
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Video::getTitle, request.getKeyword());
        }
        if ("hot".equals(request.getSort())) {
            wrapper.orderByDesc(Video::getViewCount);
        } else {
            wrapper.orderByDesc(Video::getCreatedAt);
        }

        Page<Video> result = videoRepository.selectPage(page, wrapper);
        return result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<VideoDTO> getUserVideos(Long userId) {
        List<Video> videos = videoRepository.selectList(
                new LambdaQueryWrapper<Video>()
                        .eq(Video::getUserId, userId)
                        .eq(Video::getStatus, 1)
                        .orderByDesc(Video::getCreatedAt)
        );
        return videos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VideoDTO toDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        BeanUtils.copyProperties(video, dto);
        return dto;
    }
}
```

- [ ] **Step 3: Create CategoryService**

```java
package com.yuliyuli.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.video.entity.Category;
import com.yuliyuli.video.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> listCategories() {
        return categoryRepository.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getParentId, 0)
                        .orderByAsc(Category::getSortOrder)
        );
    }
}
```

- [ ] **Step 4: Create GlobalExceptionHandler**

```java
package com.yuliyuli.video.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "code", 400, "message", e.getMessage(), "data", (Object) ""
        ));
    }
}
```

- [ ] **Step 5: Create VideoController**

```java
package com.yuliyuli.video.controller;

import com.yuliyuli.video.dto.VideoDTO;
import com.yuliyuli.video.dto.VideoQueryRequest;
import com.yuliyuli.video.dto.VideoUploadRequest;
import com.yuliyuli.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Avatar", required = false) String userAvatar,
            @RequestBody VideoUploadRequest request) {
        VideoDTO video = videoService.upload(request, userId, userName, userAvatar);
        return ResponseEntity.ok(Map.of("code", 200, "message", "上传成功", "data", video));
    }

    @GetMapping("/detail/{videoId}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable Long videoId) {
        VideoDTO video = videoService.getVideoById(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", video));
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(VideoQueryRequest request) {
        List<VideoDTO> videos = videoService.listVideos(request);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserVideos(@PathVariable Long userId) {
        List<VideoDTO> videos = videoService.getUserVideos(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }
}
```

- [ ] **Step 6: Create CategoryController**

```java
package com.yuliyuli.video.controller;

import com.yuliyuli.video.entity.Category;
import com.yuliyuli.video.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list() {
        List<Category> categories = categoryService.listCategories();
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", categories));
    }
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/video-service/src/main/java/com/yuliyuli/video/dto/ apps/video-service/src/main/java/com/yuliyuli/video/service/ apps/video-service/src/main/java/com/yuliyuli/video/controller/ apps/video-service/src/main/java/com/yuliyuli/video/config/
git commit -m "feat: add Video service DTO, Service, and Controller"
```

---

## Task 3: Danmaku Service (MongoDB + WebSocket)

**Files:**
- Create: `apps/danmaku-service/pom.xml`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/DanmakuServiceApplication.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/entity/Danmaku.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/repository/DanmakuRepository.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/dto/DanmakuDTO.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/dto/DanmakuSendRequest.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/service/DanmakuService.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/controller/DanmakuController.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/config/WebSocketConfig.java`
- Create: `apps/danmaku-service/src/main/java/com/yuliyuli/danmaku/config/GlobalExceptionHandler.java`
- Create: `apps/danmaku-service/src/main/resources/application.yml`

- [ ] **Step 1: Create pom.xml**

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
    <artifactId>danmaku-service</artifactId>
    <name>Danmaku Service</name>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
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

- [ ] **Step 2: Create application.yml**

```yaml
server:
  port: 8083

spring:
  application:
    name: danmaku-service
  data:
    mongodb:
      uri: mongodb://localhost:27017/yuliyuli_danmaku
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
```

- [ ] **Step 3: Create Danmaku entity (MongoDB)**

```java
package com.yuliyuli.danmaku.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "danmaku")
public class Danmaku {
    @Id
    private String id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String content;
    /** 1: scroll, 2: top, 3: bottom */
    private Integer type;
    /** Font size: 18, 25, 36 */
    private Integer fontSize;
    /** Color in decimal, e.g. 16777215 for white */
    private Long color;
    /** Video time in seconds when danmaku appears */
    private Double time;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 4: Create DanmakuRepository**

```java
package com.yuliyuli.danmaku.repository;

import com.yuliyuli.danmaku.entity.Danmaku;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DanmakuRepository extends MongoRepository<Danmaku, String> {
    List<Danmaku> findByVideoIdOrderByTimeAsc(Long videoId);
    long countByVideoId(Long videoId);
}
```

- [ ] **Step 5: Create DTOs**

```java
package com.yuliyuli.danmaku.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DanmakuDTO {
    private String id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String content;
    private Integer type;
    private Integer fontSize;
    private Long color;
    private Double time;
    private LocalDateTime createdAt;
}
```

```java
package com.yuliyuli.danmaku.dto;

import lombok.Data;

@Data
public class DanmakuSendRequest {
    private Long videoId;
    private String content;
    private Integer type = 1;
    private Integer fontSize = 25;
    private Long color = 16777215L;
    private Double time;
}
```

- [ ] **Step 6: Create WebSocketConfig**

```java
package com.yuliyuli.danmaku.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/danmaku")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

- [ ] **Step 7: Create DanmakuService**

```java
package com.yuliyuli.danmaku.service;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;
import com.yuliyuli.danmaku.entity.Danmaku;
import com.yuliyuli.danmaku.repository.DanmakuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DanmakuService {

    private final DanmakuRepository danmakuRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;

    public DanmakuDTO send(DanmakuSendRequest request, Long userId, String userName) {
        Danmaku danmaku = new Danmaku();
        danmaku.setVideoId(request.getVideoId());
        danmaku.setUserId(userId);
        danmaku.setUserName(userName);
        danmaku.setContent(request.getContent());
        danmaku.setType(request.getType());
        danmaku.setFontSize(request.getFontSize());
        danmaku.setColor(request.getColor());
        danmaku.setTime(request.getTime());
        danmaku.setCreatedAt(LocalDateTime.now());
        danmakuRepository.save(danmaku);

        DanmakuDTO dto = toDTO(danmaku);

        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/danmaku/" + request.getVideoId(), dto);

        return dto;
    }

    public List<DanmakuDTO> getDanmakuByVideoId(Long videoId) {
        List<Danmaku> danmakus = danmakuRepository.findByVideoIdOrderByTimeAsc(videoId);
        return danmakus.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public long getDanmakuCount(Long videoId) {
        return danmakuRepository.countByVideoId(videoId);
    }

    private DanmakuDTO toDTO(Danmaku danmaku) {
        DanmakuDTO dto = new DanmakuDTO();
        BeanUtils.copyProperties(danmaku, dto);
        return dto;
    }
}
```

- [ ] **Step 8: Create DanmakuController**

```java
package com.yuliyuli.danmaku.controller;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;
import com.yuliyuli.danmaku.service.DanmakuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/danmaku")
@RequiredArgsConstructor
public class DanmakuController {

    private final DanmakuService danmakuService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestBody DanmakuSendRequest request) {
        DanmakuDTO danmaku = danmakuService.send(request, userId, userName);
        return ResponseEntity.ok(Map.of("code", 200, "message", "发送成功", "data", danmaku));
    }

    @GetMapping("/list/{videoId}")
    public ResponseEntity<Map<String, Object>> list(@PathVariable Long videoId) {
        List<DanmakuDTO> danmakus = danmakuService.getDanmakuByVideoId(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", danmakus));
    }
}
```

- [ ] **Step 9: Create GlobalExceptionHandler**

```java
package com.yuliyuli.danmaku.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "code", 400, "message", e.getMessage(), "data", (Object) ""
        ));
    }
}
```

- [ ] **Step 10: Commit**

```bash
git add apps/danmaku-service/
git commit -m "feat: add Danmaku service with MongoDB and WebSocket real-time push"
```

---

## Task 4: Comment Service (MySQL + nested replies)

**Files:**
- Create: `docker/init/mysql/03-comment-schema.sql`
- Create: `apps/comment-service/pom.xml`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/CommentServiceApplication.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/entity/Comment.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/repository/CommentRepository.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/dto/CommentDTO.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/dto/CommentSendRequest.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/service/CommentService.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/controller/CommentController.java`
- Create: `apps/comment-service/src/main/java/com/yuliyuli/comment/config/GlobalExceptionHandler.java`
- Create: `apps/comment-service/src/main/resources/application.yml`

- [ ] **Step 1: Create comment schema**

```sql
-- docker/init/mysql/03-comment-schema.sql
CREATE DATABASE IF NOT EXISTS yuliyuli_comment;
USE yuliyuli_comment;

CREATE TABLE t_comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) DEFAULT '',
    user_avatar VARCHAR(500) DEFAULT '',
    content TEXT NOT NULL,
    parent_id BIGINT DEFAULT 0 COMMENT '0: root comment, >0: reply to comment',
    reply_user_id BIGINT DEFAULT NULL,
    reply_user_name VARCHAR(50) DEFAULT NULL,
    like_count BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_video_id (video_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- [ ] **Step 2: Create pom.xml**

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
    <artifactId>comment-service</artifactId>
    <name>Comment Service</name>
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
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
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

- [ ] **Step 3: Create application.yml**

```yaml
server:
  port: 8084

spring:
  application:
    name: comment-service
  datasource:
    url: jdbc:mysql://localhost:3306/yuliyuli_comment?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: yuliyuli123
    driver-class-name: com.mysql.cj.jdbc.Driver
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        username: nacos
        password: nacos

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

- [ ] **Step 4: Create CommentServiceApplication, entity, repository, DTOs**

```java
package com.yuliyuli.comment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.yuliyuli.comment.repository")
public class CommentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommentServiceApplication.class, args);
    }
}
```

```java
package com.yuliyuli.comment.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_comment")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
    private Long likeCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableLogic
    private Integer deleted;
}
```

```java
package com.yuliyuli.comment.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.comment.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentRepository extends BaseMapper<Comment> {
}
```

```java
package com.yuliyuli.comment.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDTO {
    private Long id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
    private Long likeCount;
    private LocalDateTime createdAt;
    private List<CommentDTO> replies;
}
```

```java
package com.yuliyuli.comment.dto;

import lombok.Data;

@Data
public class CommentSendRequest {
    private Long videoId;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
}
```

- [ ] **Step 5: Create CommentService**

```java
package com.yuliyuli.comment.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.comment.dto.CommentDTO;
import com.yuliyuli.comment.dto.CommentSendRequest;
import com.yuliyuli.comment.entity.Comment;
import com.yuliyuli.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentDTO send(CommentSendRequest request, Long userId, String userName, String userAvatar) {
        Comment comment = new Comment();
        comment.setVideoId(request.getVideoId());
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setUserAvatar(userAvatar);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId() != null ? request.getParentId() : 0L);
        comment.setReplyUserId(request.getReplyUserId());
        comment.setReplyUserName(request.getReplyUserName());
        comment.setLikeCount(0L);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.insert(comment);
        return toDTO(comment);
    }

    public List<CommentDTO> getCommentsByVideoId(Long videoId) {
        // Get root comments
        List<Comment> rootComments = commentRepository.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getVideoId, videoId)
                        .eq(Comment::getParentId, 0)
                        .orderByDesc(Comment::getCreatedAt)
        );

        // Get all replies for this video
        List<Comment> allReplies = commentRepository.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getVideoId, videoId)
                        .ne(Comment::getParentId, 0)
                        .orderByAsc(Comment::getCreatedAt)
        );

        // Group replies by parentId
        Map<Long, List<Comment>> replyMap = allReplies.stream()
                .collect(Collectors.groupingBy(Comment::getParentId));

        // Build tree
        List<CommentDTO> result = new ArrayList<>();
        for (Comment root : rootComments) {
            CommentDTO dto = toDTO(root);
            List<Comment> replies = replyMap.getOrDefault(root.getId(), new ArrayList<>());
            dto.setReplies(replies.stream().map(this::toDTO).collect(Collectors.toList()));
            result.add(dto);
        }
        return result;
    }

    private CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        BeanUtils.copyProperties(comment, dto);
        return dto;
    }
}
```

- [ ] **Step 6: Create CommentController and GlobalExceptionHandler**

```java
package com.yuliyuli.comment.controller;

import com.yuliyuli.comment.dto.CommentDTO;
import com.yuliyuli.comment.dto.CommentSendRequest;
import com.yuliyuli.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Avatar", required = false) String userAvatar,
            @RequestBody CommentSendRequest request) {
        CommentDTO comment = commentService.send(request, userId, userName, userAvatar);
        return ResponseEntity.ok(Map.of("code", 200, "message", "评论成功", "data", comment));
    }

    @GetMapping("/list/{videoId}")
    public ResponseEntity<Map<String, Object>> list(@PathVariable Long videoId) {
        List<CommentDTO> comments = commentService.getCommentsByVideoId(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", comments));
    }
}
```

```java
package com.yuliyuli.comment.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "code", 400, "message", e.getMessage(), "data", (Object) ""
        ));
    }
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/comment-service/ docker/init/mysql/03-comment-schema.sql
git commit -m "feat: add Comment service with nested replies"
```

---

## Task 5: Frontend — Homepage with Video Grid

**Files:**
- Create: `apps/web-user/src/components/Header.tsx`
- Create: `apps/web-user/src/components/VideoCard.tsx`
- Create: `apps/web-user/src/lib/api.ts`
- Modify: `apps/web-user/src/app/page.tsx`

- [ ] **Step 1: Create API client**

```typescript
// apps/web-user/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 2: Create Header component**

```tsx
// apps/web-user/src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1140px] mx-auto px-[10px] h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-bili-pink text-xl font-bold whitespace-nowrap">
            YuLiYuLi
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-bili-pink transition-colors">首页</Link>
            <Link href="/category/1" className="hover:text-bili-pink transition-colors">动画</Link>
            <Link href="/category/2" className="hover:text-bili-pink transition-colors">番剧</Link>
            <Link href="/category/3" className="hover:text-bili-pink transition-colors">游戏</Link>
            <Link href="/category/4" className="hover:text-bili-pink transition-colors">音乐</Link>
            <Link href="/category/5" className="hover:text-bili-pink transition-colors">舞蹈</Link>
            <Link href="/category/6" className="hover:text-bili-pink transition-colors">科技</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索视频"
              className="input-bili w-64 rounded-r-none"
            />
            <button
              onClick={handleSearch}
              className="btn-bili btn-bili-secondary rounded-l-none px-4"
            >
              搜索
            </button>
          </div>
          <button className="btn-bili btn-bili-primary">登录</button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create VideoCard component**

```tsx
// apps/web-user/src/components/VideoCard.tsx
import Link from 'next/link';

interface VideoCardProps {
  id: number;
  title: string;
  coverUrl: string;
  userName: string;
  viewCount: number;
  danmakuCount: number;
  duration: number;
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function VideoCard({ id, title, coverUrl, userName, viewCount, danmakuCount, duration }: VideoCardProps) {
  return (
    <Link href={`/video/${id}`} className="card-bili group cursor-pointer">
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bili-text-secondary">
            暂无封面
          </div>
        )}
        {duration > 0 && (
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm line-clamp-2 text-bili-text group-hover:text-bili-blue transition-colors">
          {title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between text-xs text-bili-text-secondary">
          <span>{userName}</span>
          <span>{formatCount(viewCount)}播放 · {formatCount(danmakuCount)}弹幕</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Update homepage**

```tsx
// apps/web-user/src/app/page.tsx
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';

async function getVideos() {
  try {
    const res = await fetch('http://localhost:8080/api/video/list?page=1&size=20', {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-bili-bg">
      <Header />
      <main className="max-w-[1140px] mx-auto px-[10px] py-4">
        {/* Category tabs */}
        <div className="bg-white rounded-lg p-3 mb-4 flex gap-4 text-sm overflow-x-auto">
          <span className="text-bili-pink font-medium whitespace-nowrap">推荐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">动画</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">番剧</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">游戏</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">音乐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">舞蹈</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">科技</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">生活</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">美食</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">鬼畜</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">时尚</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">娱乐</span>
          <span className="text-bili-text hover:text-bili-pink cursor-pointer whitespace-nowrap">影视</span>
        </div>

        {/* Video grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {videos.map((video: any) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                coverUrl={video.coverUrl}
                userName={video.userName}
                viewCount={video.viewCount}
                danmakuCount={video.danmakuCount}
                duration={video.duration}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-bili-text-secondary">
            <p className="text-lg">暂无视频</p>
            <p className="mt-2 text-sm">启动后端服务并上传视频后，这里将显示视频列表</p>
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web-user/src/
git commit -m "feat: add homepage with Header, VideoCard components and video grid"
```

---

## Task 6: Frontend — Video Player Page

**Files:**
- Create: `apps/web-user/src/app/video/[id]/page.tsx`
- Create: `apps/web-user/src/components/VideoPlayer.tsx`
- Create: `apps/web-user/src/components/DanmakuOverlay.tsx`
- Create: `apps/web-user/src/components/CommentSection.tsx`

- [ ] **Step 1: Create VideoPlayer component**

```tsx
// apps/web-user/src/components/VideoPlayer.tsx
'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
}

export default function VideoPlayer({ videoUrl, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white text-lg">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <span className="text-white text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white text-xs">{formatTime(duration)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (videoRef.current) videoRef.current.volume = v;
            }}
            className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DanmakuOverlay component**

```tsx
// apps/web-user/src/components/DanmakuOverlay.tsx
'use client';

import { useEffect, useState } from 'react';

interface Danmaku {
  id: string;
  content: string;
  color: number;
  type: number;
  time: number;
}

interface DanmakuOverlayProps {
  videoId: number;
  currentTime: number;
}

export default function DanmakuOverlay({ videoId, currentTime }: DanmakuOverlayProps) {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [visibleDanmakus, setVisibleDanmakus] = useState<Danmaku[]>([]);

  useEffect(() => {
    fetch(`/api/danmaku/list/${videoId}`)
      .then(res => res.json())
      .then(data => setDanmakus(data.data || []))
      .catch(() => {});
  }, [videoId]);

  useEffect(() => {
    const visible = danmakus.filter(d => {
      const diff = Math.abs(d.time - currentTime);
      return diff < 3; // Show danmaku within 3 seconds
    });
    setVisibleDanmakus(visible);
  }, [currentTime, danmakus]);

  const getColorHex = (color: number) => {
    return '#' + color.toString(16).padStart(6, '0');
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {visibleDanmakus.map((danmaku, index) => (
        <div
          key={danmaku.id}
          className="absolute whitespace-nowrap text-lg font-bold"
          style={{
            color: getColorHex(danmaku.color),
            top: `${(index * 30) % 300}px`,
            animation: 'danmaku-scroll 8s linear forwards',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {danmaku.content}
        </div>
      ))}
      <style jsx>{`
        @keyframes danmaku-scroll {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Create CommentSection component**

```tsx
// apps/web-user/src/components/CommentSection.tsx
'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  likeCount: number;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  videoId: number;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const fetchComments = () => {
    fetch(`/api/comment/list/${videoId}`)
      .then(res => res.json())
      .then(data => setComments(data.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const body: any = {
      videoId,
      content: newComment,
    };

    if (replyTo) {
      body.parentId = replyTo.id;
      body.replyUserId = replyTo.userId;
      body.replyUserName = replyTo.userName;
    }

    try {
      await fetch('/api/comment/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch {}
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <h3 className="text-base font-medium mb-4">评论 ({comments.length})</h3>

      {/* Comment input */}
      <div className="mb-6">
        {replyTo && (
          <div className="text-sm text-bili-text-secondary mb-2">
            回复 @{replyTo.userName}
            <button onClick={() => setReplyTo(null)} className="ml-2 text-bili-blue">取消</button>
          </div>
        )}
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="发一条友善的评论"
            className="input-bili flex-1 min-h-[60px] resize-none"
          />
          <button onClick={handleSubmit} className="btn-bili btn-bili-primary self-end">
            发布
          </button>
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-bili-border flex-shrink-0 flex items-center justify-center text-xs text-bili-text-secondary">
              {comment.userName?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-bili-blue">{comment.userName}</span>
                <span className="text-xs text-bili-text-secondary">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-bili-text-secondary">
                <button className="hover:text-bili-pink">👍 {comment.likeCount || 0}</button>
                <button onClick={() => setReplyTo(comment)} className="hover:text-bili-blue">回复</button>
              </div>

              {/* Nested replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-4 space-y-3 border-l-2 border-bili-border pl-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-bili-blue">{reply.userName}</span>
                        {reply.replyUserName && (
                          <span className="text-xs text-bili-text-secondary">
                            回复 <span className="text-bili-blue">@{reply.replyUserName}</span>
                          </span>
                        )}
                        <span className="text-xs text-bili-text-secondary">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm mt-1">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-bili-text-secondary text-sm">
            暂无评论，快来抢沙发吧！
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create video player page**

```tsx
// apps/web-user/src/app/video/[id]/page.tsx
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import DanmakuOverlay from '@/components/DanmakuOverlay';
import CommentSection from '@/components/CommentSection';

async function getVideo(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/video/detail/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);

  if (!video) {
    return (
      <div className="min-h-screen bg-bili-bg">
        <Header />
        <div className="text-center py-20 text-bili-text-secondary">
          <p className="text-lg">视频不存在或加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bili-bg">
      <Header />
      <main className="max-w-[1140px] mx-auto px-[10px] py-4">
        <div className="flex gap-4">
          {/* Left: Video + Comments */}
          <div className="flex-1">
            {/* Video player with danmaku */}
            <div className="relative">
              <VideoPlayer videoUrl={video.videoUrl} poster={video.coverUrl} />
            </div>

            {/* Video info */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h1 className="text-lg font-medium">{video.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-bili-text-secondary">
                <span>{video.viewCount}播放</span>
                <span>{video.danmakuCount}弹幕</span>
                <span>{new Date(video.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">👍</span>
                  <span>{video.likeCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">🪙</span>
                  <span>{video.coinCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">⭐</span>
                  <span>{video.favoriteCount}</span>
                </button>
                <button className="flex flex-col items-center text-xs text-bili-text-secondary hover:text-bili-pink">
                  <span className="text-lg">↗</span>
                  <span>{video.shareCount}</span>
                </button>
              </div>
            </div>

            {/* UP主 info */}
            <div className="bg-white rounded-lg p-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bili-border flex items-center justify-center text-sm">
                  {video.userName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">{video.userName}</p>
                  <p className="text-xs text-bili-text-secondary">UP主</p>
                </div>
              </div>
              <button className="btn-bili btn-bili-primary text-sm">+ 关注</button>
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-bili-text">{video.description}</p>
              </div>
            )}

            {/* Comments */}
            <CommentSection videoId={video.id} />
          </div>

          {/* Right: Recommendations */}
          <div className="w-[300px] flex-shrink-0">
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">相关推荐</h3>
              <div className="text-sm text-bili-text-secondary text-center py-8">
                暂无推荐
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web-user/src/
git commit -m "feat: add video player page with VideoPlayer, DanmakuOverlay, and CommentSection"
```

---

## Task 7: Update Gateway routes for new services

**Files:**
- Modify: `apps/gateway/src/main/resources/application.yml`

The gateway routes for video-service, danmaku-service, and comment-service were already configured in Phase 1 Task 5. Verify they exist:

- `video-service` → `lb://video-service` with `Path=/api/video/**`
- `danmaku-service` → `lb://danmaku-service` with `Path=/api/danmaku/**`
- `comment-service` → `lb://comment-service` with `Path=/api/comment/**`

No changes needed — routes already exist.

- [ ] **Step 1: Verify gateway routes**

Read `apps/gateway/src/main/resources/application.yml` and confirm the three routes exist.

- [ ] **Step 2: Commit (if changes needed)**

```bash
git add -A
git commit -m "chore: Phase 2 complete — Video, Danmaku, Comment services + homepage + player page"
```
