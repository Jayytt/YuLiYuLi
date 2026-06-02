package com.yuliyuli.favorite.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FavoriteDTO {
    private Long id;
    private Long userId;
    private Long videoId;
    private LocalDateTime createdAt;
}
