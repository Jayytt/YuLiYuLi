package com.yuliyuli.message.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.message.entity.Message;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {
}
