package com.yuliyuli.search.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Data
@Document(indexName = "video")
public class VideoDocument {
    @Id
    private String id;

    @Field(type = FieldType.Long)
    private Long videoId;

    // TODO: Install IK Analyzer plugin for better Chinese text support, then set analyzer = "ik_max_word"
    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Keyword)
    private String userName;

    @Field(type = FieldType.Long)
    private Long viewCount;

    @Field(type = FieldType.Long)
    private Long categoryId;

    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;
}
