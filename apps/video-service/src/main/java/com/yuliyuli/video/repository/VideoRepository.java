package com.yuliyuli.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.video.entity.Video;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoRepository extends BaseMapper<Video> {
}
