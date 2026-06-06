package com.yuliyuli.follow.service;

import com.yuliyuli.follow.dto.FollowDTO;

import java.util.List;

public interface FollowService {
    void follow(Long userId, Long followUserId);

    void unfollow(Long userId, Long followUserId);

    boolean isFollowing(Long userId, Long followUserId);

    List<FollowDTO> getFollowing(Long userId);

    List<FollowDTO> getFollowers(Long userId);

    long getFollowingCount(Long userId);

    long getFollowerCount(Long userId);
}
