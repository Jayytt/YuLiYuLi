package com.yuliyuli.statistics.controller;

import com.yuliyuli.statistics.entity.CategoryStats;
import com.yuliyuli.statistics.entity.DailyStats;
import com.yuliyuli.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        DailyStats data = statisticsService.getDashboard();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @GetMapping("/user-growth")
    public ResponseEntity<Map<String, Object>> getUserGrowthChart(
            @RequestParam(defaultValue = "7") Integer days) {
        List<DailyStats> data = statisticsService.getUserGrowthChart(days);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @GetMapping("/video-stats")
    public ResponseEntity<Map<String, Object>> getVideoStatsChart(
            @RequestParam(defaultValue = "7") Integer days) {
        List<DailyStats> data = statisticsService.getVideoStatsChart(days);
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @GetMapping("/category-ranking")
    public ResponseEntity<Map<String, Object>> getCategoryRanking() {
        List<CategoryStats> data = statisticsService.getCategoryRanking();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    @GetMapping("/hot-keywords")
    public ResponseEntity<Map<String, Object>> getHotSearchKeywords() {
        List<Map<String, Object>> data = statisticsService.getHotSearchKeywords();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }
}
