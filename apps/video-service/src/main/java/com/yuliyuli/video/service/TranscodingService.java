package com.yuliyuli.video.service;

import com.yuliyuli.video.entity.Video;
import com.yuliyuli.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class TranscodingService {
    private final VideoRepository videoRepository;

    @Value("${video.upload-dir:./uploads/videos}")
    private String videoDir;

    @Value("${video.cover-dir:./uploads/covers}")
    private String coverDir;

    public void transcode(Long videoId, String originalPath) {
        Video video = videoRepository.selectById(videoId);
        if (video == null) return;

        // Update status to "transcoding" (status=3)
        video.setStatus(3);
        videoRepository.updateById(video);

        try {
            // Transcode to multiple resolutions
            String baseName = "video_" + videoId;
            transcodeToResolution(originalPath, baseName, "360p", 640, 360);
            transcodeToResolution(originalPath, baseName, "480p", 854, 480);
            transcodeToResolution(originalPath, baseName, "720p", 1280, 720);
            transcodeToResolution(originalPath, baseName, "1080p", 1920, 1080);

            // Generate thumbnail
            String thumbnailPath = coverDir + "/" + baseName + "_thumb.jpg";
            generateThumbnail(originalPath, thumbnailPath);

            // Update video record
            video.setCoverUrl(thumbnailPath);
            video.setStatus(1); // published
            videoRepository.updateById(video);

            log.info("Video {} transcoded successfully", videoId);
        } catch (Exception e) {
            log.error("Transcoding failed for video {}: {}", videoId, e.getMessage());
            video.setStatus(2); // rejected/failed
            videoRepository.updateById(video);
        }
    }

    private void transcodeToResolution(String input, String baseName, String suffix, int width, int height) {
        String output = videoDir + "/" + baseName + "_" + suffix + ".mp4";
        ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg", "-i", input,
                "-vf", "scale=" + width + ":" + height,
                "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                "-c:a", "aac", "-b:a", "128k",
                "-y", output
        );
        pb.redirectErrorStream(true);
        try {
            Process process = pb.start();
            process.waitFor();
        } catch (Exception e) {
            log.error("Failed to transcode to {}: {}", suffix, e.getMessage());
        }
    }

    private void generateThumbnail(String input, String output) {
        ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg", "-i", input, "-ss", "00:00:01", "-vframes", "1", "-y", output
        );
        pb.redirectErrorStream(true);
        try {
            Process process = pb.start();
            process.waitFor();
        } catch (Exception e) {
            log.error("Failed to generate thumbnail: {}", e.getMessage());
        }
    }
}
