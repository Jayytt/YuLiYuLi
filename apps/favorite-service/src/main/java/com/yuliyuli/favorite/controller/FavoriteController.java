package com.yuliyuli.favorite.controller;

import com.yuliyuli.favorite.dto.FavoriteDTO;
import com.yuliyuli.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorite")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    /**
     * 添加视频收藏
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> add(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> body) {
        favoriteService.addFavorite(userId, body.get("videoId"));
        return ResponseEntity.ok(Map.of("code", 200, "message", "收藏成功", "data", ""));
    }

    /**
     * 取消视频收藏
     */
    @PostMapping("/remove")
    public ResponseEntity<Map<String, Object>> remove(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> body) {
        favoriteService.removeFavorite(userId, body.get("videoId"));
        return ResponseEntity.ok(Map.of("code", 200, "message", "取消收藏成功", "data", ""));
    }

    /**
     * 检查用户是否已收藏指定视频
     */
    @GetMapping("/check/{videoId}")
    public ResponseEntity<Map<String, Object>> check(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long videoId) {
        boolean favorited = favoriteService.isFavorited(userId, videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", favorited));
    }

    /**
     * 获取当前用户的收藏列表
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(@RequestHeader("X-User-Id") Long userId) {
        List<FavoriteDTO> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", favorites));
    }
}
