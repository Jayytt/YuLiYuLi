package com.yuliyuli.recommend.service.impl;

import com.yuliyuli.recommend.dto.RecommendVideoDTO;
import com.yuliyuli.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {
    private final StringRedisTemplate redisTemplate;

    private static final String HOT_VIDEOS_KEY = "hot:videos";
    private static final String VIDEO_META_PREFIX = "video:meta:";
    private static final String CATEGORY_PREFIX = "hot:category:";

    @Override
    public List<RecommendVideoDTO> getRecommendVideos(int page, int size) {
        long start = (long) page * size;
        long end = start + size - 1;
        Set<String> videoIds = redisTemplate.opsForZSet().reverseRange(HOT_VIDEOS_KEY, start, end);
        if (videoIds == null || videoIds.isEmpty()) {
            return Collections.emptyList();
        }
        return fetchVideoMeta(videoIds);
    }

    @Override
    public List<RecommendVideoDTO> getHotVideos(Long categoryId, int page, int size) {
        String key = CATEGORY_PREFIX + categoryId;
        long start = (long) page * size;
        long end = start + size - 1;
        Set<String> videoIds = redisTemplate.opsForZSet().reverseRange(key, start, end);
        if (videoIds == null || videoIds.isEmpty()) {
            return Collections.emptyList();
        }
        return fetchVideoMeta(videoIds);
    }

    @Override
    public void recordView(Long videoId, String title, String coverUrl,
                           String userName, Long viewCount, Long danmakuCount, Integer duration) {
        String videoIdStr = String.valueOf(videoId);
        // Increment score in global hot list
        redisTemplate.opsForZSet().incrementScore(HOT_VIDEOS_KEY, videoIdStr,
                viewCount != null ? viewCount : 1);
        // Store metadata in hash
        Map<String, String> meta = new HashMap<>();
        meta.put("videoId", videoIdStr);
        meta.put("title", title != null ? title : "");
        meta.put("coverUrl", coverUrl != null ? coverUrl : "");
        meta.put("userName", userName != null ? userName : "");
        meta.put("viewCount", viewCount != null ? String.valueOf(viewCount) : "0");
        meta.put("danmakuCount", danmakuCount != null ? String.valueOf(danmakuCount) : "0");
        meta.put("duration", duration != null ? String.valueOf(duration) : "0");
        redisTemplate.opsForHash().putAll(VIDEO_META_PREFIX + videoIdStr, meta);
    }

    @Override
    public void addVideoToCategory(Long categoryId, Long videoId, Double score) {
        String key = CATEGORY_PREFIX + categoryId;
        redisTemplate.opsForZSet().add(key, String.valueOf(videoId), score);
    }

    private List<RecommendVideoDTO> fetchVideoMeta(Collection<String> videoIds) {
        List<RecommendVideoDTO> result = new ArrayList<>();
        for (String videoId : videoIds) {
            Map<Object, Object> meta = redisTemplate.opsForHash().entries(VIDEO_META_PREFIX + videoId);
            if (meta.isEmpty()) {
                continue;
            }
            RecommendVideoDTO dto = new RecommendVideoDTO();
            dto.setVideoId(Long.valueOf(videoId));
            dto.setTitle((String) meta.getOrDefault("title", ""));
            dto.setCoverUrl((String) meta.getOrDefault("coverUrl", ""));
            dto.setUserName((String) meta.getOrDefault("userName", ""));
            dto.setViewCount(parseLong((String) meta.getOrDefault("viewCount", "0")));
            dto.setDanmakuCount(parseLong((String) meta.getOrDefault("danmakuCount", "0")));
            dto.setDuration(parseLong((String) meta.getOrDefault("duration", "0")).intValue());
            result.add(dto);
        }
        return result;
    }

    private Long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}
