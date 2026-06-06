package com.yuliyuli.statistics.service;

import com.yuliyuli.statistics.entity.CategoryStats;
import com.yuliyuli.statistics.entity.DailyStats;

import java.util.List;
import java.util.Map;

public interface StatisticsService {
    DailyStats getDashboard();
    List<DailyStats> getUserGrowthChart(int days);
    List<DailyStats> getVideoStatsChart(int days);
    List<CategoryStats> getCategoryRanking();
    List<Map<String, Object>> getHotSearchKeywords();
}
