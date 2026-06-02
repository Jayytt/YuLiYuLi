package com.yuliyuli.statistics.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.statistics.entity.CategoryStats;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryStatsRepository extends BaseMapper<CategoryStats> {
}
