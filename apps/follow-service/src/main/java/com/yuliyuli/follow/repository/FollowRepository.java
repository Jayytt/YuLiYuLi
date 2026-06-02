package com.yuliyuli.follow.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.follow.entity.Follow;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FollowRepository extends BaseMapper<Follow> {
}
