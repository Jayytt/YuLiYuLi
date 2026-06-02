package com.yuliyuli.video.mq;

import com.yuliyuli.video.service.TranscodingService;
import lombok.RequiredArgsConstructor;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.stereotype.Component;

@Component
@RocketMQMessageListener(topic = "video-transcode", consumerGroup = "video-transcode-group")
@RequiredArgsConstructor
public class TranscodingConsumer implements RocketMQListener<TranscodingMessage> {
    private final TranscodingService transcodingService;

    @Override
    public void onMessage(TranscodingMessage message) {
        transcodingService.transcode(message.getVideoId(), message.getFilePath());
    }
}
