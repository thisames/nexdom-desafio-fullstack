package com.nexdom.nexdomestoquechallenger.dto.response;

import com.nexdom.nexdomestoquechallenger.entity.Product;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductProfitResponse {
    private Long productId;
    private String productName;
    private String sku;
    private Integer totalSaidas;
    private Double valorFornecedor;
    private Double valorVenda;
    private Double lucroTotal;

    public static ProductProfitResponse of(Product product, Integer vendas) {
        double lucroUnitario = product.getSalePrice() - product.getSupplierPrice();
        double lucroTotal = vendas * lucroUnitario;

        return ProductProfitResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .sku(product.getSku())
                .totalSaidas(vendas)
                .valorFornecedor(product.getSupplierPrice())
                .valorVenda(product.getSalePrice())
                .lucroTotal(lucroTotal)
                .build();
    }
}