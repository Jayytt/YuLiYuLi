package com.yuliyuli.danmaku.repository;

import com.yuliyuli.danmaku.entity.Danmaku;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DanmakuRepository extends MongoRepository<Danmaku, String> {
    List<Danmaku> findByVideoIdOrderByTimeAsc(Long videoId);
    long countByVideoId(Long videoId);
}
