/* =========================================================
   WELL FITNESS - SCRIPT PRINCIPAL
========================================================= */

"use strict";

/* =========================================================
   DADOS
========================================================= */

let perfil = JSON.parse(localStorage.getItem("perfil")) || {};
let meta = JSON.parse(localStorage.getItem("meta")) || {};
let treinos = JSON.parse(localStorage.getItem("treinos")) || [];
let medidas = JSON.parse(localStorage.getItem("medidas")) || [];
let treinosRealizados =
    JSON.parse(localStorage.getItem("treinosRealizados")) || [];

let treinoAtivo = false;
let intervaloCronometro = null;
let segundosTreino = 0;
let inicioTreino = null;

let graficoPeso = null;
let graficoCintura = null;


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function elemento(id) {
    return document.getElementById(id);
}

function obterDataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {

    if (!data) return "-";

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarTempo(segundos) {

    const horas = Math.floor(segundos / 3600);

    const minutos =
        Math.floor((segundos % 3600) / 60);

    const segundosRestantes =
        segundos % 60;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
}

function calcularIdade(dataNascimento) {

    if (!dataNascimento) {
        return "";
    }

    const nascimento =
        new Date(dataNascimento + "T00:00:00");

    const hoje = new Date();

    let idade =
        hoje.getFullYear() -
        nascimento.getFullYear();

    const mes =
        hoje.getMonth() -
        nascimento.getMonth();

    if (
        mes < 0 ||
        (
            mes === 0 &&
            hoje.getDate() < nascimento.getDate()
        )
    ) {
        idade--;
    }

    return idade >= 0 ? idade : "";
}


/* =========================================================
   TEMA
========================================================= */

function trocarTema() {

    document.body.classList.toggle("light");

    const temaClaro =
        document.body.classList.contains("light");

    localStorage.setItem(
        "tema",
        temaClaro ? "light" : "dark"
    );

    const botao = elemento("temaBtn");

    if (botao) {

        botao.innerHTML =
            temaClaro
                ? "☀️ Tema"
                : "🌙 Tema";
    }
}

function carregarTema() {

    const tema =
        localStorage.getItem("tema");

    if (tema === "light") {

        document.body.classList.add("light");

        const botao =
            elemento("temaBtn");

        if (botao) {
            botao.innerHTML = "☀️ Tema";
        }
    }
}


/* =========================================================
   PERFIL
========================================================= */

function salvarPerfil() {

    const nome =
        elemento("nomeUsuario").value.trim();

    const nascimento =
        elemento("nascimento").value;

    const peso =
        parseFloat(elemento("pesoAtual").value);

    const altura =
        parseFloat(elemento("alturaAtual").value);

    const objetivo =
        elemento("objetivoUsuario").value;


    if (!nome) {
        alert("Digite seu nome.");
        return;
    }

    if (!nascimento) {
        alert("Informe sua data de nascimento.");
        return;
    }

    if (!peso || peso <= 0) {
        alert("Informe um peso válido.");
        return;
    }

    if (!altura || altura <= 0) {
        alert("Informe uma altura válida.");
        return;
    }


    perfil = {

        nome: nome,

        nascimento: nascimento,

        idade: calcularIdade(nascimento),

        peso: peso,

        altura: altura,

        objetivo: objetivo
    };


    localStorage.setItem(
        "perfil",
        JSON.stringify(perfil)
    );


    atualizarPerfilTela();

    atualizarDashboard();


    alert("Perfil salvo com sucesso!");
}


function carregarPerfil() {

    if (!perfil || !perfil.nome) {
        return;
    }


    if (elemento("nomeUsuario")) {
        elemento("nomeUsuario").value =
            perfil.nome;
    }


    if (elemento("nascimento")) {
        elemento("nascimento").value =
            perfil.nascimento || "";
    }


    if (elemento("idade")) {
        elemento("idade").value =
            calcularIdade(perfil.nascimento);
    }


    if (elemento("pesoAtual")) {
        elemento("pesoAtual").value =
            perfil.peso || "";
    }


    if (elemento("alturaAtual")) {
        elemento("alturaAtual").value =
            perfil.altura || "";
    }


    if (elemento("objetivoUsuario")) {
        elemento("objetivoUsuario").value =
            perfil.objetivo || "Hipertrofia";
    }


    atualizarPerfilTela();
}


function atualizarPerfilTela() {

    const idade =
        perfil.nascimento
            ? calcularIdade(perfil.nascimento)
            : perfil.idade;


    if (elemento("idade")) {

        elemento("idade").value =
            idade || "";
    }


    if (elemento("tituloUsuario")) {

        elemento("tituloUsuario").textContent =
            perfil.nome
                ? `Olá, ${perfil.nome}!`
                : "Olá!";
    }


    if (elemento("perfilInfo")) {

        if (perfil.nome) {

            elemento("perfilInfo").innerHTML = `

                <div class="alert alert-success">

                    <strong>
                        ${perfil.nome}
                    </strong>

                    <br>

                    Idade:
                    ${idade || "-"} anos

                    <br>

                    Peso:
                    ${perfil.peso || "-"} kg

                    <br>

                    Altura:
                    ${perfil.altura || "-"} m

                    <br>

                    Objetivo:
                    ${perfil.objetivo || "-"}

                </div>

            `;

        } else {

            elemento("perfilInfo").innerHTML = "";
        }
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

    const peso =
        parseFloat(perfil.peso);

    const altura =
        parseFloat(perfil.altura);


    if (elemento("dashPeso")) {

        elemento("dashPeso").textContent =
            peso > 0
                ? `${peso.toFixed(1)} kg`
                : "--";
    }


    if (elemento("dashIMC")) {

        if (peso > 0 && altura > 0) {

            const imc =
                peso / (altura * altura);

            elemento("dashIMC").textContent =
                imc.toFixed(1);

        } else {

            elemento("dashIMC").textContent =
                "--";
        }
    }


    if (elemento("dashAgua")) {

        elemento("dashAgua").textContent =
            peso > 0
                ? `${(peso * 35 / 1000).toFixed(2)} L`
                : "--";
    }


    if (elemento("dashProteina")) {

        elemento("dashProteina").textContent =
            peso > 0
                ? `${(peso * 2).toFixed(0)} g`
                : "--";
    }
}


/* =========================================================
   IMC
========================================================= */

function calcularIMC() {

    const peso =
        parseFloat(elemento("pesoIMC").value);

    const altura =
        parseFloat(elemento("alturaIMC").value);


    if (!peso || peso <= 0) {

        alert("Digite um peso válido.");

        return;
    }


    if (!altura || altura <= 0) {

        alert("Digite uma altura válida.");

        return;
    }


    const imc =
        peso / (altura * altura);


    let classificacao;


    if (imc < 18.5) {

        classificacao =
            "Abaixo do peso";

    } else if (imc < 25) {

        classificacao =
            "Peso normal";

    } else if (imc < 30) {

        classificacao =
            "Sobrepeso";

    } else if (imc < 35) {

        classificacao =
            "Obesidade grau I";

    } else if (imc < 40) {

        classificacao =
            "Obesidade grau II";

    } else {

        classificacao =
            "Obesidade grau III";
    }


    elemento("resultadoIMC").innerHTML = `

        IMC:
        <strong>
            ${imc.toFixed(2)}
        </strong>

        —
        ${classificacao}

    `;


    if (elemento("dashIMC")) {

        elemento("dashIMC").textContent =
            imc.toFixed(1);
    }
}


/* =========================================================
   ÁGUA
========================================================= */

function calcularAgua() {

    const peso =
        parseFloat(elemento("pesoAgua").value);


    if (!peso || peso <= 0) {

        alert("Digite um peso válido.");

        return;
    }


    const aguaMl =
        peso * 35;

    const aguaLitros =
        aguaMl / 1000;


    elemento("resultadoAgua").innerHTML = `

        Consumo recomendado:

        <strong>
            ${aguaLitros.toFixed(2)} litros
        </strong>

        por dia.

    `;


    if (elemento("dashAgua")) {

        elemento("dashAgua").textContent =
            `${aguaLitros.toFixed(2)} L`;
    }
}


/* =========================================================
   PROTEÍNA
========================================================= */

function calcularProteina() {

    const peso =
        parseFloat(elemento("pesoProteina").value);

    const fator =
        parseFloat(elemento("objetivo").value);


    if (!peso || peso <= 0) {

        alert("Digite um peso válido.");

        return;
    }


    const proteina =
        peso * fator;


    elemento("resultadoProteina").innerHTML = `

        Proteína recomendada:

        <strong>
            ${proteina.toFixed(0)} g
        </strong>

        por dia.

    `;


    if (elemento("dashProteina")) {

        elemento("dashProteina").textContent =
            `${proteina.toFixed(0)} g`;
    }
}


/* =========================================================
   META
========================================================= */

function salvarMeta() {

    const pesoAtual =
        parseFloat(
            elemento("pesoMetaAtual").value
        );

    const pesoDesejado =
        parseFloat(
            elemento("pesoMetaDesejado").value
        );


    if (!pesoAtual || pesoAtual <= 0) {

        alert("Digite o peso atual.");

        return;
    }


    if (!pesoDesejado || pesoDesejado <= 0) {

        alert("Digite uma meta válida.");

        return;
    }


    meta = {

        pesoAtual: pesoAtual,

        pesoDesejado: pesoDesejado
    };


    localStorage.setItem(
        "meta",
        JSON.stringify(meta)
    );


    atualizarMeta();


    alert("Meta salva com sucesso!");
}


function carregarMeta() {

    if (!meta || !meta.pesoAtual) {
        return;
    }


    elemento("pesoMetaAtual").value =
        meta.pesoAtual;

    elemento("pesoMetaDesejado").value =
        meta.pesoDesejado;


    atualizarMeta();
}


function atualizarMeta() {

    if (
        !meta ||
        !meta.pesoAtual ||
        !meta.pesoDesejado
    ) {
        return;
    }


    const atual =
        Number(meta.pesoAtual);

    const desejado =
        Number(meta.pesoDesejado);


    let progresso;


    if (atual === desejado) {

        progresso = 100;

    } else {

        const distanciaInicial =
            Math.abs(atual - desejado);

        const distanciaAtual =
            Math.abs(atual - desejado);

        progresso =
            ((distanciaInicial - distanciaAtual)
                / distanciaInicial) * 100;

        /*
           Quando a meta ainda não possui histórico
           de pesagens, começamos em 0%.
        */

        progresso = 0;
    }


    progresso =
        Math.max(
            0,
            Math.min(100, progresso)
        );


    const barra =
        elemento("progressoPeso");


    if (barra) {

        barra.style.width =
            `${progresso}%`;

        barra.textContent =
            `${progresso.toFixed(0)}%`;
    }


    if (elemento("textoMeta")) {

        if (atual === desejado) {

            elemento("textoMeta").textContent =
                "🎉 Parabéns! Você atingiu sua meta!";

        } else {

            const diferenca =
                Math.abs(atual - desejado);

            elemento("textoMeta").textContent =
                `Faltam ${diferenca.toFixed(1)} kg para atingir sua meta.`;
        }
    }
}


/* =========================================================
   ADICIONAR EXERCÍCIO
========================================================= */

function adicionarTreino() {

    const grupo =
        elemento("grupo").value.trim();

    const nome =
        elemento("nome").value.trim();

    const series =
        elemento("series").value;

    const repeticoes =
        elemento("repeticoes").value;

    const peso =
        elemento("peso").value;

    const obs =
        elemento("obs").value.trim();


    if (!grupo) {

        alert("Informe o grupo muscular.");

        return;
    }


    if (!nome) {

        alert("Informe o exercício.");

        return;
    }


    if (!series || Number(series) <= 0) {

        alert("Informe as séries.");

        return;
    }


    if (
        !repeticoes ||
        Number(repeticoes) <= 0
    ) {

        alert("Informe as repetições.");

        return;
    }


    treinos.push({

        id: Date.now(),

        grupo: grupo,

        nome: nome,

        series: Number(series),

        repeticoes: Number(repeticoes),

        peso: peso || "0",

        obs: obs,

        data: obterDataHoje()
    });


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );


    limparFormularioTreino();

    renderizarTreinos();
}


function limparFormularioTreino() {

    const ids = [

        "grupo",
        "nome",
        "series",
        "repeticoes",
        "peso",
        "obs"

    ];


    ids.forEach(id => {

        if (elemento(id)) {

            elemento(id).value = "";
        }
    });
}


function renderizarTreinos() {

    const lista =
        elemento("listaTreinos");


    if (!lista) return;


    lista.innerHTML = "";


    if (treinos.length === 0) {

        lista.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center">

                    Nenhum exercício cadastrado.

                </td>

            </tr>

        `;

        return;
    }


    treinos.forEach(treino => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${treino.grupo}
            </td>

            <td>
                ${treino.nome}
            </td>

            <td>
                ${treino.series}
            </td>

            <td>
                ${treino.repeticoes}
            </td>

            <td>
                ${treino.peso || "-"}
            </td>

            <td>
                ${treino.obs || "-"}
            </td>

            <td>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="excluirTreino(${treino.id})">

                    🗑️

                </button>

            </td>

        `;


        lista.appendChild(tr);
    });
}


