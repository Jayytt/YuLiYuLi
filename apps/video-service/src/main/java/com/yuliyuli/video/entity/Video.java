package com.yuliyuli.video.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_video")
public class Video {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private String videoUrl;
    private Integer duration;
    private Long viewCount;
    private Long danmakuCount;
    private Long likeCount;
    private Long coinCount;
    private Long favoriteCount;
    private Long shareCount;
    private Long categoryId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    @TableLogic
    private Integer deleted;
}
