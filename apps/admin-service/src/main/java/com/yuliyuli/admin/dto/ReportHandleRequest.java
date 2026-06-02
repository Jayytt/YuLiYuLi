package com.yuliyuli.admin.dto;

import lombok.Data;

@Data
public class ReportHandleRequest {
    private Long reportId;
    private Integer status;
    private Long handlerId;
    private String note;
}