function excluirTreino(id) {

    if (
        !confirm(
            "Deseja excluir este exercício?"
        )
    ) {
        return;
    }


    treinos =
        treinos.filter(
            treino => treino.id !== id
        );


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );


    renderizarTreinos();
}


/* =========================================================
   TREINO ATIVO
========================================================= */

function iniciarTreino() {

    if (treinoAtivo) {
        return;
    }


    const grupo =
        elemento("grupoTreino").value;

    const data =
        elemento("dataTreinoAtivo").value;


    if (!grupo) {

        alert(
            "Selecione o grupo muscular."
        );

        return;
    }


    if (!data) {

        alert(
            "Selecione a data do treino."
        );

        return;
    }


    treinoAtivo = true;

    segundosTreino = 0;

    inicioTreino = new Date();


    const hora =
        inicioTreino
            .toTimeString()
            .slice(0, 5);


    elemento("horaInicioTreino").value =
        hora;


    elemento("statusTreino").textContent =
        `Treino de ${grupo} em andamento`;


    elemento("btnIniciarTreino").style.display =
        "none";


    elemento("btnFinalizarTreino").style.display =
        "inline-block";


    atualizarCronometro();


    intervaloCronometro =
        setInterval(() => {

            segundosTreino++;

            atualizarCronometro();

        }, 1000);
}


