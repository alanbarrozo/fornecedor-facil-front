// ======================================================
// CONFIGURAÇÕES
// ======================================================

const API_BASE_URL = "http://127.0.0.1:5000";


// ======================================================
// ELEMENTOS DA TELA
// ======================================================

const inputCnpj = document.querySelector("#cnpj");
const btnConsultar = document.querySelector("#btnConsultar");

const mensagem = document.querySelector("#mensagem");
const resultado = document.querySelector("#resultado");

const modalEditar =
    document.querySelector("#modalEditar");

const formEditarFornecedor =
    document.querySelector("#formEditarFornecedor");

const categoriaEdicao =
    document.querySelector("#categoriaEdicao");

const observacaoEdicao =
    document.querySelector("#observacaoEdicao");

const empresaEdicao =
    document.querySelector("#empresaEdicao");

const btnFecharModal =
    document.querySelector("#btnFecharModal");

const btnCancelarEdicao =
    document.querySelector("#btnCancelarEdicao");

const modalExcluir =
    document.querySelector("#modalExcluir");

const empresaExclusao =
    document.querySelector("#empresaExclusao");

const btnCancelarExclusao =
    document.querySelector("#btnCancelarExclusao");

const btnConfirmarExclusao =
    document.querySelector("#btnConfirmarExclusao");

const filtroUf =
    document.querySelector("#filtroUf");

const filtroCategoria =
    document.querySelector("#filtroCategoria");

const btnFiltrar =
    document.querySelector("#btnFiltrar");

const btnLimparFiltros =
    document.querySelector("#btnLimparFiltros");

let fornecedorEmExclusaoId = null;

let fornecedorEmEdicaoId = null;

// Guarda temporariamente os dados vindos da BrasilAPI
let fornecedorConsultado = null;


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function normalizarCnpj(cnpj) {
    return cnpj.replace(/\D/g, "");
}


function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

function mostrarPopup(texto, tipo = "sucesso") {

    const popupAnterior =
        document.querySelector(".popup-feedback");

    if (popupAnterior) {
        popupAnterior.remove();
    }

    const popup = document.createElement("div");

    popup.className =
        `popup-feedback ${tipo}`;

    popup.textContent = texto;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("mostrar");
    }, 10);

    setTimeout(() => {

        popup.classList.remove("mostrar");

        setTimeout(() => {
            popup.remove();
        }, 300);

    }, 3000);
}


function limparResultado() {

    fornecedorConsultado = null;

    resultado.innerHTML = "";
    resultado.classList.add("hidden");
}


// ======================================================
// EXIBIR RESULTADO DA BRASILAPI
// ======================================================

function exibirFornecedor(dados) {

    fornecedorConsultado = dados;

    resultado.innerHTML = `
        <h2>
            ${dados.nome_fantasia || dados.razao_social}
        </h2>

        <p>
            <strong>Razão social:</strong>
            ${dados.razao_social || "-"}
        </p>

        <p>
            <strong>CNPJ:</strong>
            ${dados.cnpj || "-"}
        </p>

        <p>
            <strong>Situação:</strong>
            ${dados.descricao_situacao_cadastral || "-"}
        </p>

        <p>
            <strong>Município:</strong>
            ${dados.municipio || "-"}
        </p>

        <p>
            <strong>UF:</strong>
            ${dados.uf || "-"}
        </p>

        <p>
            <strong>CEP:</strong>
            ${dados.cep || "-"}
        </p>

        <p>
            <strong>Telefone:</strong>
            ${dados.ddd_telefone_1 || "-"}
        </p>

        <hr>

        <div class="dados-locais">

            <label for="categoria">
                Categoria
            </label>

            <input
                id="categoria"
                type="text"
                placeholder="Ex.: Tecnologia, Alimentação..."
            >

            <label for="observacao">
                Observação
            </label>

            <textarea
                id="observacao"
                rows="4"
                placeholder="Anotações sobre este fornecedor"
            ></textarea>

            <button id="btnSalvar">
                Salvar fornecedor
            </button>

        </div>
    `;

    resultado.classList.remove("hidden");

    document
        .querySelector("#btnSalvar")
        .addEventListener(
            "click",
            salvarFornecedor
        );
}


