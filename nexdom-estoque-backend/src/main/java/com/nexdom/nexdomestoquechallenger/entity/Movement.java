package com.nexdom.nexdomestoquechallenger.entity;

import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private MovementType type;

    @Column(name = "quantidade", nullable = false)
    private Integer quantity;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dateTime = LocalDateTime.now();

    @Column(name = "usuario_responsavel")
    private String responsibleUser;

    @Column(name = "motivo")
    private String reason;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "sale_price")
    private Double salePrice;
}
