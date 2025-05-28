package com.nexdom.nexdomestoquechallenger.dto.request;

import lombok.Data;

@Data
public class FornecedorCreateRequest {

    private String nome;
    private String cnpj;
    private String telefone;
    private String email;
    private String endereco;
}