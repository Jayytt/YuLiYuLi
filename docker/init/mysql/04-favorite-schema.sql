CREATE DATABASE IF NOT EXISTS yuliyuli_favorite;
USE yuliyuli_favorite;

CREATE TABLE t_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    video_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_user_video (user_id, video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
