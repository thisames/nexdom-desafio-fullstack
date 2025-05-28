package com.nexdom.nexdomestoquechallenger.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nexdom.nexdomestoquechallenger.entity.Product;
import lombok.Data;

@Data
public class ProductCreateRequest {
    @JsonProperty("nome")
    private String name;

    @JsonProperty("descricao")
    private String description;

    @JsonProperty("sku")
    private String sku;

    @JsonProperty("valorFornecedor")
    private Double supplierPrice;

    @JsonProperty("precoVenda")
    private Double salePrice;

    @JsonProperty("quantidadeEstoque")
    private Integer stockQuantity;

    @JsonProperty("estoqueMinimo")
    private Integer minimumStock;

    @JsonProperty("unidadeMedida")
    private String measurementUnit;

    @JsonProperty("categoriaId")
    private Long categoryId;

    @JsonProperty("fornecedorId")
    private Long supplierId;

    public ProductCreateRequest() {
    }

    public ProductCreateRequest(Product product) {
        this.name = product.getName();
        this.sku = product.getSku();
        this.supplierPrice = product.getSupplierPrice();
        this.salePrice = product.getSalePrice();
        this.stockQuantity = product.getStockQuantity();
        this.categoryId = product.getCategory().getId();
        this.supplierId = product.getSupplier() != null ? product.getSupplier().getId() : null;
    }
}