package com.nexdom.nexdomestoquechallenger.repository;

import com.nexdom.nexdomestoquechallenger.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    List<Product> findByCategoryName(String categoryName);
}