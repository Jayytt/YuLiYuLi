package com.yuliyuli.feed.service;

import com.yuliyuli.feed.dto.FeedDTO;

import java.util.List;

public interface FeedService {
    FeedDTO publishFeed(Long userId, String userName, String userAvatar, String type, Long videoId, String videoTitle, String videoCover, String content);
    List<FeedDTO> getUserFeed(Long userId, int page, int size);
    List<FeedDTO> getFollowingFeed(List<Long> followingUserIds, int page, int size);
}
