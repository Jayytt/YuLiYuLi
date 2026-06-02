package com.yuliyuli.statistics.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("t_daily_stats")
public class DailyStats {

    @TableId(type = IdType.AUTO)
    private Long id;

    private LocalDate statDate;

    private Integer newUsers;

    private Integer newVideos;

    private Long totalViews;

    private Integer totalDanmaku;

    private Integer totalComments;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
