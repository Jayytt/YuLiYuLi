package com.yuliyuli.message.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.message.entity.Message;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MessageRepository extends BaseMapper<Message> {
}
