package com.yuliyuli.search.service;

import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.yuliyuli.search.document.VideoDocument;
import com.yuliyuli.search.dto.VideoSearchDTO;
import com.yuliyuli.search.repository.VideoSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final VideoSearchRepository videoSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    public Map<String, Object> searchVideos(String keyword, int page, int size) {
        Query multiMatchQuery = MultiMatchQuery.of(m -> m
                .query(keyword)
                .fields("title^2", "description")
                .type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields)
        )._toQuery();

        NativeQuery query = new NativeQueryBuilder()
                .withQuery(multiMatchQuery)
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<VideoDocument> hits = elasticsearchOperations.search(query, VideoDocument.class);
        List<VideoSearchDTO> dtoList = hits.getSearchHits().stream()
                .map(hit -> toDTO(hit.getContent()))
                .collect(Collectors.toList());

        long total = hits.getTotalHits();
        int totalPages = (int) Math.ceil((double) total / size);

        Map<String, Object> result = new HashMap<>();
        result.put("list", dtoList);
        result.put("total", total);
        result.put("totalPages", totalPages);
        result.put("currentPage", page);
        return result;
    }

    public void indexVideo(VideoDocument videoDocument) {
        videoSearchRepository.save(videoDocument);
    }

    public List<String> getSearchSuggestions(String keyword) {
        Query prefixQuery = co.elastic.clients.elasticsearch._types.query_dsl.Query.of(q -> q
                .matchPhrasePrefix(m -> m
                        .field("title")
                        .query(keyword)
                )
        );

        NativeQuery query = new NativeQueryBuilder()
                .withQuery(prefixQuery)
                .withPageable(PageRequest.of(0, 10))
                .build();

        SearchHits<VideoDocument> hits = elasticsearchOperations.search(query, VideoDocument.class);
        return hits.getSearchHits().stream()
                .map(hit -> hit.getContent().getTitle())
                .distinct()
                .collect(Collectors.toList());
    }

    private VideoSearchDTO toDTO(VideoDocument doc) {
        VideoSearchDTO dto = new VideoSearchDTO();
        dto.setVideoId(doc.getVideoId());
        dto.setTitle(doc.getTitle());
        dto.setDescription(doc.getDescription());
        dto.setUserName(doc.getUserName());
        dto.setViewCount(doc.getViewCount());
        dto.setCategoryId(doc.getCategoryId());
        dto.setCreatedAt(doc.getCreatedAt());
        return dto;
    }
}
