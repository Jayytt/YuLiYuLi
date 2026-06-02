package com.yuliyuli.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.video.dto.VideoDTO;
import com.yuliyuli.video.dto.VideoQueryRequest;
import com.yuliyuli.video.dto.VideoUploadRequest;
import com.yuliyuli.video.entity.Video;
import com.yuliyuli.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final StringRedisTemplate redisTemplate;

    public VideoDTO upload(VideoUploadRequest request, Long userId, String userName, String userAvatar) {
        Video video = new Video();
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setCategoryId(request.getCategoryId());
        video.setUserId(userId);
        video.setUserName(userName);
        video.setUserAvatar(userAvatar);
        video.setStatus(1);
        video.setViewCount(0L);
        video.setDanmakuCount(0L);
        video.setLikeCount(0L);
        video.setCoinCount(0L);
        video.setFavoriteCount(0L);
        video.setShareCount(0L);
        videoRepository.insert(video);
        return toDTO(video);
    }

    public VideoDTO getVideoById(Long videoId) {
        Video video = videoRepository.selectById(videoId);
        if (video == null) {
            throw new RuntimeException("视频不存在");
        }
        video.setViewCount(video.getViewCount() + 1);
        videoRepository.updateById(video);
        return toDTO(video);
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

        Page<Video> result = videoRepository.selectPage(page, wrapper);
        return result.getRecords().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<VideoDTO> getUserVideos(Long userId) {
        List<Video> videos = videoRepository.selectList(
                new LambdaQueryWrapper<Video>()
                        .eq(Video::getUserId, userId)
                        .eq(Video::getStatus, 1)
                        .orderByDesc(Video::getCreatedAt)
        );
        return videos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VideoDTO toDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        BeanUtils.copyProperties(video, dto);
        return dto;
    }
}
