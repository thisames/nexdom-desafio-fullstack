package com.nexdom.nexdomestoquechallenger.dto.response;

import com.nexdom.nexdomestoquechallenger.entity.Product;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductStockResponse {
    private Long id;
    private String nome;
    private String sku;
    private Integer quantidadeEstoque;
    private Integer totalSaidas;
    private String categoria;
    private LocalDateTime updatedAt;

    public static ProductStockResponse of(Product product, Integer totalSaidas) {
        return ProductStockResponse.builder()
                .id(product.getId())
                .nome(product.getName())
                .sku(product.getSku())
                .quantidadeEstoque(product.getStockQuantity())
                .totalSaidas(totalSaidas)
                .categoria(product.getCategory() != null ? product.getCategory().getName() : null)
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}