package com.yuliyuli.config.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.config.entity.Banner;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BannerRepository extends BaseMapper<Banner> {
}
