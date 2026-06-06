package com.yuliyuli.danmaku.service;

import com.yuliyuli.danmaku.dto.DanmakuDTO;
import com.yuliyuli.danmaku.dto.DanmakuSendRequest;

import java.util.List;

public interface DanmakuService {
    DanmakuDTO send(DanmakuSendRequest request, Long userId, String userName);
    List<DanmakuDTO> getDanmakuByVideoId(Long videoId);
    long getDanmakuCount(Long videoId);
}
