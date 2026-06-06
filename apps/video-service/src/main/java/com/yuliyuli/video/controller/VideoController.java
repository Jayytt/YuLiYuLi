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

    /**
     * 视频上传接口，提交视频信息并触发转码
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Avatar", required = false) String userAvatar,
            @RequestBody VideoUploadRequest request) {
        VideoDTO video = videoService.upload(request, userId, userName, userAvatar);
        return ResponseEntity.ok(Map.of("code", 200, "message", "上传成功", "data", video));
    }

    /**
     * 获取视频详情，同时增加播放量
     */
    @GetMapping("/detail/{videoId}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable Long videoId) {
        VideoDTO video = videoService.getVideoById(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", video));
    }

    /**
     * 分页查询已审核视频列表，支持分类和关键词筛选
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(VideoQueryRequest request) {
        List<VideoDTO> videos = videoService.listVideos(request);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }

    /**
     * 获取指定用户发布的视频列表
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserVideos(@PathVariable Long userId) {
        List<VideoDTO> videos = videoService.getUserVideos(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }

    /**
     * 管理员审核视频，设置视频状态
     */
    @PostMapping("/admin/audit")
    public ResponseEntity<Map<String, Object>> auditVideo(@RequestBody Map<String, Object> body) {
        Long videoId = Long.valueOf(body.get("videoId").toString());
        Integer status = Integer.valueOf(body.get("status").toString());
        videoService.auditVideo(videoId, status);
        return ResponseEntity.ok(Map.of("code", 200, "message", "审核成功", "data", ""));
    }

    /**
     * 管理员分页查询视频列表，支持按状态筛选
     */
    @GetMapping("/admin/list")
    public ResponseEntity<Map<String, Object>> adminList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status) {
        List<VideoDTO> videos = videoService.adminListVideos(page, size, status);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", videos));
    }
}