// ======================================================
// CONSULTAR BRASILAPI
// ======================================================

async function consultarCnpj() {

    limparResultado();
    mostrarMensagem("");

    const cnpj = normalizarCnpj(
        inputCnpj.value
    );

    if (cnpj.length !== 14) {

        mostrarMensagem(
            "Digite um CNPJ com 14 dígitos.",
            "erro"
        );

        return;
    }

    const url =
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    btnConsultar.disabled = true;
    btnConsultar.textContent = "Consultando...";

    mostrarMensagem(
        "Buscando empresa..."
    );

    try {

        const resposta = await fetch(url);

        if (resposta.status === 404) {

            throw new Error(
                "CNPJ não encontrado."
            );
        }

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível consultar o CNPJ."
            );
        }

        const dados =
            await resposta.json();

        mostrarMensagem(
            "Empresa encontrada.",
            "sucesso"
        );

        exibirFornecedor(dados);

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            erro.message ||
            "Erro ao consultar a BrasilAPI.",
            "erro"
        );

    } finally {

        btnConsultar.disabled = false;
        btnConsultar.textContent = "Consultar";
    }
}


// ======================================================
// SALVAR NA NOSSA API FLASK
// ======================================================

async function salvarFornecedor() {

    if (!fornecedorConsultado) {

        mostrarMensagem(
            "Consulte uma empresa antes de salvar.",
            "erro"
        );

        return;
    }

    const categoria =
        document
            .querySelector("#categoria")
            .value
            .trim();

    const observacao =
        document
            .querySelector("#observacao")
            .value
            .trim();

    const payload = {

        cnpj:
            normalizarCnpj(
                fornecedorConsultado.cnpj
            ),

        razao_social:
            fornecedorConsultado.razao_social,

        nome_fantasia:
            fornecedorConsultado.nome_fantasia,

        situacao:
            fornecedorConsultado
                .descricao_situacao_cadastral,

        municipio:
            fornecedorConsultado.municipio,

        uf:
            fornecedorConsultado.uf,

        cep:
            fornecedorConsultado.cep,

        telefone1:
            fornecedorConsultado.ddd_telefone_1,

        categoria:
            categoria,

        observacao:
            observacao
    };


    const btnSalvar =
        document.querySelector("#btnSalvar");

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";


    try {

        const resposta = await fetch(
            `${API_BASE_URL}/fornecedores`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)
            }
        );


        const dadosResposta =
            await resposta.json()
                .catch(() => ({}));


        if (resposta.status === 409) {

            mostrarPopup(
                "Este fornecedor já está cadastrado.",
                "erro"
            );

            throw new Error(
                dadosResposta.erro ||
                "Fornecedor já cadastrado."
            );
        }


        if (!resposta.ok) {

            throw new Error(
                dadosResposta.erro ||
                "Erro ao salvar fornecedor."
            );
        }


        mostrarMensagem(
            `Fornecedor salvo com sucesso! ID ${dadosResposta.id}`,
            "sucesso"
        );

        mostrarPopup(
            `Fornecedor cadastrado com sucesso! ID ${dadosResposta.id}`,
            "sucesso"
        );

        carregarFornecedores();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            erro.message ||
            "Erro ao salvar fornecedor.",
            "erro"
        );

    } finally {

        btnSalvar.disabled = false;
        btnSalvar.textContent =
            "Salvar fornecedor";
    }
}

// ======================================================
// LISTAR FORNECEDORES SALVOS
// ======================================================

async function carregarFornecedores() {

    const lista =
        document.querySelector("#listaFornecedores");

    lista.innerHTML =
        "<p>Carregando fornecedores...</p>";


    const uf =
        filtroUf.value
            .trim()
            .toUpperCase();

    const categoria =
        filtroCategoria.value
            .trim();


    const parametros =
        new URLSearchParams();


    if (uf) {
        parametros.append("uf", uf);
    }


    if (categoria) {
        parametros.append(
            "categoria",
            categoria
        );
    }


    let url =
        `${API_BASE_URL}/fornecedores`;


    if (parametros.toString()) {

        url +=
            `?${parametros.toString()}`;
    }


    try {

        const resposta =
            await fetch(url);


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os fornecedores."
            );
        }


        const fornecedores =
            await resposta.json();


        exibirFornecedoresSalvos(
            fornecedores
        );


    } catch (erro) {

        console.error(erro);

        lista.innerHTML = `
            <p class="erro">
                ${erro.message}
            </p>
        `;
    }
}

