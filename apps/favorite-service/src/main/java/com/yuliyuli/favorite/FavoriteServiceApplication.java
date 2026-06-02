package com.yuliyuli.favorite;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.yuliyuli.favorite.repository")
public class FavoriteServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FavoriteServiceApplication.class, args);
    }
}
