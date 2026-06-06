package com.yuliyuli.config.service;

import com.yuliyuli.config.entity.Banner;
import com.yuliyuli.config.entity.SensitiveWord;

import java.util.List;
import java.util.Map;

public interface ConfigService {
    List<Banner> getBanners();
    Banner createBanner(Banner banner);
    Banner updateBanner(Long id, Banner banner);
    void deleteBanner(Long id);
    Map<String, String> getSiteConfig();
    void updateSiteConfig(String key, String value);
    Map<String, Object> getSensitiveWords(Integer page, Integer size);
    SensitiveWord addSensitiveWord(String word);
    void deleteSensitiveWord(Long id);
}
