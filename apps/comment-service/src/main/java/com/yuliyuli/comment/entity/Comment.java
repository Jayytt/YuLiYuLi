package com.yuliyuli.comment.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_comment")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long videoId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
    private Long likeCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableLogic
    private Integer deleted;
}
