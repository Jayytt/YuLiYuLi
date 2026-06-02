package com.yuliyuli.config.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.config.entity.SensitiveWord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SensitiveWordRepository extends BaseMapper<SensitiveWord> {
}
