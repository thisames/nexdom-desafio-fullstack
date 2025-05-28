package com.nexdom.nexdomestoquechallenger.dto.request;

import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class MovementCreateRequest {
    @NotNull(message = "ID do produto é obrigatório")
    @JsonProperty("produtoId")
    private Long productId;

    @NotNull(message = "Tipo de movimentação é obrigatório")
    @JsonProperty("tipo")
    private MovementType type;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    @JsonProperty("quantidade")
    private Integer quantity;

    @JsonProperty("usuarioResponsavel")
    private String responsibleUser;

    @JsonProperty("motivo")
    private String reason;

    @JsonProperty("precoVenda")
    private Double salePrice;
}