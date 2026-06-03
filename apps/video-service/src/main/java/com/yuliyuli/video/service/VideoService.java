package com.yuliyuli.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.video.dto.VideoDTO;
import com.yuliyuli.video.dto.VideoQueryRequest;
import com.yuliyuli.video.dto.VideoUploadRequest;
import com.yuliyuli.video.entity.Video;
import com.yuliyuli.video.mq.TranscodingMessage;
import com.yuliyuli.video.mapper.VideoMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoMapper videoMapper;
    private final StringRedisTemplate redisTemplate;
    private final RocketMQTemplate rocketMQTemplate;
    private final ObjectMapper objectMapper;

    private static final String VIDEO_DETAIL_PREFIX = "video:detail:";
    private static final long VIDEO_DETAIL_TTL_MINUTES = 10;

    public VideoDTO upload(VideoUploadRequest request, Long userId, String userName, String userAvatar) {
        Video video = new Video();
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setCategoryId(request.getCategoryId());
        video.setUserId(userId);
        video.setUserName(userName);
        video.setUserAvatar(userAvatar);
        video.setStatus(0);
        video.setViewCount(0L);
        video.setDanmakuCount(0L);
        video.setLikeCount(0L);
        video.setCoinCount(0L);
        video.setFavoriteCount(0L);
        video.setShareCount(0L);
        videoMapper.insert(video);

        // Send transcoding message via RocketMQ
        TranscodingMessage msg = new TranscodingMessage();
        msg.setVideoId(video.getId());
        msg.setFilePath(video.getVideoUrl());
        rocketMQTemplate.convertAndSend("video-transcode", msg);

        return toDTO(video);
    }

    public VideoDTO getVideoById(Long videoId) {
        // Check cache first
        String cacheKey = VIDEO_DETAIL_PREFIX + videoId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                VideoDTO dto = objectMapper.readValue(cached, VideoDTO.class);
                // Still increment view count asynchronously
                Video video = videoMapper.selectById(videoId);
                if (video != null) {
                    video.setViewCount(video.getViewCount() + 1);
                    videoMapper.updateById(video);
                    dto.setViewCount(video.getViewCount());
                }
                return dto;
            }
        } catch (JsonProcessingException e) {
            // Cache miss, fall through to DB
        }

        Video video = videoMapper.selectById(videoId);
        if (video == null) {
            throw new RuntimeException("视频不存在");
        }
        video.setViewCount(video.getViewCount() + 1);
        videoMapper.updateById(video);
        VideoDTO dto = toDTO(video);

        // Populate cache
        try {
            String json = objectMapper.writeValueAsString(dto);
            redisTemplate.opsForValue().set(cacheKey, json, VIDEO_DETAIL_TTL_MINUTES, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            // Non-critical, skip caching
        }

        return dto;
    }

    public List<VideoDTO> listVideos(VideoQueryRequest request) {
        Page<Video> page = new Page<>(request.getPage(), request.getSize());
        LambdaQueryWrapper<Video> wrapper = new LambdaQueryWrapper<Video>()
                .eq(Video::getStatus, 1)
                .eq(Video::getDeleted, 0);

        if (request.getCategoryId() != null) {
            wrapper.eq(Video::getCategoryId, request.getCategoryId());
        }
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Video::getTitle, request.getKeyword());
        }
        if ("hot".equals(request.getSort())) {
            wrapper.orderByDesc(Video::getViewCount);
        } else {
            wrapper.orderByDesc(Video::getCreatedAt);
        }

        Page<Video> result = videoMapper.selectPage(page, wrapper);
        return result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<VideoDTO> getUserVideos(Long userId) {
        List<Video> videos = videoMapper.selectList(
                new LambdaQueryWrapper<Video>()
                        .eq(Video::getUserId, userId)
                        .eq(Video::getStatus, 1)
                        .orderByDesc(Video::getCreatedAt)
        );
        return videos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void auditVideo(Long videoId, Integer status) {
        Video video = videoMapper.selectById(videoId);
        if (video == null) {
            throw new RuntimeException("视频不存在");
        }
        video.setStatus(status);
        videoMapper.updateById(video);
        // Invalidate cache
        redisTemplate.delete(VIDEO_DETAIL_PREFIX + videoId);
    }

    public List<VideoDTO> adminListVideos(int page, int size, Integer status) {
        Page<Video> videoPage = new Page<>(page, size);
        LambdaQueryWrapper<Video> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(Video::getStatus, status);
        }
        wrapper.orderByDesc(Video::getCreatedAt);
        Page<Video> result = videoMapper.selectPage(videoPage, wrapper);
        return result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VideoDTO toDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        BeanUtils.copyProperties(video, dto);
        return dto;
    }
}
