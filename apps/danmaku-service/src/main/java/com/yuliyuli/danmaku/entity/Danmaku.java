package com.yuliyuli.danmaku.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "danmaku")
public class Danmaku {
    @Id
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
