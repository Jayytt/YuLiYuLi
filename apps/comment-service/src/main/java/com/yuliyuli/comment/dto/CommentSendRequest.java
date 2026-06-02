package com.yuliyuli.comment.dto;

import lombok.Data;

@Data
public class CommentSendRequest {
    private Long videoId;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
}
