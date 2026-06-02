CREATE DATABASE IF NOT EXISTS yuliyuli_config;
USE yuliyuli_config;

CREATE TABLE t_banner (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500) DEFAULT '',
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1 COMMENT '0: hidden, 1: visible',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_site_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description VARCHAR(200) DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_sensitive_word (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default site config
INSERT INTO t_site_config (config_key, config_value, description) VALUES
('site_name', 'YuLiYuLi', '站点名称'),
('site_description', '仿B站视频平台', '站点描述'),
('upload_max_size', '500', '上传文件最大大小(MB)'),
('upload_allowed_formats', 'mp4,avi,mov,flv', '允许上传的视频格式');
