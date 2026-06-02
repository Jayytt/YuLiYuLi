package com.yuliyuli.admin.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_report")
public class Report {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long reporterId;

    /** VIDEO, COMMENT, DANMAKU */
    private String targetType;

    private Long targetId;

    private String reason;

    /** 0: pending, 1: ignored, 2: warned, 3: deleted, 4: banned */
    private Integer status;

    private Long handlerId;

    private String handleNote;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    private LocalDateTime handledAt;

    @TableLogic
    private Integer deleted;
}
