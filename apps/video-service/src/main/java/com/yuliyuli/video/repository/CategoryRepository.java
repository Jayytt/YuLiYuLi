package com.yuliyuli.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.video.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryRepository extends BaseMapper<Category> {
}
