package com.yuliyuli.video.controller;

import com.yuliyuli.video.entity.Category;
import com.yuliyuli.video.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list() {
        List<Category> categories = categoryService.listCategories();
        return ResponseEntity.ok(Map.of("code", 200, "message", "success", "data", categories));
    }
}
