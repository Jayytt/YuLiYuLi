package com.yuliyuli.search.controller;

import com.yuliyuli.search.document.VideoDocument;
import com.yuliyuli.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    /**
     * 根据关键词搜索视频
     */
    @GetMapping("/videos")
    public ResponseEntity<Map<String, Object>> searchVideos(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new RuntimeException("搜索关键词不能为空");
        }
        Map<String, Object> result = searchService.searchVideos(keyword, page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", result));
    }

    /**
     * 将视频文档写入Elasticsearch索引
     */
    @PostMapping("/index")
    public ResponseEntity<Map<String, Object>> indexVideo(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody VideoDocument videoDocument) {
        searchService.indexVideo(videoDocument);
        return ResponseEntity.ok(Map.of("code", 200, "message", "索引成功", "data", ""));
    }

    /**
     * 根据关键词获取搜索建议
     */
    @GetMapping("/suggest")
    public ResponseEntity<Map<String, Object>> getSearchSuggestions(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new RuntimeException("搜索关键词不能为空");
        }
        List<String> suggestions = searchService.getSearchSuggestions(keyword);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", suggestions));
    }
}
