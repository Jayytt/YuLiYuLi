package com.yuliyuli.comment.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDTO {
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
    private LocalDateTime createdAt;
    private List<CommentDTO> replies;
}
