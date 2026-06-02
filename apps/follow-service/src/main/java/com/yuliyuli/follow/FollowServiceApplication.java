package com.yuliyuli.follow;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.yuliyuli.follow.repository")
public class FollowServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FollowServiceApplication.class, args);
    }
}
