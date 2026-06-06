package com.yuliyuli.video.service;

import com.yuliyuli.video.dto.VideoDTO;
import com.yuliyuli.video.dto.VideoQueryRequest;
import com.yuliyuli.video.dto.VideoUploadRequest;

import java.util.List;

public interface VideoService {
    VideoDTO upload(VideoUploadRequest request, Long userId, String userName, String userAvatar);
    VideoDTO getVideoById(Long videoId);
    List<VideoDTO> listVideos(VideoQueryRequest request);
    List<VideoDTO> getUserVideos(Long userId);
    void auditVideo(Long videoId, Integer status);
    List<VideoDTO> adminListVideos(int page, int size, Integer status);
}