function atualizarCronometro() {

    elemento("cronometro").textContent =
        formatarTempo(segundosTreino);
}


function finalizarTreino() {

    if (!treinoAtivo) {
        return;
    }


    const grupo =
        elemento("grupoTreino").value;

    const data =
        elemento("dataTreinoAtivo").value;

    const horaInicio =
        elemento("horaInicioTreino").value;


    const duracao =
        segundosTreino;


    clearInterval(
        intervaloCronometro
    );

    intervaloCronometro = null;


    const registro = {

        id: Date.now(),

        grupo: grupo,

        data: data,

        horaInicio: horaInicio,

        duracao: duracao,

        duracaoFormatada:
            formatarTempo(duracao)
    };


    treinosRealizados.push(
        registro
    );


    localStorage.setItem(
        "treinosRealizados",
        JSON.stringify(
            treinosRealizados
        )
    );


    treinoAtivo = false;

    segundosTreino = 0;


    elemento("cronometro").textContent =
        "00:00:00";


    elemento("statusTreino").textContent =
        "Treino finalizado com sucesso!";


    elemento("btnIniciarTreino").style.display =
        "inline-block";


    elemento("btnFinalizarTreino").style.display =
        "none";


    renderizarHistorico();


    alert(

        `Treino finalizado!\n\n` +

        `Grupo: ${grupo}\n` +

        `Data: ${formatarData(data)}\n` +

        `Duração: ${formatarTempo(duracao)}`
    );
}


