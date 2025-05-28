package com.nexdom.nexdomestoquechallenger.controller;

import com.nexdom.nexdomestoquechallenger.dto.request.CategoriaCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.CategoryCreateResponse;
import com.nexdom.nexdomestoquechallenger.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/")
    public ResponseEntity<CategoryCreateResponse> createCategoria(@RequestBody CategoriaCreateRequest categoriaCreateRequest) {
        CategoryCreateResponse categoriaSalva = categoryService.createCategoryService(categoriaCreateRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(categoriaSalva.getId())
                .toUri();

        return ResponseEntity.created(location).body(categoriaSalva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryCreateResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.searchCategoryById(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoryCreateResponse>> listarTodas() {
        return ResponseEntity.ok(categoryService.listarTodas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryCreateResponse> atualizarCategoria(
            @PathVariable Long id,
            @RequestBody CategoriaCreateRequest categoriaDTO) {
        return ResponseEntity.ok(categoryService.atualizarCategoria(id, categoriaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCategoria(@PathVariable Long id) {
        categoryService.excluirCategoria(id);
        return ResponseEntity.noContent().build();
    }
}