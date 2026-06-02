package com.yuliyuli.danmaku.dto;

import lombok.Data;

@Data
public class DanmakuSendRequest {
    private Long videoId;
    private String content;
    private Integer type = 1;
    private Integer fontSize = 25;
    private Long color = 16777215L;
    private Double time;
}
