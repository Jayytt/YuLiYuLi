package com.yuliyuli.statistics.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.statistics.entity.DailyStats;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DailyStatsRepository extends BaseMapper<DailyStats> {
}