/* =========================================================
   HISTÓRICO
========================================================= */

function renderizarHistorico() {

    const container =
        elemento(
            "historicoTreinosRealizados"
        );


    if (!container) return;


    container.innerHTML = "";


    if (treinosRealizados.length === 0) {

        container.innerHTML =
            "<p>Nenhum treino realizado.</p>";

        return;
    }


    const ordenados =
        [...treinosRealizados]
            .reverse();


    ordenados.forEach(treino => {

        const div =
            document.createElement("div");


        div.className =
            "historico-treino";


        div.innerHTML = `

            <div>

                <strong>
                    🏋️ ${treino.grupo}
                </strong>

                <small>

                    📅 ${formatarData(treino.data)}

                    • ⏰ ${treino.horaInicio}

                    • ⏱️ ${treino.duracaoFormatada}

                </small>

            </div>


            <button
                class="btn btn-danger btn-sm"
                onclick="excluirTreinoRealizado(${treino.id})">

                🗑️ Excluir

            </button>

        `;


        container.appendChild(div);
    });
}


function excluirTreinoRealizado(id) {

    if (
        !confirm(
            "Deseja excluir este treino?"
        )
    ) {
        return;
    }


    treinosRealizados =
        treinosRealizados.filter(
            treino => treino.id !== id
        );


    localStorage.setItem(
        "treinosRealizados",
        JSON.stringify(
            treinosRealizados
        )
    );


    renderizarHistorico();
}


