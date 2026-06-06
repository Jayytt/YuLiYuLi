package com.yuliyuli.search.service;

import com.yuliyuli.search.document.VideoDocument;

import java.util.List;
import java.util.Map;

public interface SearchService {
    Map<String, Object> searchVideos(String keyword, int page, int size);
    void indexVideo(VideoDocument videoDocument);
    List<String> getSearchSuggestions(String keyword);
}
