package com.yuliyuli.follow.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.follow.dto.FollowDTO;
import com.yuliyuli.follow.entity.Follow;
import com.yuliyuli.follow.mapper.FollowMapper;
import com.yuliyuli.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final FollowMapper followMapper;

    /**
     * 关注指定用户，不能关注自己，已关注则忽略
     */
    @Override
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

    /**
     * 取消关注指定用户
     */
    @Override
    public void unfollow(Long userId, Long followUserId) {
        followMapper.delete(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .eq(Follow::getFollowUserId, followUserId)
        );
    }

    /**
     * 判断是否已关注指定用户
     */
    @Override
    public boolean isFollowing(Long userId, Long followUserId) {
        Long count = followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .eq(Follow::getFollowUserId, followUserId)
        );
        return count > 0;
    }

    /**
     * 获取用户的关注列表
     */
    @Override
    public List<FollowDTO> getFollowing(Long userId) {
        List<Follow> follows = followMapper.selectList(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
                        .orderByDesc(Follow::getCreatedAt)
        );
        return follows.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 获取用户的粉丝列表
     */
    @Override
    public List<FollowDTO> getFollowers(Long userId) {
        List<Follow> follows = followMapper.selectList(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getFollowUserId, userId)
                        .orderByDesc(Follow::getCreatedAt)
        );
        return follows.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 获取用户的关注数量
     */
    @Override
    public long getFollowingCount(Long userId) {
        return followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getUserId, userId)
        );
    }

    /**
     * 获取用户的粉丝数量
     */
    @Override
    public long getFollowerCount(Long userId) {
        return followMapper.selectCount(
                new LambdaQueryWrapper<Follow>()
                        .eq(Follow::getFollowUserId, userId)
        );
    }

    /**
     * 将关注实体转换为DTO对象
     */
    private FollowDTO toDTO(Follow follow) {
        FollowDTO dto = new FollowDTO();
        BeanUtils.copyProperties(follow, dto);
        return dto;
    }
}
