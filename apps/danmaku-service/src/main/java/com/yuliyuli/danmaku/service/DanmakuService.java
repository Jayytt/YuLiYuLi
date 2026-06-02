package com.yuliyuli.danmaku.service;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;
import com.yuliyuli.danmaku.entity.Danmaku;
import com.yuliyuli.danmaku.repository.DanmakuRepository;
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
public class DanmakuService {
    private final DanmakuRepository danmakuRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;

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
        danmakuRepository.save(danmaku);

        DanmakuDTO dto = toDTO(danmaku);
        messagingTemplate.convertAndSend("/topic/danmaku/" + request.getVideoId(), dto);
        return dto;
    }

    public List<DanmakuDTO> getDanmakuByVideoId(Long videoId) {
        List<Danmaku> danmakus = danmakuRepository.findByVideoIdOrderByTimeAsc(videoId);
        return danmakus.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public long getDanmakuCount(Long videoId) {
        return danmakuRepository.countByVideoId(videoId);
    }

    private DanmakuDTO toDTO(Danmaku danmaku) {
        DanmakuDTO dto = new DanmakuDTO();
        BeanUtils.copyProperties(danmaku, dto);
        return dto;
    }
}
