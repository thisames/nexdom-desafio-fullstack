# Nexdom Estoque - Desafio Técnico

Este repositório contém dois projetos para o desafio técnico da Nexdom:

- `nextom-estoque-backend` - Aplicação Spring Boot (backend)
- `nextom-estoque-frontend` - Aplicação React (frontend)

---

## Backend (Spring Boot)

vc pode conferir a documentacao da api no arquivo swagger dentro da pasta do backend

### Pré-requisitos

- Java 17  
- Docker e Docker Compose  
- Maven  

### Configuração e Execução

#### Banco de dados (PostgreSQL)

Suba o container do banco de dados com Docker Compose:

```bash
docker-compose up -d

Isso irá subir um container PostgreSQL com as configurações padrão.

## Configuração do `application.properties`

Verifique/atualize as configurações de conexão com o banco no arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/estoque_db
spring.datasource.username=postgres
spring.datasource.password=postgres

## Rodar a aplicação

```bash
mvn spring-boot:run
```
A API estará disponível em: http://localhost:8080


## React

### Pré-requisitos

- node LTS  

## Rodar a aplicação

```bash
npm install
```
```bash
npm start
```
A API estará disponível em: http://localhost:3000


