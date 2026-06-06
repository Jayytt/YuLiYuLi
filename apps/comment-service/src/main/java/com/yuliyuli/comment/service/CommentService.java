package com.yuliyuli.comment.service;

import com.yuliyuli.comment.dto.CommentDTO;
import com.yuliyuli.comment.dto.CommentSendRequest;

import java.util.List;

public interface CommentService {
    CommentDTO send(CommentSendRequest request, Long userId, String userName, String userAvatar);

    List<CommentDTO> getCommentsByVideoId(Long videoId);
}
