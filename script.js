// ===============================
// FITNESS TRACKER
// ===============================

let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

function salvarTreinos() {
    localStorage.setItem("treinos", JSON.stringify(treinos));
}

// ===============================
// IMC
// ===============================

function calcularIMC() {

    let peso = parseFloat(document.getElementById("pesoIMC").value);
    let altura = parseFloat(document.getElementById("alturaIMC").value);

    if (!peso || !altura) {
        alert("Preencha peso e altura.");
        return;
    }

    let imc = peso / (altura * altura);

    let situacao = "";

    if (imc < 18.5)
        situacao = "Abaixo do peso";
    else if (imc < 25)
        situacao = "Peso normal";
    else if (imc < 30)
        situacao = "Sobrepeso";
    else if (imc < 35)
        situacao = "Obesidade Grau I";
    else if (imc < 40)
        situacao = "Obesidade Grau II";
    else
        situacao = "Obesidade Grau III";

    document.getElementById("resultadoIMC").innerHTML =
        "IMC: <strong>" +
        imc.toFixed(2) +
        "</strong><br>" +
        situacao;

}

// ===============================
// ÁGUA
// ===============================

function calcularAgua() {

    let peso = parseFloat(document.getElementById("pesoAgua").value);

    if (!peso) {
        alert("Digite seu peso.");
        return;
    }

    let litros = (peso * 35) / 1000;

    document.getElementById("resultadoAgua").innerHTML =
        "Você deve beber aproximadamente <strong>" +
        litros.toFixed(2) +
        " litros</strong> por dia.";

}

// ===============================
// PROTEÍNA
// ===============================

function calcularProteina() {

    let peso = parseFloat(document.getElementById("pesoProteina").value);
    let fator = parseFloat(document.getElementById("objetivo").value);

    if (!peso) {
        alert("Digite seu peso.");
        return;
    }

    let proteina = peso * fator;

    document.getElementById("resultadoProteina").innerHTML =
        "Consuma cerca de <strong>" +
        proteina.toFixed(0) +
        " g</strong> de proteína por dia.";

}

// ===============================
// TREINOS
// ===============================

function adicionarTreino() {

    let grupo = document.getElementById("grupo").value;
    let nome = document.getElementById("nome").value;
    let series = document.getElementById("series").value;
    let repeticoes = document.getElementById("repeticoes").value;
    let peso = document.getElementById("peso").value;
    let obs = document.getElementById("obs").value;

    if (
        grupo == "" ||
        nome == "" ||
        series == "" ||
        repeticoes == ""
    ) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    treinos.push({
        grupo,
        nome,
        series,
        repeticoes,
        peso,
        obs
    });

    salvarTreinos();

    atualizarTabela();

    limparCampos();

}

function limparCampos() {

    document.getElementById("grupo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("series").value = "";
    document.getElementById("repeticoes").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("obs").value = "";

}

function atualizarTabela() {

    let tabela = document.getElementById("listaTreinos");

    tabela.innerHTML = "";

    treinos.forEach((treino, indice) => {

        tabela.innerHTML += `

        <tr>

            <td>${treino.grupo}</td>

            <td>${treino.nome}</td>

            <td>${treino.series}</td>

            <td>${treino.repeticoes}</td>

            <td>${treino.peso}</td>

            <td>${treino.obs}</td>

            <td>

                <button
                class="excluir"
                onclick="excluirTreino(${indice})">

                ❌

                </button>

            </td>

        </tr>

        `;

    });

}

function excluirTreino(indice) {

    if (confirm("Deseja excluir este exercício?")) {

        treinos.splice(indice, 1);

        salvarTreinos();

        atualizarTabela();

    }

}

// ===============================
// CARREGAR AO ABRIR
// ===============================

window.onload=function(){

    atualizarTabela();

    carregarPerfil();

    mostrarMeta();

    mostrarMedidas();

}

// =====================
// TEMA
// =====================

let tema = localStorage.getItem("tema");

if(tema=="light"){

    document.body.classList.add("light");

    document.getElementById("temaBtn").innerHTML="☀️ Modo Claro";

}

function trocarTema(){

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("tema","light");

        document.getElementById("temaBtn").innerHTML="☀️ Modo Claro";

    }else{

        localStorage.setItem("tema","dark");

        document.getElementById("temaBtn").innerHTML="🌙 Modo Escuro";

    }

}

//========================
// DADOS PESSOAIS
//========================

let perfil = JSON.parse(localStorage.getItem("perfil")) || {};

