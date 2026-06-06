package com.yuliyuli.recommend.service;

import com.yuliyuli.recommend.dto.RecommendVideoDTO;

import java.util.List;

public interface RecommendService {
    List<RecommendVideoDTO> getRecommendVideos(int page, int size);
    List<RecommendVideoDTO> getHotVideos(Long categoryId, int page, int size);
    void recordView(Long videoId, String title, String coverUrl, String userName, Long viewCount, Long danmakuCount, Integer duration);
    void addVideoToCategory(Long categoryId, Long videoId, Double score);
}
