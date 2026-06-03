package com.yuliyuli.message.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuliyuli.message.dto.MessageDTO;
import com.yuliyuli.message.dto.MessageSendRequest;
import com.yuliyuli.message.entity.Message;
import com.yuliyuli.message.mapper.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageMapper messageMapper;
    private final StringRedisTemplate redisTemplate;

    private static final String UNREAD_COUNT_KEY = "message:unread:";
    private static final long UNREAD_COUNT_EXPIRE_MINUTES = 30;

    public MessageDTO sendSystemMessage(String content) {
        Message message = new Message();
        message.setSenderId(0L);
        message.setReceiverId(0L);
        message.setContent(content);
        message.setType(0);
        message.setIsRead(0);
        message.setCreatedAt(LocalDateTime.now());
        messageMapper.insert(message);
        return toDTO(message);
    }

    public MessageDTO sendPersonalMessage(Long senderId, Long receiverId, String content) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setType(1);
        message.setIsRead(0);
        message.setCreatedAt(LocalDateTime.now());
        messageMapper.insert(message);
        clearUnreadCountCache(receiverId);
        return toDTO(message);
    }

    public MessageDTO send(MessageSendRequest request, Long senderId) {
        if (request.getType() != null && request.getType() == 0) {
            return sendSystemMessage(request.getContent());
        }
        if (request.getReceiverId() == null) {
            throw new RuntimeException("receiverId is required for personal messages");
        }
        return sendPersonalMessage(senderId, request.getReceiverId(), request.getContent());
    }

    public List<MessageDTO> getMessages(Long userId, int page, int size) {
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<Message>()
                .eq(Message::getReceiverId, userId)
                .orderByDesc(Message::getCreatedAt);
        List<Message> messages = messageMapper.selectPage(new Page<>(page, size), wrapper).getRecords();
        return messages.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void markAsRead(Long messageId) {
        Message message = messageMapper.selectById(messageId);
        if (message == null) {
            throw new RuntimeException("Message not found");
        }
        message.setIsRead(1);
        messageMapper.updateById(message);
        clearUnreadCountCache(message.getReceiverId());
    }

    public long getUnreadCount(Long userId) {
        String cacheKey = UNREAD_COUNT_KEY + userId;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return Long.parseLong(cached);
        }
        long count = messageMapper.selectCount(
                new LambdaQueryWrapper<Message>()
                        .eq(Message::getReceiverId, userId)
                        .eq(Message::getIsRead, 0)
        );
        redisTemplate.opsForValue().set(cacheKey, String.valueOf(count), UNREAD_COUNT_EXPIRE_MINUTES, TimeUnit.MINUTES);
        return count;
    }

    private void clearUnreadCountCache(Long userId) {
        redisTemplate.delete(UNREAD_COUNT_KEY + userId);
    }

    private MessageDTO toDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        BeanUtils.copyProperties(message, dto);
        return dto;
    }
}
