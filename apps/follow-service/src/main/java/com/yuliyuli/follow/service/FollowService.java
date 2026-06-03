package com.yuliyuli.follow.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.follow.dto.FollowDTO;
import com.yuliyuli.follow.entity.Follow;
import com.yuliyuli.follow.mapper.FollowMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowMapper followMapper;

    public void follow(Long userId, Long followUserId) {
        if (userId.equals(followUserId)) {
            throw new RuntimeException("不能关注自己");
        }
        Long count = followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .eq(Follow::getFollowUserId, followUserId)
        );
        if (count > 0) {
            return;
        }
        Follow follow = new Follow();
        follow.setUserId(userId);
        follow.setFollowUserId(followUserId);
        follow.setCreatedAt(LocalDateTime.now());
        followMapper.insert(follow);
    }

    public void unfollow(Long userId, Long followUserId) {
        followMapper.delete(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .eq(Follow::getFollowUserId, followUserId)
        );
    }

    public boolean isFollowing(Long userId, Long followUserId) {
        Long count = followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .eq(Follow::getFollowUserId, followUserId)
        );
        return count > 0;
    }

    public List<FollowDTO> getFollowing(Long userId) {
        List<Follow> follows = followMapper.selectList(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .orderByDesc(Follow::getCreatedAt)
        );
        return follows.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FollowDTO> getFollowers(Long userId) {
        List<Follow> follows = followMapper.selectList(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getFollowUserId, userId)
                        .orderByDesc(Follow::getCreatedAt)
        );
        return follows.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public long getFollowingCount(Long userId) {
        return followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
        );
    }

    public long getFollowerCount(Long userId) {
        return followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getFollowUserId, userId)
        );
    }

    private FollowDTO toDTO(Follow follow) {
        FollowDTO dto = new FollowDTO();
        BeanUtils.copyProperties(follow, dto);
        return dto;
    }
}
