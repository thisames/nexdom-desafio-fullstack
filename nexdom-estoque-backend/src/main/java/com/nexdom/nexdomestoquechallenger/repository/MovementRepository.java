package com.nexdom.nexdomestoquechallenger.repository;

import com.nexdom.nexdomestoquechallenger.entity.Movement;
import com.nexdom.nexdomestoquechallenger.enums.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {
    List<Movement> findByProductId(Long productId);

    @Query("SELECT COALESCE(SUM(m.quantity), 0) FROM Movement m " +
            "WHERE m.product.id = :productId " +
            "AND m.type = 'SAIDA' " +
            "AND m.reason = 'VENDA'")
    Integer sumSoldQuantityByProduct(@Param("productId") Long productId);

    @Query("SELECT COALESCE(SUM(m.quantity), 0) FROM Movement m WHERE m.product.id = :productId AND m.type = :type")
    Integer sumQuantityByProductAndType(@Param("productId") Long productId, @Param("type") MovementType type);

    @Query("SELECT m.product.id, SUM(m.quantity) FROM Movement m " +
            "WHERE m.product.id IN :productIds AND m.type = :type " +
            "GROUP BY m.product.id")
    List<Object[]> sumQuantityByProductAndTypeIn(@Param("productIds") List<Long> productIds,
                                                 @Param("type") MovementType type);
}