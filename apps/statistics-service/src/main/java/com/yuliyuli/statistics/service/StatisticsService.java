package com.yuliyuli.statistics.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.statistics.entity.CategoryStats;
import com.yuliyuli.statistics.entity.DailyStats;
import com.yuliyuli.statistics.repository.CategoryStatsRepository;
import com.yuliyuli.statistics.repository.DailyStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final DailyStatsRepository dailyStatsRepository;
    private final CategoryStatsRepository categoryStatsRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String HOT_KEYWORDS_KEY = "search:hot:keywords";

    /**
     * Get today's dashboard stats summary
     */
    public DailyStats getDashboard() {
        LocalDate today = LocalDate.now();
        DailyStats stats = dailyStatsRepository.selectOne(
                new LambdaQueryWrapper<DailyStats>()
                        .eq(DailyStats::getStatDate, today)
        );
        if (stats == null) {
            stats = new DailyStats();
            stats.setStatDate(today);
            stats.setNewUsers(0);
            stats.setNewVideos(0);
            stats.setTotalViews(0L);
            stats.setTotalDanmaku(0);
            stats.setTotalComments(0);
        }
        return stats;
    }

    /**
     * Get user growth trend for the last N days
     */
    public List<DailyStats> getUserGrowthChart(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        List<DailyStats> statsList = dailyStatsRepository.selectList(
                new LambdaQueryWrapper<DailyStats>()
                        .ge(DailyStats::getStatDate, startDate)
                        .orderByAsc(DailyStats::getStatDate)
        );

        // Fill in missing dates with zero values
        Map<LocalDate, DailyStats> statsMap = statsList.stream()
                .collect(Collectors.toMap(DailyStats::getStatDate, s -> s));

        List<DailyStats> result = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            result.add(statsMap.getOrDefault(date, createEmptyDailyStats(date)));
        }
        return result;
    }

    /**
     * Get video stats trend for the last N days
     */
    public List<DailyStats> getVideoStatsChart(int days) {
        // Same query logic as user growth chart, different data interpretation
        return getUserGrowthChart(days);
    }

    /**
     * Get category popularity ranking for today
     */
    public List<CategoryStats> getCategoryRanking() {
        LocalDate today = LocalDate.now();
        return categoryStatsRepository.selectList(
                new LambdaQueryWrapper<CategoryStats>()
                        .eq(CategoryStats::getStatDate, today)
                        .orderByDesc(CategoryStats::getViewCount)
        );
    }

    /**
     * Get hot search keywords from Redis sorted set
     */
    public List<Map<String, Object>> getHotSearchKeywords() {
        Set<String> keywords = redisTemplate.opsForZSet().reverseRange(HOT_KEYWORDS_KEY, 0, 19);
        if (keywords == null || keywords.isEmpty()) {
            return Collections.emptyList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (String keyword : keywords) {
            Double score = redisTemplate.opsForZSet().score(HOT_KEYWORDS_KEY, keyword);
            Map<String, Object> item = new HashMap<>();
            item.put("keyword", keyword);
            item.put("count", score != null ? score.longValue() : 0L);
            result.add(item);
        }
        return result;
    }

    private DailyStats createEmptyDailyStats(LocalDate date) {
        DailyStats stats = new DailyStats();
        stats.setStatDate(date);
        stats.setNewUsers(0);
        stats.setNewVideos(0);
        stats.setTotalViews(0L);
        stats.setTotalDanmaku(0);
        stats.setTotalComments(0);
        return stats;
    }
}
