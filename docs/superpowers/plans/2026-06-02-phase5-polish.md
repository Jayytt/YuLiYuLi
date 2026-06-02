# Phase 5: Polish — Transcoding, Optimization & Deployment

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add video transcoding pipeline, performance optimizations, and Docker Compose full-stack deployment.

**Tech Stack:** FFmpeg, RocketMQ, Redis caching, MyBatis-Plus pagination, Docker Compose

**Prerequisites:** Phases 1-4 complete (14 microservices + 2 frontends)

---

## Task 1: Video Transcoding Pipeline (FFmpeg + RocketMQ)

**Files to modify:**
- Modify: `apps/video-service/pom.xml` — add RocketMQ + FFmpeg dependencies
- Modify: `apps/video-service/src/main/resources/application.yml` — add RocketMQ config
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/config/RocketMQConfig.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/service/TranscodingService.java`
- Create: `apps/video-service/src/main/java/com/yuliyuli/video/mq/TranscodingConsumer.java`
- Modify: `apps/video-service/src/main/java/com/yuliyuli/video/service/VideoService.java` — send MQ message after upload

- [ ] **Step 1: Add dependencies and config**

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
</dependency>
```

Add to `application.yml`:
```yaml
rocketmq:
  name-server: localhost:9876
  producer:
    group: video-service-group
```

- [ ] **Step 2: Create TranscodingService**

The transcoding service uses FFmpeg (via ProcessBuilder) to:
1. Transcode video to multiple resolutions: 360P (640x360), 480P (854x480), 720P (1280x720), 1080P (1920x1080)
2. Generate thumbnail at 1 second mark
3. Update video record with new URLs and status

```java
@Service
public class TranscodingService {
    @Value("${video.upload-dir:./uploads/videos}")
    private String videoDir;

    @Value("${video.cover-dir:./uploads/covers}")
    private String coverDir;

    public void transcode(Long videoId, String originalPath) {
        // 1. Check if FFmpeg is available
        // 2. For each resolution, run FFmpeg command:
        //    ffmpeg -i input.mp4 -vf scale=W:H -c:v libx264 -preset fast -crf 23 output_360p.mp4
        // 3. Generate thumbnail:
        //    ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
        // 4. Update video record with paths
    }
}
```

- [ ] **Step 3: Create RocketMQ Consumer**

```java
@Component
@RocketMQMessageListener(topic = "video-transcode", consumerGroup = "video-transcode-group")
public class TranscodingConsumer implements RocketMQListener<TranscodingMessage> {
    @Override
    public void onMessage(TranscodingMessage message) {
        // Call transcodingService.transcode(message.getVideoId(), message.getFilePath())
    }
}
```

Create `TranscodingMessage` DTO:
```java
@Data
public class TranscodingMessage {
    private Long videoId;
    private String filePath;
}
```

- [ ] **Step 4: Modify VideoService.upload to send MQ message**

After saving video record, send a RocketMQ message:
```java
rocketMQTemplate.convertAndSend("video-transcode", new TranscodingMessage(video.getId(), video.getVideoUrl()));
```

Set initial video status to 0 (pending transcode) instead of 1 (published).

- [ ] **Step 5: Commit**

```bash
git add apps/video-service/
git commit -m "feat: add video transcoding pipeline with FFmpeg and RocketMQ"
```

---

## Task 2: Performance Optimization

**Files to modify:**
- Modify: `apps/video-service/src/main/java/com/yuliyuli/video/service/VideoService.java` — Redis caching for video detail
- Modify: `apps/user-service/src/main/java/com/yuliyuli/user/service/UserService.java` — Redis caching for user info
- Modify: various services — add MybatisPlusConfig with pagination interceptor where missing
- Modify: `apps/video-service/src/main/java/com/yuliyuli/video/service/VideoService.java` — batch view count update

- [ ] **Step 1: Add Redis caching for video detail**

In VideoService, cache video detail in Redis with key `video:detail:{videoId}`, TTL 10 minutes:
```java
public VideoDTO getVideoById(Long videoId) {
    String cacheKey = "video:detail:" + videoId;
    String cached = redisTemplate.opsForValue().get(cacheKey);
    if (cached != null) {
        return objectMapper.readValue(cached, VideoDTO.class);
    }
    // ... query DB, increment view count
    redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(dto), 10, TimeUnit.MINUTES);
    return dto;
}
```

- [ ] **Step 2: Add Redis caching for user info**

In UserService, cache user info with key `user:info:{userId}`, TTL 30 minutes:
```java
public UserDTO getUserById(Long userId) {
    String cacheKey = "user:info:" + userId;
    // ... check cache first, then DB
}
```

Invalidate cache on profile update.

- [ ] **Step 3: Batch view count updates**

Instead of updating DB on every view, batch update view counts using Redis:
```java
// Increment in Redis
redisTemplate.opsForValue().increment("video:views:" + videoId);
// Periodically sync to DB (or use a scheduled task)
```

Add a scheduled task to flush view counts to DB every 5 minutes.

- [ ] **Step 4: Ensure pagination interceptors in all services**

Check and add `MybatisPlusConfig` with `PaginationInnerInterceptor` to services that use `Page<T>` but don't have it:
- user-service
- video-service
- comment-service
- favorite-service
- follow-service
- message-service
- admin-service

- [ ] **Step 5: Commit**

```bash
git add apps/
git commit -m "perf: add Redis caching and batch view count updates"
```

---

## Task 3: Docker Compose Full-Stack Deployment

**Files to modify:**
- Modify: `docker/docker-compose.yml` — add all 14 services + 2 frontends
- Create: `docker/Dockerfile.java` — shared Java service Dockerfile
- Create: `docker/Dockerfile.node` — shared Node.js frontend Dockerfile
- Create: `docker/.env` — environment variables for all services

- [ ] **Step 1: Create shared Dockerfiles**

`docker/Dockerfile.java`:
```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE ${PORT}
ENTRYPOINT ["java", "-jar", "app.jar"]
```

`docker/Dockerfile.node`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "start"]
```

- [ ] **Step 2: Add all services to docker-compose.yml**

Add 14 Java services and 2 Node.js frontends. Each service needs:
- Build context pointing to its target directory
- Environment variables for DB, Redis, Nacos, etc.
- Depends_on for infrastructure services
- Network: yuliyuli
- Health check

Example for gateway:
```yaml
gateway:
  build:
    context: ../apps/gateway
    dockerfile: ../../docker/Dockerfile.java
  container_name: yuliyuli-gateway
  ports:
    - "8080:8080"
  environment:
    - SPRING_CLOUD_NACOS_DISCOVERY_SERVER-ADDR=nacos:8848
    - JWT_SECRET=yuliyuli-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256
  depends_on:
    - nacos
    - mysql
    - redis
  networks:
    - yuliyuli
```

- [ ] **Step 3: Update .env with all service configs**

Add environment variables for all 14 services, including:
- Database URLs pointing to container names (mysql:3306 instead of localhost:3306)
- Redis host (redis:6379)
- Nacos host (nacos:8848)
- RocketMQ host (rocketmq-namesrv:9876)
- Elasticsearch host (elasticsearch:9200)
- MongoDB host (mongodb:27017)

- [ ] **Step 4: Commit**

```bash
git add docker/
git commit -m "feat: add Docker Compose full-stack deployment"
```
