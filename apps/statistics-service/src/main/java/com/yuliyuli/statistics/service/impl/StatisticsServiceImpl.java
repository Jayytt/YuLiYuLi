package com.yuliyuli.statistics.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.statistics.entity.CategoryStats;
import com.yuliyuli.statistics.entity.DailyStats;
import com.yuliyuli.statistics.mapper.CategoryStatsMapper;
import com.yuliyuli.statistics.mapper.DailyStatsMapper;
import com.yuliyuli.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final DailyStatsMapper dailyStatsMapper;
    private final CategoryStatsMapper categoryStatsMapper;
    private final StringRedisTemplate redisTemplate;

    private static final String HOT_KEYWORDS_KEY = "search:hot:keywords";

    /**
     * 获取今日仪表盘统计数据
     */
    @Override
    public DailyStats getDashboard() {
        LocalDate today = LocalDate.now();
        DailyStats stats = dailyStatsMapper.selectOne(
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
     * 获取最近N天的用户增长趋势数据
     */
    @Override
    public List<DailyStats> getUserGrowthChart(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        List<DailyStats> statsList = dailyStatsMapper.selectList(
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
     * 获取最近N天的视频统计数据趋势
     */
    @Override
    public List<DailyStats> getVideoStatsChart(int days) {
        // Same query logic as user growth chart, different data interpretation
        return getUserGrowthChart(days);
    }

    /**
     * 获取今日分类热度排行榜
     */
    @Override
    public List<CategoryStats> getCategoryRanking() {
        LocalDate today = LocalDate.now();
        return categoryStatsMapper.selectList(
                new LambdaQueryWrapper<CategoryStats>()
                        .eq(CategoryStats::getStatDate, today)
                        .orderByDesc(CategoryStats::getViewCount)
        );
    }

    /**
     * 从Redis有序集合中获取热门搜索关键词
     */
    @Override
    public List<Map<String, Object>> getHotSearchKeywords() {
        Set<org.springframework.data.redis.core.ZSetOperations.TypedTuple<String>> tuples =
                redisTemplate.opsForZSet().reverseRangeWithScores(HOT_KEYWORDS_KEY, 0, 19);
        if (tuples == null || tuples.isEmpty()) {
            return Collections.emptyList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (org.springframework.data.redis.core.ZSetOperations.TypedTuple<String> tuple : tuples) {
            Map<String, Object> item = new HashMap<>();
            item.put("keyword", tuple.getValue());
            item.put("count", tuple.getScore() != null ? tuple.getScore().longValue() : 0L);
            result.add(item);
        }
        return result;
    }

    /**
     * 创建指定日期的空统计数据对象
     */
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
