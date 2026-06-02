package com.yuliyuli.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserRepository extends BaseMapper<User> {

    @Update("UPDATE t_user SET deleted = #{deleted}, updated_at = NOW() WHERE id = #{id}")
    int updateDeletedById(@Param("id") Long id, @Param("deleted") Integer deleted);
}
