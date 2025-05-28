package com.nexdom.nexdomestoquechallenger.enums;

public enum MovementType {
    ENTRADA("ENTRADA"),
    SAIDA("SAIDA");

    private final String databaseValue;

    MovementType(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}