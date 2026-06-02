package com.yuliyuli.admin.dto;

import lombok.Data;

@Data
public class VideoAuditRequest {
    private Long videoId;
    private Integer status;
}
