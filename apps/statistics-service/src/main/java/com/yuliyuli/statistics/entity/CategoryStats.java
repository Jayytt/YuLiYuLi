package com.yuliyuli.statistics.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("t_category_stats")
public class CategoryStats {

    @TableId(type = IdType.AUTO)
    private Long id;

    private LocalDate statDate;

    private Long categoryId;

    private String categoryName;

    private Integer videoCount;

    private Long viewCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
