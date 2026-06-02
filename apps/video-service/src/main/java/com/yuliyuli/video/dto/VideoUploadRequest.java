package com.yuliyuli.video.dto;

import lombok.Data;

@Data
public class VideoUploadRequest {
    private String title;
    private String description;
    private Long categoryId;
    private String tags;
}
