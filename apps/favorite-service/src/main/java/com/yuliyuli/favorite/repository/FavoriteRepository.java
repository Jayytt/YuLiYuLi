package com.yuliyuli.favorite.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yuliyuli.favorite.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteRepository extends BaseMapper<Favorite> {
}
