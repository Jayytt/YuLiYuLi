package com.yuliyuli.favorite.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.favorite.dto.FavoriteDTO;
import com.yuliyuli.favorite.entity.Favorite;
import com.yuliyuli.favorite.mapper.FavoriteMapper;
import com.yuliyuli.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {
    private final FavoriteMapper favoriteMapper;

    /**
     * 添加视频收藏，若已收藏则忽略
     */
    @Override
    public void addFavorite(Long userId, Long videoId) {
        Long count = favoriteMapper.selectCount(
                new LambdaQueryWrapper<Favorite>()
                        .eq(Favorite::getUserId, userId)
                        .eq(Favorite::getVideoId, videoId)
        );
        if (count > 0) {
            return;
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setVideoId(videoId);
        favorite.setCreatedAt(LocalDateTime.now());
        favoriteMapper.insert(favorite);
    }

    /**
     * 移除视频收藏
     */
    @Override
    public void removeFavorite(Long userId, Long videoId) {
        favoriteMapper.delete(
                new LambdaQueryWrapper<Favorite>()
                        .eq(Favorite::getUserId, userId)
                        .eq(Favorite::getVideoId, videoId)
        );
    }

    /**
     * 判断用户是否已收藏指定视频
     */
    @Override
    public boolean isFavorited(Long userId, Long videoId) {
        Long count = favoriteMapper.selectCount(
                new LambdaQueryWrapper<Favorite>()
                        .eq(Favorite::getUserId, userId)
                        .eq(Favorite::getVideoId, videoId)
        );
        return count > 0;
    }

    /**
     * 获取用户的全部收藏列表
     */
    @Override
    public List<FavoriteDTO> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteMapper.selectList(
                new LambdaQueryWrapper<Favorite>()
                        .eq(Favorite::getUserId, userId)
                        .orderByDesc(Favorite::getCreatedAt)
        );
        return favorites.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 将收藏实体转换为DTO对象
     */
    private FavoriteDTO toDTO(Favorite favorite) {
        FavoriteDTO dto = new FavoriteDTO();
        BeanUtils.copyProperties(favorite, dto);
        return dto;
    }
}
