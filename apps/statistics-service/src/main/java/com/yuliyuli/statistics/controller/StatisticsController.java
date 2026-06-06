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

    /**
     * 获取今日仪表盘统计数据
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        DailyStats data = statisticsService.getDashboard();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    /**
     * 获取用户增长趋势图表数据
     */
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

    /**
     * 获取视频统计数据趋势图表
     */
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

    /**
     * 获取分类热度排行榜
     */
    @GetMapping("/category-ranking")
    public ResponseEntity<Map<String, Object>> getCategoryRanking() {
        List<CategoryStats> data = statisticsService.getCategoryRanking();
        return ResponseEntity.ok(Map.of(
                "code", 200,
                "message", "success",
                "data", data
        ));
    }

    /**
     * 获取热门搜索关键词列表
     */
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
