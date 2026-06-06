package com.yuliyuli.feed.service.impl;

import com.yuliyuli.feed.dto.FeedDTO;
import com.yuliyuli.feed.entity.Feed;
import com.yuliyuli.feed.mapper.FeedMapper;
import com.yuliyuli.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {
    private final FeedMapper feedMapper;

    /**
     * 发布新动态并保存到数据库
     */
    @Override
    public FeedDTO publishFeed(Long userId, String userName, String userAvatar,
                               String type, Long videoId, String videoTitle,
                               String videoCover, String content) {
        Feed feed = new Feed();
        feed.setUserId(userId);
        feed.setUserName(userName);
        feed.setUserAvatar(userAvatar);
        feed.setType(type);
        feed.setVideoId(videoId);
        feed.setVideoTitle(videoTitle);
        feed.setVideoCover(videoCover);
        feed.setContent(content);
        feed.setCreatedAt(LocalDateTime.now());
        feedMapper.save(feed);
        return toDTO(feed);
    }

    /**
     * 分页获取指定用户的动态列表
     */
    @Override
    public List<FeedDTO> getUserFeed(Long userId, int page, int size) {
        List<Feed> feeds = feedMapper.findByUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(page, size));
        return feeds.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 分页获取关注用户的动态列表
     */
    @Override
    public List<FeedDTO> getFollowingFeed(List<Long> followingUserIds, int page, int size) {
        List<Feed> feeds = feedMapper.findByUserIdInOrderByCreatedAtDesc(
                followingUserIds, PageRequest.of(page, size));
        return feeds.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 将动态实体转换为DTO对象
     */
    private FeedDTO toDTO(Feed feed) {
        FeedDTO dto = new FeedDTO();
        BeanUtils.copyProperties(feed, dto);
        return dto;
    }
}
