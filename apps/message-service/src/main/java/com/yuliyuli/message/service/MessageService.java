package com.yuliyuli.message.service;

import com.yuliyuli.message.dto.MessageDTO;
import com.yuliyuli.message.dto.MessageSendRequest;

import java.util.List;

public interface MessageService {
    MessageDTO sendSystemMessage(String content);
    MessageDTO sendPersonalMessage(Long senderId, Long receiverId, String content);
    MessageDTO send(MessageSendRequest request, Long senderId);
    List<MessageDTO> getMessages(Long userId, int page, int size);
    void markAsRead(Long messageId);
    long getUnreadCount(Long userId);
}
