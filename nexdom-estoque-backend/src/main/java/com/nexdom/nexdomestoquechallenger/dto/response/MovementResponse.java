package com.nexdom.nexdomestoquechallenger.dto.response;

import com.nexdom.nexdomestoquechallenger.entity.Movement;
import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private MovementType type;
    private Integer quantity;
    private LocalDateTime dateTime;
    private String responsibleUser;
    private String reason;
    private Double salePrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MovementResponse of(Movement movement) {
        return MovementResponse.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .dateTime(movement.getDateTime())
                .responsibleUser(movement.getResponsibleUser())
                .reason(movement.getReason())
                .salePrice(movement.getSalePrice())
                .createdAt(movement.getCreatedAt())
                .updatedAt(movement.getUpdatedAt())
                .build();
    }
}