function exibirFornecedoresSalvos(fornecedores) {

    const lista =
        document.querySelector("#listaFornecedores");

    if (fornecedores.length === 0) {

    const possuiFiltro =
        filtroUf.value.trim() ||
        filtroCategoria.value.trim();

    const mensagemVazia =
        possuiFiltro
            ? "Nenhum fornecedor encontrado para os filtros informados."
            : "Nenhum fornecedor cadastrado ainda.";

    lista.innerHTML = `
        <div class="estado-vazio">
            <p>
                ${mensagemVazia}
            </p>
        </div>
    `;

    return;
}

    lista.innerHTML = "";

    fornecedores.forEach(
        (fornecedor) => {

            const card =
                document.createElement("article");

            card.className =
                "card-fornecedor";

            card.innerHTML = `
                <div class="card-cabecalho">

                    <div>
                        <h3>
                            ${
                                fornecedor.nome_fantasia
                                ||
                                fornecedor.razao_social
                            }
                        </h3>

                        <p class="razao-social">
                            ${fornecedor.razao_social}
                        </p>
                    </div>

                    <span class="situacao">
                        ${fornecedor.situacao || "-"}
                    </span>

                </div>

                <div class="card-dados">

                    <p>
                        <strong>CNPJ:</strong>
                        ${fornecedor.cnpj}
                    </p>

                    <p>
                        <strong>Local:</strong>
                        ${fornecedor.municipio || "-"}
                        /
                        ${fornecedor.uf || "-"}
                    </p>

                    <p>
                        <strong>Telefone:</strong>
                        ${fornecedor.telefone1 || "-"}
                    </p>

                    <p>
                        <strong>Categoria:</strong>
                        ${fornecedor.categoria || "Sem categoria"}
                    </p>

                    <p>
                        <strong>Observação:</strong>
                        ${fornecedor.observacao || "-"}
                    </p>

                </div>

                <div class="card-acoes">

                    <button
                        class="btn-editar"
                        data-acao="editar"
                        data-id="${fornecedor.id}"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        data-acao="excluir"
                        data-id="${fornecedor.id}"
                    >
                        Excluir
                    </button>

                </div>

            `;

            lista.appendChild(card);
        }
    );
}

async function abrirEdicao(fornecedorId) {

    try {

        const resposta = await fetch(
            `${API_BASE_URL}/fornecedores/${fornecedorId}`
        );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o fornecedor."
            );
        }

        const fornecedor =
            await resposta.json();

        fornecedorEmEdicaoId =
            fornecedor.id;

        empresaEdicao.textContent =
            fornecedor.nome_fantasia
            ||
            fornecedor.razao_social;

        categoriaEdicao.value =
            fornecedor.categoria || "";

        observacaoEdicao.value =
            fornecedor.observacao || "";

        modalEditar.classList.remove(
            "hidden"
        );

    } catch (erro) {

        console.error(erro);

        mostrarPopup(
            erro.message,
            "erro"
        );
    }
}

async function excluirFornecedor(fornecedorId) {

    fornecedorEmExclusaoId = fornecedorId;

    try {

        const resposta = await fetch(
            `${API_BASE_URL}/fornecedores/${fornecedorId}`
        );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o fornecedor."
            );
        }

        const fornecedor =
            await resposta.json();

        empresaExclusao.textContent =
            fornecedor.nome_fantasia
            ||
            fornecedor.razao_social;

        modalExcluir.classList.remove("hidden");

    } catch (erro) {

        console.error(erro);

        mostrarPopup(
            erro.message,
            "erro"
        );
    }
}

