package com.nexdom.nexdomestoquechallenger.service;

import com.nexdom.nexdomestoquechallenger.dto.request.CategoriaCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.CategoryCreateResponse;
import com.nexdom.nexdomestoquechallenger.entity.Category;
import com.nexdom.nexdomestoquechallenger.exceptions.ResourceNotFoundException;
import com.nexdom.nexdomestoquechallenger.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public CategoryCreateResponse createCategoryService(CategoriaCreateRequest categoriaCreateRequest) {
        if (categoryRepository.existsByName(categoriaCreateRequest.getName())) {
            throw new IllegalArgumentException("Já existe uma categoria com o nome: " + categoriaCreateRequest.getName());
        }

        Category category = new Category();
        category.setName(categoriaCreateRequest.getName());
        category.setDescription(categoriaCreateRequest.getDescription());

        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());

        Category categorySalva = categoryRepository.save(category);
        return CategoryCreateResponse.of(categorySalva);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID: " + id));
    }

    public CategoryCreateResponse searchCategoryById(Long id) {
        Category category = getCategoryById(id);
        return CategoryCreateResponse.of(category);
    }

    public List<CategoryCreateResponse> listarTodas() {
        return categoryRepository.findAll().stream()
                .map(CategoryCreateResponse::of)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryCreateResponse atualizarCategoria(Long id, CategoriaCreateRequest categoriaCreateRequest) {
        Category category = getCategoryById(id);

        if (categoryRepository.existsByName(categoriaCreateRequest.getName()) &&
                !category.getName().equals(categoriaCreateRequest.getName())) {
            throw new IllegalArgumentException("Já existe outra categoria com o nome: " + categoriaCreateRequest.getName());
        }

        category.setName(categoriaCreateRequest.getName());
        category.setDescription(categoriaCreateRequest.getDescription());

        return CategoryCreateResponse.of(categoryRepository.save(category));
    }

    @Transactional
    public void excluirCategoria(Long id) {
        Category category = getCategoryById(id);

        if (!category.getProducts().isEmpty()) {
            throw new IllegalStateException("Não é possível excluir a categoria pois ela está associada a produtos");
        }

        categoryRepository.delete(category);
    }
}