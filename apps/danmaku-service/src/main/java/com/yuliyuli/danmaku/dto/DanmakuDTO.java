package com.yuliyuli.danmaku.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DanmakuDTO {
    private String id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String content;
    private Integer type;
    private Integer fontSize;
    private Long color;
    private Double time;
    private LocalDateTime createdAt;
}
