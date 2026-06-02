CREATE DATABASE IF NOT EXISTS yuliyuli_admin;
USE yuliyuli_admin;

CREATE TABLE t_admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN' COMMENT 'ADMIN, SUPER_ADMIN',
    status TINYINT DEFAULT 1 COMMENT '0: disabled, 1: enabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE t_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL COMMENT 'VIDEO, COMMENT, DANMAKU',
    target_id BIGINT NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status TINYINT DEFAULT 0 COMMENT '0: pending, 1: ignored, 2: warned, 3: deleted, 4: banned',
    handler_id BIGINT DEFAULT NULL,
    handle_note VARCHAR(500) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    handled_at DATETIME DEFAULT NULL,
    deleted TINYINT DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default super admin (password: admin123)
INSERT INTO t_admin_user (username, password, nickname, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '超级管理员', 'SUPER_ADMIN');
