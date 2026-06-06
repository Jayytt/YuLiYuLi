package com.yuliyuli.danmaku.service.impl;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;
import com.yuliyuli.danmaku.entity.Danmaku;
import com.yuliyuli.danmaku.mapper.DanmakuMapper;
import com.yuliyuli.danmaku.service.DanmakuService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DanmakuServiceImpl implements DanmakuService {
    private final DanmakuMapper danmakuMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;

    /**
     * 发送弹幕并通过WebSocket广播
     */
    @Override
    public DanmakuDTO send(DanmakuSendRequest request, Long userId, String userName) {
        Danmaku danmaku = new Danmaku();
        danmaku.setVideoId(request.getVideoId());
        danmaku.setUserId(userId);
        danmaku.setUserName(userName);
        danmaku.setContent(request.getContent());
        danmaku.setType(request.getType());
        danmaku.setFontSize(request.getFontSize());
        danmaku.setColor(request.getColor());
        danmaku.setTime(request.getTime());
        danmaku.setCreatedAt(LocalDateTime.now());
        danmakuMapper.save(danmaku);

        DanmakuDTO dto = toDTO(danmaku);
        messagingTemplate.convertAndSend("/topic/danmaku/" + request.getVideoId(), dto);
        return dto;
    }

    /**
     * 获取指定视频的弹幕列表
     */
    @Override
    public List<DanmakuDTO> getDanmakuByVideoId(Long videoId) {
        List<Danmaku> danmakus = danmakuMapper.findByVideoIdOrderByTimeAsc(videoId);
        return danmakus.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * 获取指定视频的弹幕数量
     */
    @Override
    public long getDanmakuCount(Long videoId) {
        return danmakuMapper.countByVideoId(videoId);
    }

    /**
     * 将弹幕实体转换为DTO对象
     */
    private DanmakuDTO toDTO(Danmaku danmaku) {
        DanmakuDTO dto = new DanmakuDTO();
        BeanUtils.copyProperties(danmaku, dto);
        return dto;
    }
}
