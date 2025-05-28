package com.nexdom.nexdomestoquechallenger.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String name;

    @Column(name = "descricao")
    private String description;

    @Column(name = "sku", unique = true, nullable = false)
    private String sku;

    @Column(name = "preco_venda", nullable = false)
    private Double salePrice;

    @Column(name = "quantidade_estoque", nullable = false)
    private Integer stockQuantity;

    @Column(name = "estoque_minimo")
    private Integer minimumStock;

    @Column(name = "unidade_medida")
    private String unitOfMeasure;

    @Column(name = "ativo", nullable = false)
    private Boolean active = true;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Supplier supplier;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "supplier_price", nullable = false)
    private Double supplierPrice;

    public Product(String name, String sku, Double supplierPrice, Double salePrice) {
        this.name = name;
        this.sku = sku;
        this.supplierPrice = supplierPrice;
        this.salePrice = salePrice;
        this.stockQuantity = 0;
    }
}