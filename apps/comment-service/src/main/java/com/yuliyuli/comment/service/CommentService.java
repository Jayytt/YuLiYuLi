package com.yuliyuli.comment.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.comment.dto.CommentDTO;
import com.yuliyuli.comment.dto.CommentSendRequest;
import com.yuliyuli.comment.entity.Comment;
import com.yuliyuli.comment.repository.CommentRepository;
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
public class CommentService {
    private final CommentRepository commentRepository;

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
        commentRepository.insert(comment);
        return toDTO(comment);
    }

    public List<CommentDTO> getCommentsByVideoId(Long videoId) {
        List<Comment> rootComments = commentRepository.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getVideoId, videoId)
                        .eq(Comment::getParentId, 0)
                        .orderByDesc(Comment::getCreatedAt)
        );

        List<Comment> allReplies = commentRepository.selectList(
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

    private CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        BeanUtils.copyProperties(comment, dto);
        return dto;
    }
}
