package com.yuliyuli.favorite.service;

import com.yuliyuli.favorite.dto.FavoriteDTO;

import java.util.List;

public interface FavoriteService {
    void addFavorite(Long userId, Long videoId);
    void removeFavorite(Long userId, Long videoId);
    boolean isFavorited(Long userId, Long videoId);
    List<FavoriteDTO> getUserFavorites(Long userId);
}
