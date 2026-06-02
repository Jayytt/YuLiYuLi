CREATE DATABASE IF NOT EXISTS yuliyuli_video;
USE yuliyuli_video;

CREATE TABLE t_video (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000) DEFAULT '',
    cover_url VARCHAR(500) DEFAULT '',
    video_url VARCHAR(500) DEFAULT '',
    duration INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    danmaku_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    coin_count BIGINT DEFAULT 0,
    favorite_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    category_id BIGINT DEFAULT 0,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) DEFAULT '',
    user_avatar VARCHAR(500) DEFAULT '',
    status TINYINT DEFAULT 0 COMMENT '0: pending, 1: published, 2: rejected',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    icon VARCHAR(200) DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO t_category (name, parent_id, icon, sort_order) VALUES
('动画', 0, '', 1), ('番剧', 0, '', 2), ('游戏', 0, '', 3),
('音乐', 0, '', 4), ('舞蹈', 0, '', 5), ('科技', 0, '', 6),
('生活', 0, '', 7), ('美食', 0, '', 8), ('鬼畜', 0, '', 9),
('时尚', 0, '', 10), ('娱乐', 0, '', 11), ('影视', 0, '', 12);