async function confirmarExclusao() {

    if (!fornecedorEmExclusaoId) {
        return;
    }

    btnConfirmarExclusao.disabled = true;
    btnConfirmarExclusao.textContent = "Excluindo...";

    try {

        const resposta = await fetch(
            `${API_BASE_URL}/fornecedores/${fornecedorEmExclusaoId}`,
            {
                method: "DELETE"
            }
        );

        if (resposta.status === 404) {

            const dados =
                await resposta.json()
                    .catch(() => ({}));

            throw new Error(
                dados.erro ||
                "Fornecedor não encontrado."
            );
        }

        if (!resposta.ok) {

            throw new Error(
                "Erro ao excluir fornecedor."
            );
        }

        fecharModalExclusao();

        mostrarPopup(
            "Fornecedor excluído com sucesso!",
            "sucesso"
        );

        await carregarFornecedores();

    } catch (erro) {

        console.error(erro);

        mostrarPopup(
            erro.message ||
            "Erro ao excluir fornecedor.",
            "erro"
        );

    } finally {

        btnConfirmarExclusao.disabled = false;
        btnConfirmarExclusao.textContent =
            "Excluir fornecedor";
    }
}

function fecharModalExclusao() {

    modalExcluir.classList.add("hidden");

    fornecedorEmExclusaoId = null;

    empresaExclusao.textContent = "";
}

function fecharModalEdicao() {

    modalEditar.classList.add(
        "hidden"
    );

    fornecedorEmEdicaoId = null;

    formEditarFornecedor.reset();
}

async function salvarEdicao(event) {

    event.preventDefault();

    if (!fornecedorEmEdicaoId) {
        return;
    }

    const payload = {

        categoria:
            categoriaEdicao.value.trim(),

        observacao:
            observacaoEdicao.value.trim()
    };


    const btnSalvar =
        formEditarFornecedor.querySelector(
            'button[type="submit"]'
        );

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";


    try {

        const resposta = await fetch(
            `${API_BASE_URL}/fornecedores/${fornecedorEmEdicaoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)
            }
        );


        const dados =
            await resposta.json()
                .catch(() => ({}));


        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                "Erro ao atualizar fornecedor."
            );
        }


        mostrarPopup(
            "Fornecedor atualizado com sucesso!",
            "sucesso"
        );


        fecharModalEdicao();

        await carregarFornecedores();


    } catch (erro) {

        console.error(erro);

        mostrarPopup(
            erro.message ||
            "Erro ao atualizar fornecedor.",
            "erro"
        );

    } finally {

        btnSalvar.disabled = false;
        btnSalvar.textContent =
            "Salvar alterações";
    }
}

function limparFiltros() {

    filtroUf.value = "";
    filtroCategoria.value = "";

    carregarFornecedores();
}
// ======================================================
// EVENTOS
// ======================================================

btnConsultar.addEventListener(
    "click",
    consultarCnpj
);


inputCnpj.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            consultarCnpj();
        }

    }
);

const btnAtualizarLista =
    document.querySelector("#btnAtualizarLista");


btnAtualizarLista.addEventListener(
    "click",
    carregarFornecedores
);

carregarFornecedores();

const listaFornecedores =
    document.querySelector("#listaFornecedores");


listaFornecedores.addEventListener(
    "click",
    (event) => {

        const botao =
            event.target.closest(
                "button[data-acao]"
            );

        if (!botao) {
            return;
        }

        const fornecedorId =
            botao.dataset.id;

        const acao =
            botao.dataset.acao;


        if (acao === "editar") {

            abrirEdicao(
                fornecedorId
            );
        }


        if (acao === "excluir") {

            excluirFornecedor(
                fornecedorId
            );
        }
    }
);

formEditarFornecedor.addEventListener(
    "submit",
    salvarEdicao
);


btnFecharModal.addEventListener(
    "click",
    fecharModalEdicao
);


btnCancelarEdicao.addEventListener(
    "click",
    fecharModalEdicao
);

btnCancelarExclusao.addEventListener(
    "click",
    fecharModalExclusao
);

btnConfirmarExclusao.addEventListener(
    "click",
    confirmarExclusao
);

btnFiltrar.addEventListener(
    "click",
    carregarFornecedores
);


btnLimparFiltros.addEventListener(
    "click",
    limparFiltros
);

filtroUf.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            carregarFornecedores();
        }
    }
);


filtroCategoria.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            carregarFornecedores();
        }
    }
);