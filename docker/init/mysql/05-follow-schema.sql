CREATE DATABASE IF NOT EXISTS yuliyuli_follow;
USE yuliyuli_follow;

CREATE TABLE t_follow (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'who follows',
    follow_user_id BIGINT NOT NULL COMMENT 'who is followed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    UNIQUE KEY uk_follow (user_id, follow_user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_follow_user_id (follow_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
