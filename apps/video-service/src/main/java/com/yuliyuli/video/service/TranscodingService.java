package com.yuliyuli.video.service;

public interface TranscodingService {
    void transcode(Long videoId, String originalPath);
}
