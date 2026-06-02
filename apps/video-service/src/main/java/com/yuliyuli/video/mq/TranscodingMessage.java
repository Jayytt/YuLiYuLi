package com.yuliyuli.video.mq;

import lombok.Data;
import java.io.Serializable;

@Data
public class TranscodingMessage implements Serializable {
    private Long videoId;
    private String filePath;
}
