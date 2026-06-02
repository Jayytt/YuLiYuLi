package com.yuliyuli.feed.repository;

import com.yuliyuli.feed.entity.Feed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedRepository extends MongoRepository<Feed, String> {
    List<Feed> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds, Pageable pageable);
    List<Feed> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
