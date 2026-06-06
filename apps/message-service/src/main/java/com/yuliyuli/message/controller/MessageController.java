package com.yuliyuli.message.controller;

import com.yuliyuli.message.dto.MessageDTO;
import com.yuliyuli.message.dto.MessageSendRequest;
import com.yuliyuli.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    /**
     * 发送消息（系统消息或私信）
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody MessageSendRequest request) {
        MessageDTO message = messageService.send(request, userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "发送成功", "data", message));
    }

    /**
     * 分页获取当前用户的消息列表
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<MessageDTO> messages = messageService.getMessages(userId, page, size);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", messages));
    }

    /**
     * 标记指定消息为已读
     */
    @PostMapping("/read/{id}")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return ResponseEntity.ok(Map.of("code", 200, "message", "标记已读成功", "data", ""));
    }

    /**
     * 获取当前用户的未读消息数量
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> unreadCount(@RequestHeader("X-User-Id") Long userId) {
        long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", count));
    }
}
