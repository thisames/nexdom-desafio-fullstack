package com.nexdom.nexdomestoquechallenger.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
}