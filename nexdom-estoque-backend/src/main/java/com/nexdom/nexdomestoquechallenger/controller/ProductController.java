package com.nexdom.nexdomestoquechallenger.controller;

import com.nexdom.nexdomestoquechallenger.dto.request.ProductCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductCreateResponse;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductProfitResponse;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductStockResponse;
import com.nexdom.nexdomestoquechallenger.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductCreateResponse> createProduct(@RequestBody ProductCreateRequest request) {
        ProductCreateResponse response = productService.createProduct(request);
        return ResponseEntity.created(
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(response.getId())
                        .toUri()
        ).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCreateResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findProductResponseById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductCreateResponse>> getAllProducts(
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC, page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/categoria/{categoryName}")
    public ResponseEntity<List<ProductCreateResponse>> getProductsByCategory(@PathVariable String categoryName) {
        return ResponseEntity.ok(productService.getProductsByCategoryName(categoryName));
    }

    @GetMapping("/categoria/{categoryName}/estoque")
    public ResponseEntity<List<ProductStockResponse>> getProductsStockByCategory(
            @PathVariable String categoryName) {
        return ResponseEntity.ok(productService.getProductsWithMovementsByCategory(categoryName));
    }

    @GetMapping("/categoria/{categoryName}/lucro")
    public ResponseEntity<List<ProductProfitResponse>> getProductsProfitByCategory(
            @PathVariable String categoryName) {
        return ResponseEntity.ok(productService.getProductsProfitByCategory(categoryName));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCreateResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductCreateRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> disableProduct(@PathVariable Long id) {
        productService.disableProduct(id);
        return ResponseEntity.noContent().build();
    }
}