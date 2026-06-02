package com.yuliyuli.feed.service;

import com.yuliyuli.feed.dto.FeedDTO;
import com.yuliyuli.feed.entity.Feed;
import com.yuliyuli.feed.repository.FeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {
    private final FeedRepository feedRepository;

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
        feedRepository.save(feed);
        return toDTO(feed);
    }

    public List<FeedDTO> getUserFeed(Long userId, int page, int size) {
        List<Feed> feeds = feedRepository.findByUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(page, size));
        return feeds.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FeedDTO> getFollowingFeed(List<Long> followingUserIds, int page, int size) {
        List<Feed> feeds = feedRepository.findByUserIdInOrderByCreatedAtDesc(
                followingUserIds, PageRequest.of(page, size));
        return feeds.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private FeedDTO toDTO(Feed feed) {
        FeedDTO dto = new FeedDTO();
        BeanUtils.copyProperties(feed, dto);
        return dto;
    }
}
