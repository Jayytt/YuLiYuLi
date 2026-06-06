package com.yuliyuli.feed.controller;

import com.yuliyuli.feed.dto.FeedDTO;
import com.yuliyuli.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    /**
     * 发布动态
     */
    @PostMapping("/publish")
    public ResponseEntity<Map<String, Object>> publish(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Avatar", required = false) String userAvatar,
            @RequestBody Map<String, Object> body) {
        String type = (String) body.get("type");
        Long videoId = body.get("videoId") != null ? Long.valueOf(body.get("videoId").toString()) : null;
        String videoTitle = (String) body.get("videoTitle");
        String videoCover = (String) body.get("videoCover");
        String content = (String) body.get("content");
        FeedDTO feed = feedService.publishFeed(userId, userName, userAvatar,
                type, videoId, videoTitle, videoCover, content);
        return ResponseEntity.ok(Map.of("code", 200, "message", "发布成功", "data", feed));
    }

    /**
     * 分页获取当前用户的动态列表
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<FeedDTO> feeds = feedService.getUserFeed(userId, page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", feeds));
    }

    /**
     * 获取关注用户的动态列表
     */
    @GetMapping("/following")
    public ResponseEntity<Map<String, Object>> following(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String followingUserIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Long> ids = Arrays.stream(followingUserIds.split(","))
                .map(String::trim)
                .map(Long::valueOf)
                .collect(java.util.stream.Collectors.toList());
        List<FeedDTO> feeds = feedService.getFollowingFeed(ids, page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", feeds));
    }
}
