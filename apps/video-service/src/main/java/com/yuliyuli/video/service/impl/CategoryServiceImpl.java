package com.yuliyuli.video.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuliyuli.video.entity.Category;
import com.yuliyuli.video.mapper.CategoryMapper;
import com.yuliyuli.video.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;

    /**
     * 查询所有顶级视频分类，按排序字段升序排列
     */
    @Override
    public List<Category> listCategories() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getParentId, 0)
                        .orderByAsc(Category::getSortOrder)
        );
    }
}
