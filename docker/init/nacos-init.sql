UPDATE users SET password = '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', enabled = TRUE WHERE username = 'nacos';
INSERT IGNORE INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
