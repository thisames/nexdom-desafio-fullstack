package com.nexdom.nexdomestoquechallenger.controller;

import com.nexdom.nexdomestoquechallenger.dto.request.FornecedorCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.FornecedorCreateResponse;
import com.nexdom.nexdomestoquechallenger.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping("/")
    public ResponseEntity<FornecedorCreateResponse> createSupplier(@RequestBody FornecedorCreateRequest fornecedorDTO) {
        FornecedorCreateResponse fornecedorSalvo = supplierService.createSupplier(fornecedorDTO);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(fornecedorSalvo.getId())
                .toUri();

        return ResponseEntity.created(location).body(fornecedorSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorCreateResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.findSupplierDTOById(id));
    }

    @GetMapping
    public ResponseEntity<List<FornecedorCreateResponse>> getAllSuppliers(
            @RequestParam(required = false) String nome) {

        if (nome != null && !nome.isEmpty()) {
            return ResponseEntity.ok(supplierService.buscarPorNome(nome));
        }
        return ResponseEntity.ok(supplierService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorCreateResponse> updateSupplier(
            @PathVariable Long id,
            @RequestBody FornecedorCreateRequest fornecedorCreateRequest) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, fornecedorCreateRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}