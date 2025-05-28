package com.nexdom.nexdomestoquechallenger.service;

import com.nexdom.nexdomestoquechallenger.dto.request.ProductCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductCreateResponse;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductProfitResponse;
import com.nexdom.nexdomestoquechallenger.dto.response.ProductStockResponse;
import com.nexdom.nexdomestoquechallenger.entity.Category;
import com.nexdom.nexdomestoquechallenger.entity.Product;
import com.nexdom.nexdomestoquechallenger.entity.Supplier;
import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import com.nexdom.nexdomestoquechallenger.exceptions.ResourceNotFoundException;
import com.nexdom.nexdomestoquechallenger.repository.MovementRepository;
import com.nexdom.nexdomestoquechallenger.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final SupplierService supplierService;
    private final MovementRepository movementRepository;


    public ProductService(
            ProductRepository productRepository,
            CategoryService categoryService,
            SupplierService supplierService,
            MovementRepository movementRepository

    ) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.supplierService = supplierService;
        this.movementRepository = movementRepository;

    }

    @Transactional
    public ProductCreateResponse createProduct(ProductCreateRequest request) {
        try {
            if (productRepository.existsBySku(request.getSku())) {
                throw new IllegalArgumentException("SKU já cadastrado: " + request.getSku());
            }

            Product product = new Product();
            mapRequestToEntity(request, product);

            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());

            Product savedProduct = productRepository.save(product);
            return ProductCreateResponse.of(savedProduct);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar produto: " + e.getMessage(), e);
        }
    }

    public List<ProductProfitResponse> getProductsProfitByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .map(product -> {
                    Integer vendas = movementRepository.sumSoldQuantityByProduct(product.getId());
                    return ProductProfitResponse.of(product, vendas != null ? vendas : 0);
                })
                .collect(Collectors.toList());
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + id));
    }

    public ProductCreateResponse findProductResponseById(Long id) {
        return ProductCreateResponse.of(findById(id));
    }

    public List<ProductStockResponse> getProductsWithMovementsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .map(product -> {
                    Integer totalSaidas = movementRepository
                            .sumQuantityByProductAndType(product.getId(), MovementType.SAIDA);
                    return ProductStockResponse.of(product, totalSaidas != null ? totalSaidas : 0);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductCreateResponse updateProduct(Long id, ProductCreateRequest request) {
        Product product = findById(id);

        updateProductFields(product, request);
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return ProductCreateResponse.of(updatedProduct);
    }

    @Transactional
    public void disableProduct(Long id) {
        Product product = findById(id);
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    public Page<ProductCreateResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(product -> {
                    Integer totalSaidas = movementRepository.sumQuantityByProductAndType(product.getId(), MovementType.SAIDA);
                    return ProductCreateResponse.of(product, totalSaidas != null ? totalSaidas : 0);
                });
    }

    public List<ProductCreateResponse> getProductsByCategoryName(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .map(ProductCreateResponse::of)
                .collect(Collectors.toList());
    }

    private void mapRequestToEntity(ProductCreateRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setSupplierPrice(request.getSupplierPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setMinimumStock(request.getMinimumStock());
        product.setUnitOfMeasure(request.getMeasurementUnit());
        product.setActive(true);

        Category category = categoryService.getCategoryById(request.getCategoryId());
        product.setCategory(category);

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierService.findSupplierById(request.getSupplierId());
            product.setSupplier(supplier);
        }
    }

    @Transactional
    public void updateProduct(Product product) {
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    private void updateProductFields(Product product, ProductCreateRequest request) {
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getSku() != null && !request.getSku().equals(product.getSku())) {
            if (productRepository.existsBySku(request.getSku())) {
                throw new IllegalArgumentException("SKU já cadastrado: " + request.getSku());
            }
            product.setSku(request.getSku());
        }
        if (request.getSupplierPrice() != null) {
            product.setSupplierPrice(request.getSupplierPrice());
        }
        if (request.getSalePrice() != null) {
            product.setSalePrice(request.getSalePrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getMinimumStock() != null) {
            product.setMinimumStock(request.getMinimumStock());
        }
        if (request.getMeasurementUnit() != null) {
            product.setUnitOfMeasure(request.getMeasurementUnit());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(request.getCategoryId());
            product.setCategory(category);
        }
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierService.findSupplierById(request.getSupplierId());
            product.setSupplier(supplier);
        }
    }
}