CREATE DATABASE IF NOT EXISTS yuliyuli_comment;
USE yuliyuli_comment;

CREATE TABLE t_comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) DEFAULT '',
    user_avatar VARCHAR(500) DEFAULT '',
    content TEXT NOT NULL,
    parent_id BIGINT DEFAULT 0,
    reply_user_id BIGINT DEFAULT NULL,
    reply_user_name VARCHAR(50) DEFAULT NULL,
    like_count BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_video_id (video_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
