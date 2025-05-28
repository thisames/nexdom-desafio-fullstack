package com.nexdom.nexdomestoquechallenger.repository;

import com.nexdom.nexdomestoquechallenger.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByCnpj(String cnpj);

    Optional<Supplier> findByCnpj(String cnpj);

    List<Supplier> findByNameContainingIgnoreCase(String name);
}