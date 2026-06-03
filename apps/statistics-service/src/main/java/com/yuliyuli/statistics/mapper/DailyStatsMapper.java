package com.yuliyuli.statistics.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.statistics.entity.DailyStats;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DailyStatsMapper extends BaseMapper<DailyStats> {
}
