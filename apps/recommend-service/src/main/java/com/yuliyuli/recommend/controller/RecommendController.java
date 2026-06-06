package com.yuliyuli.recommend.controller;

import com.yuliyuli.recommend.dto.RecommendVideoDTO;
import com.yuliyuli.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private final RecommendService recommendService;

    /**
     * 获取推荐视频列表
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RecommendVideoDTO> videos = recommendService.getRecommendVideos(page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }

    /**
     * 获取分类热门视频列表
     */
    @GetMapping("/hot")
    public ResponseEntity<Map<String, Object>> hot(
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RecommendVideoDTO> videos = recommendService.getHotVideos(categoryId, page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }

    /**
     * 记录视频观看行为
     */
    @PostMapping("/record")
    public ResponseEntity<Map<String, Object>> record(@RequestBody Map<String, Object> body) {
        Long videoId = Long.valueOf(body.get("videoId").toString());
        String title = (String) body.get("title");
        String coverUrl = (String) body.get("coverUrl");
        String userName = (String) body.get("userName");
        Long viewCount = body.get("viewCount") != null ? Long.valueOf(body.get("viewCount").toString()) : null;
        Long danmakuCount = body.get("danmakuCount") != null ? Long.valueOf(body.get("danmakuCount").toString()) : null;
        Integer duration = body.get("duration") != null ? Integer.valueOf(body.get("duration").toString()) : null;
        recommendService.recordView(videoId, title, coverUrl, userName, viewCount, danmakuCount, duration);
        return ResponseEntity.ok(Map.of("code", 200, "message", "记录成功", "data", ""));
    }
}
