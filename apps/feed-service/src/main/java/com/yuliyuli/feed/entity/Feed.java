package com.yuliyuli.feed.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "feed")
public class Feed {
    @Id
    private String id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String type; // "VIDEO", "DYNAMIC"
    private Long videoId;
    private String videoTitle;
    private String videoCover;
    private String content;
    private LocalDateTime createdAt;
}
