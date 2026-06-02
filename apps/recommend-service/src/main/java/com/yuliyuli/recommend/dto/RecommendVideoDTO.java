package com.yuliyuli.recommend.dto;

import lombok.Data;

@Data
public class RecommendVideoDTO {
    private Long videoId;
    private String title;
    private String coverUrl;
    private String userName;
    private Long viewCount;
    private Long danmakuCount;
    private Integer duration;
}
