package com.nexdom.nexdomestoquechallenger.dto.response;

import com.nexdom.nexdomestoquechallenger.entity.Product;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductCreateResponse {
    private Long id;
    private String nome;
    private String descricao;
    private String sku;
    private Double precoCusto;
    private Double precoVenda;
    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private String unidadeMedida;
    private CategoryResponse categoria;
    private SupplierResponse fornecedor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalSaidas;
    private Double lucroTotal;

    public static ProductCreateResponse of(Product product, Integer totalSaidas) {
        Double lucroTotal = (product.getSalePrice() - product.getSupplierPrice()) * totalSaidas;

        return ProductCreateResponse.builder()
                .id(product.getId())
                .nome(product.getName())
                .descricao(product.getDescription())
                .sku(product.getSku())
                .precoCusto(product.getSupplierPrice())
                .precoVenda(product.getSalePrice())
                .quantidadeEstoque(product.getStockQuantity())
                .estoqueMinimo(product.getMinimumStock())
                .unidadeMedida(product.getUnitOfMeasure())
                .categoria(product.getCategory() != null ?
                        CategoryResponse.builder()
                                .id(product.getCategory().getId())
                                .name(product.getCategory().getName())
                                .build() : null)
                .fornecedor(product.getSupplier() != null ?
                        SupplierResponse.builder()
                                .id(product.getSupplier().getId())
                                .name(product.getSupplier().getName())
                                .build() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .totalSaidas(totalSaidas)
                .lucroTotal(lucroTotal)
                .build();
    }

    public static ProductCreateResponse of(Product product) {
        return ProductCreateResponse.builder()
                .id(product.getId())
                .nome(product.getName())
                .descricao(product.getDescription())
                .sku(product.getSku())
                .precoCusto(product.getSupplierPrice())
                .precoVenda(product.getSalePrice())
                .quantidadeEstoque(product.getStockQuantity())
                .estoqueMinimo(product.getMinimumStock())
                .unidadeMedida(product.getUnitOfMeasure())
                .categoria(product.getCategory() != null ?
                        CategoryResponse.builder()
                                .id(product.getCategory().getId())
                                .name(product.getCategory().getName())
                                .build() : null)
                .fornecedor(product.getSupplier() != null ?
                        SupplierResponse.builder()
                                .id(product.getSupplier().getId())
                                .name(product.getSupplier().getName())
                                .build() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}