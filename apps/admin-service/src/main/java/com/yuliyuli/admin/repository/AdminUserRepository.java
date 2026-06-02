package com.yuliyuli.admin.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.admin.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminUserRepository extends BaseMapper<AdminUser> {
}
