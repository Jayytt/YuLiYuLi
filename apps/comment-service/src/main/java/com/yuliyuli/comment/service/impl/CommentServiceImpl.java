package com.yuliyuli.comment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.comment.dto.CommentDTO;
import com.yuliyuli.comment.dto.CommentSendRequest;
import com.yuliyuli.comment.entity.Comment;
import com.yuliyuli.comment.mapper.CommentMapper;
import com.yuliyuli.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentMapper commentMapper;

    /**
     * 发送评论并保存到数据库
     */
    @Override
    public CommentDTO send(CommentSendRequest request, Long userId, String userName, String userAvatar) {
        Comment comment = new Comment();
        comment.setVideoId(request.getVideoId());
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setUserAvatar(userAvatar);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId() != null ? request.getParentId() : 0L);
        comment.setReplyUserId(request.getReplyUserId());
        comment.setReplyUserName(request.getReplyUserName());
        comment.setLikeCount(0L);
        comment.setCreatedAt(LocalDateTime.now());
        commentMapper.insert(comment);
        return toDTO(comment);
    }

    /**
     * 获取指定视频的评论列表（含回复）
     */
    @Override
    public List<CommentDTO> getCommentsByVideoId(Long videoId) {
        List<Comment> rootComments = commentMapper.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getVideoId, videoId)
                        .eq(Comment::getParentId, 0)
                        .orderByDesc(Comment::getCreatedAt)
        );

        List<Comment> allReplies = commentMapper.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getVideoId, videoId)
                        .ne(Comment::getParentId, 0)
                        .orderByAsc(Comment::getCreatedAt)
        );

        Map<Long, List<Comment>> replyMap = allReplies.stream()
                .collect(Collectors.groupingBy(Comment::getParentId));

        List<CommentDTO> result = new ArrayList<>();
        for (Comment root : rootComments) {
            CommentDTO dto = toDTO(root);
            List<Comment> replies = replyMap.getOrDefault(root.getId(), new ArrayList<>());
            dto.setReplies(replies.stream().map(this::toDTO).collect(Collectors.toList()));
            result.add(dto);
        }
        return result;
    }

    /**
     * 将评论实体转换为DTO对象
     */
    private CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        BeanUtils.copyProperties(comment, dto);
        return dto;
    }
}
