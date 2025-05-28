package com.nexdom.nexdomestoquechallenger.dto.response;

import com.nexdom.nexdomestoquechallenger.entity.Supplier;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FornecedorCreateResponse {
    private Long id;
    private String nome;
    private String cnpj;
    private String telefone;
    private String email;
    private String endereco;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FornecedorCreateResponse of(Supplier supplier) {
        return FornecedorCreateResponse.builder()
                .id(supplier.getId())
                .nome(supplier.getName())
                .cnpj(supplier.getCnpj())
                .telefone(supplier.getPhone())
                .email(supplier.getEmail())
                .endereco(supplier.getAddress())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
}