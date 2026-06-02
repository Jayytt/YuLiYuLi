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
