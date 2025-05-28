package com.nexdom.nexdomestoquechallenger.controller;

import com.nexdom.nexdomestoquechallenger.dto.request.MovementCreateRequest;
import com.nexdom.nexdomestoquechallenger.dto.response.MovementResponse;
import com.nexdom.nexdomestoquechallenger.service.MovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovementController {

    private final MovementService movementService;

    @PostMapping()
    public ResponseEntity<MovementResponse> createMovement(@RequestBody MovementCreateRequest request) {
        MovementResponse response = movementService.createMovement(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/produto/{productId}")
    public ResponseEntity<List<MovementResponse>> getMovementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(movementService.getMovementsByProduct(productId));
    }

    @GetMapping
    public ResponseEntity<List<MovementResponse>> getAllMovements() {
        return ResponseEntity.ok(movementService.getAllMovements());
    }
}