function salvarPerfil(){

    perfil.nome = document.getElementById("nomeUsuario").value;

    perfil.nascimento = document.getElementById("nascimento").value;

    perfil.peso = document.getElementById("pesoAtual").value;

    perfil.altura = document.getElementById("alturaAtual").value;

    perfil.objetivo = document.getElementById("objetivoUsuario").value;

    localStorage.setItem("perfil",JSON.stringify(perfil));

    carregarPerfil();
    mostrarMeta();
    mostrarMedidas();

}

function carregarPerfil(){

    if(!perfil.nome) return;

    document.getElementById("nomeUsuario").value = perfil.nome;

    document.getElementById("nascimento").value = perfil.nascimento;

    document.getElementById("pesoAtual").value = perfil.peso;

    document.getElementById("alturaAtual").value = perfil.altura;

    document.getElementById("objetivoUsuario").value = perfil.objetivo;

    let idade = "";

    if(perfil.nascimento){

        let nasc = new Date(perfil.nascimento);

        let hoje = new Date();

        idade = hoje.getFullYear()-nasc.getFullYear();

        let m = hoje.getMonth()-nasc.getMonth();

        if(m<0 || (m==0 && hoje.getDate()<nasc.getDate()))
            idade--;

    }

    document.getElementById("perfilInfo").innerHTML=`

        <strong>${perfil.nome}</strong><br>

        Idade: ${idade} anos<br>

        Peso: ${perfil.peso} kg<br>

        Altura: ${perfil.altura} m<br>

        Objetivo: ${perfil.objetivo}

    `;

    document.getElementById("tituloUsuario").innerHTML=

    `🏋️ Olá, ${perfil.nome}!`;

}


//========================
// META DE PESO
//========================

let meta = JSON.parse(localStorage.getItem("meta")) || {};

function salvarMeta(){

meta.atual=parseFloat(document.getElementById("pesoMetaAtual").value);

meta.meta=parseFloat(document.getElementById("pesoMetaDesejado").value);

localStorage.setItem("meta",JSON.stringify(meta));

mostrarMeta();

}

function mostrarMeta(){

if(!meta.atual || !meta.meta) return;

document.getElementById("pesoMetaAtual").value=meta.atual;

document.getElementById("pesoMetaDesejado").value=meta.meta;

let porcentagem;

if(meta.meta>meta.atual){

// ganhar peso

porcentagem=(meta.atual/meta.meta)*100;

}else{

// perder peso

porcentagem=(meta.meta/meta.atual)*100;

}

if(porcentagem>100)
porcentagem=100;

document.getElementById("progressoPeso").style.width=porcentagem+"%";

document.getElementById("progressoPeso").innerHTML=Math.round(porcentagem)+"%";

let falta=Math.abs(meta.meta-meta.atual);

document.getElementById("textoMeta").innerHTML=

`Peso atual: <strong>${meta.atual} kg</strong><br>

Meta: <strong>${meta.meta} kg</strong><br>

Diferença: <strong>${falta.toFixed(1)} kg</strong>`;

}







//========================
// MEDIDAS CORPORAIS
//========================


let medidas = JSON.parse(localStorage.getItem("medidas")) || [];


function salvarMedida(){


let medida={


data:
document.getElementById("dataMedida").value,


bracoD:
document.getElementById("bracoD").value,


bracoE:
document.getElementById("bracoE").value,


peito:
document.getElementById("peito").value,


ombro:
document.getElementById("ombro").value,


cintura:
document.getElementById("cintura").value,


abdomen:
document.getElementById("abdomen").value,


quadril:
document.getElementById("quadril").value,


coxaD:
document.getElementById("coxaD").value,


coxaE:
document.getElementById("coxaE").value,


panturrilhaD:
document.getElementById("panturrilhaD").value,


panturrilhaE:
document.getElementById("panturrilhaE").value,


pescoco:
document.getElementById("pescoco").value


};


medidas.push(medida);


localStorage.setItem(
"medidas",
JSON.stringify(medidas)
);


mostrarMedidas();


alert("Medidas salvas!");

}



function mostrarMedidas(){


let tabela=document.getElementById("listaMedidas");


if(!tabela) return;


tabela.innerHTML="";


medidas.forEach((m,index)=>{


tabela.innerHTML+=`

<tr>

<td>${m.data}</td>

<td>${m.bracoD} cm</td>

<td>${m.peito} cm</td>

<td>${m.cintura} cm</td>

<td>${m.coxaD} cm</td>


<td>

<button 
class="excluirMedida"
onclick="excluirMedida(${index})">

❌

</button>

</td>


</tr>

`;


});


}



function excluirMedida(index){


medidas.splice(index,1);


localStorage.setItem(
"medidas",
JSON.stringify(medidas)
);


mostrarMedidas();


}