/* =========================================================
   MEDIDAS
========================================================= */

function salvarMedida() {

    const data =
        elemento("dataMedida").value ||
        obterDataHoje();


    const medida = {

        id: Date.now(),

        data: data,

        peso:
            elemento("pesoDia").value || "",

        bracoD:
            elemento("bracoD").value || "",

        bracoE:
            elemento("bracoE").value || "",

        peito:
            elemento("peito").value || "",

        ombro:
            elemento("ombro").value || "",

        cintura:
            elemento("cintura").value || "",

        abdomen:
            elemento("abdomen").value || "",

        quadril:
            elemento("quadril").value || "",

        coxaD:
            elemento("coxaD").value || "",

        coxaE:
            elemento("coxaE").value || "",

        panturrilhaD:
            elemento("panturrilhaD").value || "",

        panturrilhaE:
            elemento("panturrilhaE").value || "",

        pescoco:
            elemento("pescoco").value || ""
    };


    if (!medida.peso) {

        alert(
            "Informe pelo menos o peso."
        );

        return;
    }


    medidas.push(medida);


    localStorage.setItem(
        "medidas",
        JSON.stringify(medidas)
    );


    renderizarMedidas();

    atualizarGraficos();

    limparFormularioMedidas();


    alert(
        "Medida salva com sucesso!"
    );
}


function limparFormularioMedidas() {

    const ids = [

        "pesoDia",
        "bracoD",
        "bracoE",
        "peito",
        "ombro",
        "cintura",
        "abdomen",
        "quadril",
        "coxaD",
        "coxaE",
        "panturrilhaD",
        "panturrilhaE",
        "pescoco"

    ];


    ids.forEach(id => {

        if (elemento(id)) {

            elemento(id).value = "";
        }
    });


    if (elemento("dataMedida")) {

        elemento("dataMedida").value =
            obterDataHoje();
    }
}


function renderizarMedidas() {

    const lista =
        elemento("listaMedidas");


    if (!lista) return;


    lista.innerHTML = "";


    if (medidas.length === 0) {

        lista.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center">

                    Nenhuma medida registrada.

                </td>

            </tr>

        `;

        return;
    }


    const ordenadas =
        [...medidas].sort(
            (a, b) =>
                new Date(a.data) -
                new Date(b.data)
        );


    ordenadas.forEach(medida => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${formatarData(medida.data)}
            </td>

            <td>
                ${medida.peso || "-"}
            </td>

            <td>
                ${medida.bracoD || "-"}
            </td>

            <td>
                ${medida.peito || "-"}
            </td>

            <td>
                ${medida.cintura || "-"}
            </td>

            <td>
                ${medida.coxaD || "-"}
            </td>

            <td>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="excluirMedida(${medida.id})">

                    🗑️

                </button>

            </td>

        `;


        lista.appendChild(tr);
    });
}


