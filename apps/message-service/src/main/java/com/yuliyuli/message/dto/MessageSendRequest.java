package com.yuliyuli.message.dto;

import lombok.Data;

@Data
public class MessageSendRequest {
    private Long receiverId;
    private String content;
    private Integer type;
}
