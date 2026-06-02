package com.yuliyuli.message.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Integer type;
    private Integer isRead;
    private LocalDateTime createdAt;
}
