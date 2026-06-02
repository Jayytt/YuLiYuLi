package com.yuliyuli.video.dto;

import lombok.Data;

@Data
public class VideoQueryRequest {
    private Integer page = 1;
    private Integer size = 20;
    private Long categoryId;
    private String keyword;
    private String sort = "new";
}
