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

    /**
     * 发送评论
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Avatar", required = false) String userAvatar,
            @RequestBody CommentSendRequest request) {
        CommentDTO comment = commentService.send(request, userId, userName, userAvatar);
        return ResponseEntity.ok(Map.of("code", 200, "message", "评论成功", "data", comment));
    }

    /**
     * 获取视频评论列表
     */
    @GetMapping("/list/{videoId}")
    public ResponseEntity<Map<String, Object>> list(@PathVariable Long videoId) {
        List<CommentDTO> comments = commentService.getCommentsByVideoId(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", comments));
    }
}
