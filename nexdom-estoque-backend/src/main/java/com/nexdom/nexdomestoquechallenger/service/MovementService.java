package com.nexdom.nexdomestoquechallenger.service;

import com.nexdom.nexdomestoquechallenger.dto.request.MovementCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.MovementResponse;
import com.nexdom.nexdomestoquechallenger.entity.Movement;
import com.nexdom.nexdomestoquechallenger.entity.Product;
import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import com.nexdom.nexdomestoquechallenger.exceptions.BusinessException;
import com.nexdom.nexdomestoquechallenger.repository.MovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovementService {

    private final MovementRepository movementRepository;
    private final ProductService productService;

    @Transactional
    public MovementResponse createMovement(MovementCreateRequest request) {
        Product product = productService.findById(request.getProductId());

        validateMovement(request, product);

        Movement movement = new Movement();
        movement.setProduct(product);
        movement.setType(request.getType());
        movement.setQuantity(request.getQuantity());
        movement.setReason(request.getReason());
        movement.setResponsibleUser(request.getResponsibleUser());
        movement.setSalePrice(determineSalePrice(request, product));
        movement.setCreatedAt(LocalDateTime.now());
        movement.setUpdatedAt(LocalDateTime.now());

        updateProductStock(product, request.getType(), request.getQuantity());

        Movement savedMovement = movementRepository.save(movement);
        return MovementResponse.of(savedMovement);
    }

    public List<MovementResponse> getMovementsByProduct(Long productId) {
        return movementRepository.findByProductId(productId).stream()
                .map(MovementResponse::of)
                .collect(Collectors.toList());
    }

    public List<MovementResponse> getAllMovements() {
        return movementRepository.findAll().stream()
                .map(MovementResponse::of)
                .collect(Collectors.toList());
    }

    private void validateMovement(MovementCreateRequest request, Product product) {
        if (request.getType() == MovementType.SAIDA &&
                product.getStockQuantity() < request.getQuantity()) {
            throw new BusinessException(
                    "Estoque insuficiente para o produto " + product.getName() +
                            ". Disponível: " + product.getStockQuantity() +
                            ", Solicitado: " + request.getQuantity()
            );
        }
    }

    private Double determineSalePrice(MovementCreateRequest request, Product product) {
        return request.getSalePrice() != null ?
                request.getSalePrice() :
                product.getSalePrice();
    }

    private void updateProductStock(Product product, MovementType type, Integer quantity) {
        int newQuantity = type == MovementType.ENTRADA ?
                product.getStockQuantity() + quantity :
                product.getStockQuantity() - quantity;

        if (type == MovementType.SAIDA &&
                product.getMinimumStock() != null &&
                newQuantity < product.getMinimumStock()) {
            System.out.println("ALERTA: Estoque do produto " + product.getName() +
                    " está abaixo do mínimo (" + product.getMinimumStock() + ")");
        }

        product.setStockQuantity(newQuantity);
        productService.updateProduct(product);
    }

    private Integer getTotalSaidas(Long productId) {
        return movementRepository.sumQuantityByProductAndType(productId, MovementType.SAIDA);
    }

    private Integer getVendas(Long productId) {
        return movementRepository.sumSoldQuantityByProduct(productId);
    }
}