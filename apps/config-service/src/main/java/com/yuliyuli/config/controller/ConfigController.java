package com.yuliyuli.config.controller;

import com.yuliyuli.config.entity.Banner;
import com.yuliyuli.config.entity.SensitiveWord;
import com.yuliyuli.config.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;

    @GetMapping("/banners")
    public ResponseEntity<Map<String, Object>> getBanners() {
        List<Banner> banners = configService.getBanners();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", banners
        ));
    }

    @PostMapping("/banner")
    public ResponseEntity<Map<String, Object>> createBanner(@RequestBody Banner banner) {
        Banner created = configService.createBanner(banner);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "创建成功",
                "data", created
        ));
    }

    @PutMapping("/banner/{id}")
    public ResponseEntity<Map<String, Object>> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        Banner updated = configService.updateBanner(id, banner);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "更新成功",
                "data", updated
        ));
    }

    @DeleteMapping("/banner/{id}")
    public ResponseEntity<Map<String, Object>> deleteBanner(@PathVariable Long id) {
        configService.deleteBanner(id);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "删除成功",
                "data", ""
        ));
    }

    @GetMapping("/site")
    public ResponseEntity<Map<String, Object>> getSiteConfig() {
        Map<String, String> config = configService.getSiteConfig();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", config
        ));
    }

    @PutMapping("/site")
    public ResponseEntity<Map<String, Object>> updateSiteConfig(@RequestBody Map<String, String> request) {
        String key = request.get("key");
        String value = request.get("value");
        if (key == null || value == null) {
            throw new RuntimeException("key和value不能为空");
        }
        configService.updateSiteConfig(key, value);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "更新成功",
                "data", ""
        ));
    }

    @GetMapping("/sensitive-word")
    public ResponseEntity<Map<String, Object>> getSensitiveWords(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Map<String, Object> data = configService.getSensitiveWords(page, size);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @PostMapping("/sensitive-word")
    public ResponseEntity<Map<String, Object>> addSensitiveWord(@RequestBody Map<String, String> request) {
        String word = request.get("word");
        if (word == null || word.isEmpty()) {
            throw new RuntimeException("敏感词不能为空");
        }
        SensitiveWord created = configService.addSensitiveWord(word);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "添加成功",
                "data", created
        ));
    }

    @DeleteMapping("/sensitive-word/{id}")
    public ResponseEntity<Map<String, Object>> deleteSensitiveWord(@PathVariable Long id) {
        configService.deleteSensitiveWord(id);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "删除成功",
                "data", ""
        ));
    }
}
