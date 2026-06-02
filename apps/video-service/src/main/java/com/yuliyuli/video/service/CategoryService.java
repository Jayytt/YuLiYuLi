package com.yuliyuli.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.video.entity.Category;
import com.yuliyuli.video.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> listCategories() {
        return categoryRepository.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getParentId, 0)
                        .orderByAsc(Category::getSortOrder)
        );
    }
}
