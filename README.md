Ola amigos desenvolvedores, vou ser honesto, gostaria de ter tido mais tempo para fazer isso, acabdei so tendo 1 dia e meio, entao foi muita coisa na correria para caber tudo no prazo...
sinto que poderia entregar tudo com uma qualidade bem superior se eu tivesse pelo menos 3 dias haha, mas foi divertido.

# Nexdom Estoque - Desafio Técnico
![logo_navbar](https://github.com/user-attachments/assets/6e0f3b57-a1d7-4de1-a29e-66c7dbf47773)

Este repositório contém dois projetos para o desafio técnico da Nexdom:

- `nextom-estoque-backend` - Aplicação Spring Boot (backend)
- `nextom-estoque-frontend` - Aplicação React (frontend)

---

## Backend (Spring Boot)

vc pode conferir a documentacao da api no arquivo swagger dentro da pasta do backend

## Mínimo Esperado da Aplicação (Lista de Verificação)

- [x] CRUD - (Create, Read, Update, Delete) de produtos;
- [x] Efetuar entrada de produtos no estoque;
- [x] Efetuar saída de produtos no estoque;
- [x] Validação de saldo ao efetuar uma saída do produto:
    - [x] Retornar mensagem específica caso não haja quantidade suficiente.
- [x] Consulta de produtos por tipo, com:
    - [x] Quantidade de saída;
    - [x] Quantidade disponível.
- [x] Consulta de lucro por produto, exibindo:
    - [x] Quantidade total de saída;
    - [x] Total do lucro (valor de venda – valor do fornecedor).

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

![image](https://github.com/user-attachments/assets/caf48ab2-b88a-46e6-b743-f7738fa780dd)

![image](https://github.com/user-attachments/assets/07fd2a7b-95c8-44f1-9f76-5fbd9da7e327)

![image](https://github.com/user-attachments/assets/139befe8-1d44-4791-b0e5-bb841efd78d0)

![image](https://github.com/user-attachments/assets/52174f7f-6d9d-4cb6-b984-c7337d89f237)

