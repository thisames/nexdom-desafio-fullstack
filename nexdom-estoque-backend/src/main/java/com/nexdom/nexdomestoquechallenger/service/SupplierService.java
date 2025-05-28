package com.nexdom.nexdomestoquechallenger.service;

import com.nexdom.nexdomestoquechallenger.dto.request.FornecedorCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.FornecedorCreateResponse;
import com.nexdom.nexdomestoquechallenger.entity.Supplier;
import com.nexdom.nexdomestoquechallenger.exceptions.ResourceNotFoundException;
import com.nexdom.nexdomestoquechallenger.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional
    public FornecedorCreateResponse createSupplier(FornecedorCreateRequest fornecedorCreateRequest) {
        if (fornecedorCreateRequest.getCnpj() != null &&
                supplierRepository.existsByCnpj(fornecedorCreateRequest.getCnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + fornecedorCreateRequest.getCnpj());
        }

        Supplier supplier = new Supplier();
        supplier.setName(fornecedorCreateRequest.getNome());
        supplier.setCnpj(fornecedorCreateRequest.getCnpj());
        supplier.setPhone(fornecedorCreateRequest.getTelefone());
        supplier.setEmail(fornecedorCreateRequest.getEmail());
        supplier.setAddress(fornecedorCreateRequest.getEndereco());
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());

        Supplier supplierSalvo = supplierRepository.save(supplier);

        return FornecedorCreateResponse.of(supplierSalvo);
    }

    public Supplier findSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com ID: " + id));
    }

    public FornecedorCreateResponse findSupplierDTOById(Long id) {
        return FornecedorCreateResponse.of(findSupplierById(id));
    }

    public List<FornecedorCreateResponse> listarTodos() {
        return supplierRepository.findAll().stream()
                .map(FornecedorCreateResponse::of)
                .collect(Collectors.toList());
    }

    public List<FornecedorCreateResponse> buscarPorNome(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name).stream()
                .map(FornecedorCreateResponse::of)
                .collect(Collectors.toList());
    }

    @Transactional
    public FornecedorCreateResponse updateSupplier(Long id, FornecedorCreateRequest fornecedorDTO) {
        Supplier supplier = findSupplierById(id);

        if (fornecedorDTO.getCnpj() != null &&
                !fornecedorDTO.getCnpj().equals(supplier.getCnpj()) &&
                supplierRepository.existsByCnpj(fornecedorDTO.getCnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + fornecedorDTO.getCnpj());
        }

        supplier.setName(fornecedorDTO.getNome());
        supplier.setCnpj(fornecedorDTO.getCnpj());
        supplier.setPhone(fornecedorDTO.getTelefone());
        supplier.setEmail(fornecedorDTO.getEmail());
        supplier.setAddress(fornecedorDTO.getEndereco());

        return FornecedorCreateResponse.of(supplierRepository.save(supplier));
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = findSupplierById(id);

        if (!supplier.getProducts().isEmpty()) {
            throw new IllegalStateException("Não é possível excluir o fornecedor pois ele está associado a produtos");
        }

        supplierRepository.delete(supplier);
    }
}