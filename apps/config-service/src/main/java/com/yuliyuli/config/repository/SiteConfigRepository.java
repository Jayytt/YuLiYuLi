package com.yuliyuli.config.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.config.entity.SiteConfig;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SiteConfigRepository extends BaseMapper<SiteConfig> {
}
