package com.yuliyuli.search.mapper;

import com.yuliyuli.search.document.VideoDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface VideoSearchMapper extends ElasticsearchRepository<VideoDocument, String> {
}
