CREATE DATABASE IF NOT EXISTS yuliyuli_statistics;
USE yuliyuli_statistics;

CREATE TABLE t_daily_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    new_users INT DEFAULT 0,
    new_videos INT DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    total_danmaku INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_category_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    category_id BIGINT NOT NULL,
    category_name VARCHAR(50) DEFAULT '',
    video_count INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_date_category (stat_date, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
