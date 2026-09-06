# Fornecedor Fácil — Front-End

Interface web do projeto **Fornecedor Fácil**, desenvolvida com HTML, CSS e JavaScript puro.

O Front-End permite consultar dados de empresas pelo CNPJ, cadastrar fornecedores na API própria, listar, editar, excluir e filtrar fornecedores armazenados no sistema.

Este repositório corresponde ao componente de Front-End da solução.

---

## Funcionalidades

A interface permite:

- consultar empresas pelo CNPJ usando a BrasilAPI;
- exibir dados cadastrais retornados pela API externa;
- cadastrar fornecedores na API própria;
- listar fornecedores cadastrados;
- editar categoria e observação;
- excluir fornecedores com confirmação;
- filtrar fornecedores por UF e categoria;
- atualizar a lista de fornecedores;
- exibir mensagens de sucesso e erro por meio de pop-ups;
- utilizar a aplicação em telas menores com layout responsivo.

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Fetch API
- REST
- JSON
- Nginx
- Docker

---

## Estrutura do projeto

```text
fornecedor-facil-front/
│
├── index.html
├── style.css
├── script.js
├── Dockerfile
├── .dockerignore
└── README.md
```

### Principais arquivos

**index.html**

Contém a estrutura da interface da aplicação, incluindo:

- consulta de CNPJ;
- área de resultado;
- filtros;
- lista de fornecedores;
- modal de edição;
- modal de exclusão.

**style.css**

Responsável pela aparência da aplicação, incluindo:

- layout;
- cards;
- botões;
- formulários;
- pop-ups;
- modais;
- responsividade.

**script.js**

Contém a lógica do Front-End, incluindo:

- integração com a BrasilAPI;
- comunicação com a API Flask;
- cadastro, listagem, edição e exclusão;
- filtros;
- tratamento de erros;
- atualização dinâmica da interface.

---

## Integração com a BrasilAPI

A consulta cadastral de empresas é realizada diretamente pelo navegador utilizando a BrasilAPI.

Endpoint utilizado:

```text
https://brasilapi.com.br/api/cnpj/v1/{cnpj}
```

Exemplo:

```text
https://brasilapi.com.br/api/cnpj/v1/19131243000197
```

A BrasilAPI retorna dados como:

- CNPJ;
- razão social;
- nome fantasia;
- situação cadastral;
- município;
- UF;
- CEP;
- telefone.

### Regra importante

Consultar uma empresa na BrasilAPI **não salva automaticamente** o fornecedor na base local.

O cadastro somente ocorre quando o usuário clica em **Salvar fornecedor**.

---

## Integração com a API própria

O Front-End se comunica com a API Flask por meio de requisições REST utilizando JSON.

Por padrão:

```javascript
const API_BASE_URL = "http://127.0.0.1:5000";
```

Principais operações utilizadas:

```text
GET    /fornecedores
GET    /fornecedores/<id>
POST   /fornecedores
PUT    /fornecedores/<id>
DELETE /fornecedores/<id>
```

---

## Fluxo da aplicação

### Consulta de empresa

```text
Usuário
   ↓
informa CNPJ
   ↓
Front-End
   ↓
BrasilAPI
   ↓
dados cadastrais
   ↓
Front-End
```

### Cadastro de fornecedor

```text
Usuário
   ↓
Salvar fornecedor
   ↓
Front-End
   ↓
POST /fornecedores
   ↓
API Flask
   ↓
SQLite
```

### Listagem e filtros

```text
Front-End
   ↓
GET /fornecedores
   ↓
API Flask
   ↓
SQLite
   ↓
JSON
   ↓
cards na interface
```

Os filtros podem ser enviados como parâmetros de consulta:

```text
GET /fornecedores?uf=GO
```

```text
GET /fornecedores?categoria=Tecnologia
```

```text
GET /fornecedores?uf=GO&categoria=Tecnologia
```

---

## Executando localmente

Como o Front-End é composto apenas por arquivos estáticos, ele pode ser servido por um servidor HTTP simples.

Na raiz do projeto:

```powershell
py -m http.server 5500
```

Depois acesse:

```text
http://127.0.0.1:5500
```

A API Flask deve estar disponível em:

```text
http://127.0.0.1:5000
```

---

## Executando com Docker

### Construir a imagem

Na raiz do repositório:

```powershell
docker build -t fornecedor-facil-front .
```

### Executar o container

```powershell
docker run --name fornecedor-facil-front -p 8080:80 fornecedor-facil-front
```

A interface ficará disponível em:

```text
http://127.0.0.1:8080
```

O container utiliza Nginx para servir os arquivos estáticos da aplicação.

---

## Docker Compose

A solução completa pode ser executada pelo arquivo `docker-compose.yml`, localizado no diretório que contém os repositórios do Front-End e da API.

Na pasta correspondente, execute:

```powershell
docker compose up --build
```

A aplicação ficará disponível em:

```text
Front-End:
http://127.0.0.1:8080

API:
http://127.0.0.1:5000

Swagger:
http://127.0.0.1:5000/apidocs/
```

Para encerrar:

```powershell
docker compose down
```

---

## Comunicação entre os componentes

A arquitetura da solução funciona da seguinte forma:

```text
                    BrasilAPI
                       ↑
                       │ HTTPS
                       │
                    Browser
                   ↙       ↘
                  ↓         ↓
        Front Container    API Container
            Nginx             Flask
                                 ↓
                               SQLite
                                 ↓
                           Docker Volume
```

O container do Front-End apenas entrega `index.html`, `style.css` e `script.js` ao navegador.

O JavaScript é executado no navegador do usuário.

Por isso:

- o navegador consulta diretamente a BrasilAPI;
- o navegador envia requisições REST para a API Flask;
- somente a API Flask acessa o banco SQLite.

---

## Recursos de interface

A aplicação possui:

- cards para exibição dos fornecedores;
- modal de edição;
- modal de confirmação de exclusão;
- pop-ups de sucesso e erro;
- filtros por UF e categoria;
- mensagens diferentes para banco vazio e filtros sem resultado;
- layout responsivo para telas menores.

---

## Projeto

Projeto desenvolvido como MVP da disciplina de Back-End Avançado.

O **Fornecedor Fácil** tem como objetivo facilitar a consulta e a organização de fornecedores por meio de uma aplicação web simples, integrada a uma API própria e a uma API externa.
