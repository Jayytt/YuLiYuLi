package com.yuliyuli.follow.controller;

import com.yuliyuli.follow.dto.FollowDTO;
import com.yuliyuli.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> add(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> body) {
        followService.follow(userId, body.get("followUserId"));
        return ResponseEntity.ok(Map.of("code", 200, "message", "关注成功", "data", ""));
    }

    @PostMapping("/remove")
    public ResponseEntity<Map<String, Object>> remove(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> body) {
        followService.unfollow(userId, body.get("followUserId"));
        return ResponseEntity.ok(Map.of("code", 200, "message", "取消关注成功", "data", ""));
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<Map<String, Object>> check(
            @RequestHeader("X-User-Id") Long currentUserId,
            @PathVariable Long userId) {
        boolean following = followService.isFollowing(currentUserId, userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", following));
    }

    @GetMapping("/following")
    public ResponseEntity<Map<String, Object>> following(@RequestHeader("X-User-Id") Long userId) {
        List<FollowDTO> follows = followService.getFollowing(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", follows));
    }

    @GetMapping("/followers")
    public ResponseEntity<Map<String, Object>> followers(@RequestHeader("X-User-Id") Long userId) {
        List<FollowDTO> follows = followService.getFollowers(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", follows));
    }
}
