package com.yuliyuli.search.repository;

import com.yuliyuli.search.document.VideoDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface VideoSearchRepository extends ElasticsearchRepository<VideoDocument, String> {
}