function excluirMedida(id) {

    if (
        !confirm(
            "Deseja excluir esta medida?"
        )
    ) {
        return;
    }


    medidas =
        medidas.filter(
            medida => medida.id !== id
        );


    localStorage.setItem(
        "medidas",
        JSON.stringify(medidas)
    );


    renderizarMedidas();

    atualizarGraficos();
}


/* =========================================================
   GRÁFICOS
========================================================= */

function atualizarGraficos() {

    if (typeof Chart === "undefined") {

        console.warn(
            "Chart.js não carregado."
        );

        return;
    }


    const canvasPeso =
        elemento("graficoPeso");

    const canvasCintura =
        elemento("graficoCintura");


    if (!canvasPeso || !canvasCintura) {
        return;
    }


    const ordenadas =
        [...medidas].sort(
            (a, b) =>
                new Date(a.data) -
                new Date(b.data)
        );


    const labels =
        ordenadas.map(
            medida =>
                formatarData(medida.data)
        );


    const pesos =
        ordenadas.map(
            medida =>
                medida.peso
                    ? Number(medida.peso)
                    : null
        );


    const cinturas =
        ordenadas.map(
            medida =>
                medida.cintura
                    ? Number(medida.cintura)
                    : null
        );


    if (graficoPeso) {

        graficoPeso.destroy();
    }


    if (graficoCintura) {

        graficoCintura.destroy();
    }


    graficoPeso = new Chart(
        canvasPeso,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Peso (kg)",

                        data: pesos,

                        borderWidth: 3,

                        tension: 0.3,

                        fill: false
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false
            }
        }
    );


    graficoCintura = new Chart(
        canvasCintura,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Cintura (cm)",

                        data: cinturas,

                        borderWidth: 3,

                        tension: 0.3,

                        fill: false
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false
            }
        }
    );
}


/* =========================================================
   NAVEGAÇÃO DO MENU
========================================================= */

function configurarNavegacao() {

    document
        .querySelectorAll(
            '.sidebar a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                function (evento) {

                    const destino =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !destino ||
                        destino === "#"
                    ) {
                        return;
                    }


                    const alvo =
                        document.querySelector(
                            destino
                        );


                    if (alvo) {

                        evento.preventDefault();


                        alvo.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"
                        });
                    }
                }
            );
        });
}


/* =========================================================
   DATAS
========================================================= */

function configurarDatas() {

    if (
        elemento("dataTreinoAtivo") &&
        !elemento("dataTreinoAtivo").value
    ) {

        elemento(
            "dataTreinoAtivo"
        ).value =
            obterDataHoje();
    }


    if (
        elemento("dataMedida") &&
        !elemento("dataMedida").value
    ) {

        elemento(
            "dataMedida"
        ).value =
            obterDataHoje();
    }
}


/* =========================================================
   IDADE AUTOMÁTICA
========================================================= */

function configurarNascimento() {

    const campo =
        elemento("nascimento");


    if (!campo) return;


    campo.addEventListener(
        "change",
        function () {

            const idade =
                calcularIdade(
                    this.value
                );


            if (elemento("idade")) {

                elemento("idade").value =
                    idade;
            }
        }
    );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Well Fitness carregado!"
        );


        carregarTema();

        carregarPerfil();

        carregarMeta();

        renderizarTreinos();

        renderizarHistorico();

        renderizarMedidas();

        configurarDatas();

        configurarNascimento();

        configurarNavegacao();

        atualizarDashboard();


        setTimeout(
            function () {

                atualizarGraficos();

            },
            500
        );
    }
);

