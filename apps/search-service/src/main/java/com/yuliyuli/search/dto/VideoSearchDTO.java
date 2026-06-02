package com.yuliyuli.search.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VideoSearchDTO {
    private Long videoId;
    private String title;
    private String description;
    private String userName;
    private Long viewCount;
    private Long categoryId;
    private LocalDateTime createdAt;
}
