package com.yuliyuli.danmaku.controller;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;
import com.yuliyuli.danmaku.service.DanmakuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/danmaku")
@RequiredArgsConstructor
public class DanmakuController {
    private final DanmakuService danmakuService;

    /**
     * 发送弹幕
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestBody DanmakuSendRequest request) {
        DanmakuDTO danmaku = danmakuService.send(request, userId, userName);
        return ResponseEntity.ok(Map.of("code", 200, "message", "发送成功", "data", danmaku));
    }

    /**
     * 获取视频弹幕列表
     */
    @GetMapping("/list/{videoId}")
    public ResponseEntity<Map<String, Object>> list(@PathVariable Long videoId) {
        List<DanmakuDTO> danmakus = danmakuService.getDanmakuByVideoId(videoId);
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", danmakus));
    }
}
