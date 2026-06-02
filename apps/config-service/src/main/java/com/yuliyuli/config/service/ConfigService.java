package com.yuliyuli.config.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuliyuli.config.entity.Banner;
import com.yuliyuli.config.entity.SiteConfig;
import com.yuliyuli.config.entity.SensitiveWord;
import com.yuliyuli.config.repository.BannerRepository;
import com.yuliyuli.config.repository.SiteConfigRepository;
import com.yuliyuli.config.repository.SensitiveWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfigService {

    private final BannerRepository bannerRepository;
    private final SiteConfigRepository siteConfigRepository;
    private final SensitiveWordRepository sensitiveWordRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String BANNER_CACHE_KEY = "config:banners";
    private static final long BANNER_CACHE_TTL = 30; // minutes

    /**
     * Get active banners (cached in Redis)
     */
    public List<Banner> getBanners() {
        String cached = redisTemplate.opsForValue().get(BANNER_CACHE_KEY);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<Banner>>() {});
            } catch (JsonProcessingException e) {
                // Cache corrupted, fall through to DB
            }
        }

        List<Banner> banners = bannerRepository.selectList(
                new LambdaQueryWrapper<Banner>()
                        .eq(Banner::getStatus, 1)
                        .orderByAsc(Banner::getSortOrder)
                        .orderByDesc(Banner::getCreatedAt)
        );

        try {
            String json = objectMapper.writeValueAsString(banners);
            redisTemplate.opsForValue().set(BANNER_CACHE_KEY, json, BANNER_CACHE_TTL, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            // Log but don't fail
        }

        return banners;
    }

    /**
     * Create banner
     */
    public Banner createBanner(Banner banner) {
        bannerRepository.insert(banner);
        invalidateBannerCache();
        return banner;
    }

    /**
     * Update banner
     */
    public Banner updateBanner(Long id, Banner banner) {
        Banner existing = bannerRepository.selectById(id);
        if (existing == null) {
            throw new RuntimeException("Banner不存在");
        }

        banner.setId(id);
        bannerRepository.updateById(banner);
        invalidateBannerCache();
        return bannerRepository.selectById(id);
    }

    /**
     * Delete banner
     */
    public void deleteBanner(Long id) {
        Banner existing = bannerRepository.selectById(id);
        if (existing == null) {
            throw new RuntimeException("Banner不存在");
        }

        bannerRepository.deleteById(id);
        invalidateBannerCache();
    }

    /**
     * Get site config as key-value map
     */
    public Map<String, String> getSiteConfig() {
        List<SiteConfig> configs = siteConfigRepository.selectList(null);
        return configs.stream()
                .collect(Collectors.toMap(SiteConfig::getConfigKey, SiteConfig::getConfigValue));
    }

    /**
     * Update site config value by key
     */
    public void updateSiteConfig(String key, String value) {
        SiteConfig config = siteConfigRepository.selectOne(
                new LambdaQueryWrapper<SiteConfig>()
                        .eq(SiteConfig::getConfigKey, key)
        );

        if (config == null) {
            throw new RuntimeException("配置项不存在");
        }

        config.setConfigValue(value);
        siteConfigRepository.updateById(config);
    }

    /**
     * Get sensitive words with pagination
     */
    public Map<String, Object> getSensitiveWords(Integer page, Integer size) {
        Page<SensitiveWord> wordPage = new Page<>(page, size);
        LambdaQueryWrapper<SensitiveWord> wrapper = new LambdaQueryWrapper<SensitiveWord>()
                .orderByDesc(SensitiveWord::getCreatedAt);

        Page<SensitiveWord> result = sensitiveWordRepository.selectPage(wordPage, wrapper);

        return Map.of(
                "records", result.getRecords(),
                "total", result.getTotal(),
                "page", page,
                "size", size
        );
    }

    /**
     * Add sensitive word
     */
    public SensitiveWord addSensitiveWord(String word) {
        SensitiveWord existing = sensitiveWordRepository.selectOne(
                new LambdaQueryWrapper<SensitiveWord>()
                        .eq(SensitiveWord::getWord, word)
        );

        if (existing != null) {
            if (existing.getDeleted() == 1) {
                existing.setDeleted(0);
                sensitiveWordRepository.updateById(existing);
                return existing;
            }
            throw new RuntimeException("敏感词已存在");
        }

        SensitiveWord sensitiveWord = new SensitiveWord();
        sensitiveWord.setWord(word);
        sensitiveWordRepository.insert(sensitiveWord);
        return sensitiveWord;
    }

    /**
     * Delete sensitive word
     */
    public void deleteSensitiveWord(Long id) {
        SensitiveWord existing = sensitiveWordRepository.selectById(id);
        if (existing == null) {
            throw new RuntimeException("敏感词不存在");
        }

        sensitiveWordRepository.deleteById(id);
    }

    private void invalidateBannerCache() {
        redisTemplate.delete(BANNER_CACHE_KEY);
    }
}
