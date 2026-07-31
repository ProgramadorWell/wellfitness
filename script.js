//=========================================
// FITNESS TRACKER
//=========================================

// ---------- BANCO LOCAL ----------

let perfil = JSON.parse(localStorage.getItem("perfil")) || {};

let meta = JSON.parse(localStorage.getItem("meta")) || {};

let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

let medidas = JSON.parse(localStorage.getItem("medidas")) || [];

// ---------- TEMA ----------

function trocarTema(){

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("tema","light");

        document.getElementById("temaBtn").innerHTML="☀️ Claro";

    }else{

        localStorage.setItem("tema","dark");

        document.getElementById("temaBtn").innerHTML="🌙 Escuro";

    }

}

function carregarTema(){

    const tema=localStorage.getItem("tema");

    if(tema==="light"){

        document.body.classList.add("light");

        document.getElementById("temaBtn").innerHTML="☀️ Claro";

    }

}

// ---------- PERFIL ----------

function salvarPerfil(){

    perfil={

        nome:document.getElementById("nomeUsuario").value,

        nascimento:document.getElementById("nascimento").value,

        peso:Number(document.getElementById("pesoAtual").value),

        altura:Number(document.getElementById("alturaAtual").value),

        objetivo:document.getElementById("objetivoUsuario").value

    };

    localStorage.setItem("perfil",JSON.stringify(perfil));

    carregarPerfil();

    atualizarDashboard();

}

function carregarPerfil(){

    if(!perfil.nome) return;

    document.getElementById("nomeUsuario").value=perfil.nome;

    document.getElementById("nascimento").value=perfil.nascimento;

    document.getElementById("pesoAtual").value=perfil.peso;

    document.getElementById("alturaAtual").value=perfil.altura;

    document.getElementById("objetivoUsuario").value=perfil.objetivo;

    let idade=calcularIdade(perfil.nascimento);

    document.getElementById("idade").value=idade;

    document.getElementById("tituloUsuario").innerHTML=

    "Olá, "+perfil.nome+" 👋";

}

function calcularIdade(data){

    if(!data) return "";

    const nasc=new Date(data);

    const hoje=new Date();

    let idade=hoje.getFullYear()-nasc.getFullYear();

    let mes=hoje.getMonth()-nasc.getMonth();

    if(mes<0 || (mes===0 && hoje.getDate()<nasc.getDate())){

        idade--;

    }

    return idade;

}

// ---------- DASHBOARD ----------

function atualizarDashboard(){

    document.getElementById("dashPeso").innerHTML=

    perfil.peso?perfil.peso+" kg":"--";

    if(perfil.peso && perfil.altura){

        let imc=(perfil.peso/(perfil.altura*perfil.altura));

        document.getElementById("dashIMC").innerHTML=

        imc.toFixed(1);

    }

    if(perfil.peso){

        let agua=(perfil.peso*35)/1000;

        document.getElementById("dashAgua").innerHTML=

        agua.toFixed(1)+" L";

        let fator=2;

        if(perfil.objetivo==="Manutenção") fator=1.6;

        if(perfil.objetivo==="Emagrecimento") fator=2.2;

        document.getElementById("dashProteina").innerHTML=

        Math.round(perfil.peso*fator)+" g";

    }

}


//=========================================
// META DE PESO
//=========================================

function salvarMeta(){

    meta={

        atual:Number(document.getElementById("pesoMetaAtual").value),

        desejado:Number(document.getElementById("pesoMetaDesejado").value)

    };

    localStorage.setItem("meta",JSON.stringify(meta));

    carregarMeta();

}

function carregarMeta(){

    if(!meta.atual) return;

    document.getElementById("pesoMetaAtual").value=meta.atual;

    document.getElementById("pesoMetaDesejado").value=meta.desejado;

    let porcentagem=0;

    if(meta.desejado>meta.atual){

        porcentagem=(meta.atual/meta.desejado)*100;

    }else{

        porcentagem=(meta.desejado/meta.atual)*100;

    }

    porcentagem=Math.min(100,Math.max(0,porcentagem));

    const barra=document.getElementById("progressoPeso");

    barra.style.width=porcentagem+"%";

    barra.innerHTML=Math.round(porcentagem)+"%";

    let diferenca=Math.abs(meta.desejado-meta.atual);

    document.getElementById("textoMeta").innerHTML=

    `Peso Atual: <strong>${meta.atual} kg</strong><br>
     Meta: <strong>${meta.desejado} kg</strong><br>
     Diferença: <strong>${diferenca.toFixed(1)} kg</strong>`;

}

//=========================================
// IMC
//=========================================

function calcularIMC(){

    let peso=Number(document.getElementById("pesoIMC").value);

    let altura=Number(document.getElementById("alturaIMC").value);

    if(!peso || !altura){

        alert("Informe peso e altura.");

        return;

    }

    let imc=peso/(altura*altura);

    let texto="";

    if(imc<18.5)

        texto="Abaixo do peso";

    else if(imc<25)

        texto="Peso normal";

    else if(imc<30)

        texto="Sobrepeso";

    else if(imc<35)

        texto="Obesidade Grau I";

    else if(imc<40)

        texto="Obesidade Grau II";

    else

        texto="Obesidade Grau III";

    document.getElementById("resultadoIMC").innerHTML=

    `<strong>${imc.toFixed(2)}</strong><br>${texto}`;

}

//=========================================
// ÁGUA
//=========================================

function calcularAgua(){

    let peso=Number(document.getElementById("pesoAgua").value);

    if(!peso){

        alert("Informe seu peso.");

        return;

    }

    let litros=(peso*35)/1000;

    document.getElementById("resultadoAgua").innerHTML=

    `Você deve beber aproximadamente <strong>${litros.toFixed(2)} litros</strong> por dia.`;

}

//=========================================
// PROTEÍNA
//=========================================

function calcularProteina(){

    let peso=Number(document.getElementById("pesoProteina").value);

    let fator=Number(document.getElementById("objetivo").value);

    if(!peso){

        alert("Informe seu peso.");

        return;

    }

    let proteina=peso*fator;

    document.getElementById("resultadoProteina").innerHTML=

    `Consuma aproximadamente <strong>${Math.round(proteina)} g</strong> de proteína por dia.`;

}

//=========================================
// TREINOS
//=========================================

function adicionarTreino(){

    let treino={

        grupo:document.getElementById("grupo").value,

        nome:document.getElementById("nome").value,

        series:document.getElementById("series").value,

        repeticoes:document.getElementById("repeticoes").value,

        peso:document.getElementById("peso").value,

        obs:document.getElementById("obs").value

    };

    if(!treino.grupo || !treino.nome){

        alert("Preencha os campos obrigatórios.");

        return;

    }

    treinos.push(treino);

    localStorage.setItem("treinos",JSON.stringify(treinos));

    atualizarTabela();

    limparCampos();

}

function limparCampos(){

    ["grupo","nome","series","repeticoes","peso","obs"].forEach(id=>{

        document.getElementById(id).value="";

    });

}

function atualizarTabela(){

    const tbody=document.getElementById("listaTreinos");

    tbody.innerHTML="";

    treinos.forEach((t,i)=>{

        tbody.innerHTML+=`

        <tr>

        <td>${t.grupo}</td>

        <td>${t.nome}</td>

        <td>${t.series}</td>

        <td>${t.repeticoes}</td>

        <td>${t.peso}</td>

        <td>${t.obs}</td>

        <td>

        <button
        class="btn btn-danger btn-sm"
        onclick="excluirTreino(${i})">

        <i class="fa-solid fa-trash"></i>

        </button>

        </td>

        </tr>

        `;

    });

}

function excluirTreino(indice){

    if(confirm("Excluir exercício?")){

        treinos.splice(indice,1);

        localStorage.setItem("treinos",JSON.stringify(treinos));

        atualizarTabela();

    }

}


//=========================================
// MEDIDAS CORPORAIS
//=========================================

let graficoPeso = null;
let graficoCintura = null;

function salvarMedida(){

    const medida={

        data:document.getElementById("dataMedida").value,

        peso:Number(document.getElementById("pesoDia").value),

        bracoD:Number(document.getElementById("bracoD").value),

        bracoE:Number(document.getElementById("bracoE").value),

        peito:Number(document.getElementById("peito").value),

        ombro:Number(document.getElementById("ombro").value),

        cintura:Number(document.getElementById("cintura").value),

        abdomen:Number(document.getElementById("abdomen").value),

        quadril:Number(document.getElementById("quadril").value),

        coxaD:Number(document.getElementById("coxaD").value),

        coxaE:Number(document.getElementById("coxaE").value),

        panturrilhaD:Number(document.getElementById("panturrilhaD").value),

        panturrilhaE:Number(document.getElementById("panturrilhaE").value),

        pescoco:Number(document.getElementById("pescoco").value)

    };

    if(!medida.data){

        alert("Informe a data da medição.");

        return;

    }

    medidas.push(medida);

    localStorage.setItem("medidas",JSON.stringify(medidas));

    mostrarMedidas();

    atualizarGraficos();

}

function mostrarMedidas(){

    const tbody=document.getElementById("listaMedidas");

    tbody.innerHTML="";

    medidas.forEach((m,index)=>{

        tbody.innerHTML+=`

        <tr>

        <td>${m.data}</td>

        <td>${m.peso} kg</td>

        <td>${m.bracoD} cm</td>

        <td>${m.peito} cm</td>

        <td>${m.cintura} cm</td>

        <td>${m.coxaD} cm</td>

        <td>

            <button
            class="btn btn-danger btn-sm"
            onclick="excluirMedida(${index})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </td>

        </tr>

        `;

    });

}

function excluirMedida(indice){

    if(confirm("Excluir esta medição?")){

        medidas.splice(indice,1);

        localStorage.setItem("medidas",JSON.stringify(medidas));

        mostrarMedidas();

        atualizarGraficos();

    }

}

//=========================================
// CHART.JS
//=========================================

function atualizarGraficos(){

    if(medidas.length===0) return;

    const datas=medidas.map(m=>m.data);

    const pesos=medidas.map(m=>m.peso);

    const cintura=medidas.map(m=>m.cintura);

    if(graficoPeso) graficoPeso.destroy();

    if(graficoCintura) graficoCintura.destroy();

    graficoPeso=new Chart(

        document.getElementById("graficoPeso"),

        {

            type:"line",

            data:{

                labels:datas,

                datasets:[{

                    label:"Peso",

                    data:pesos,

                    borderColor:"#22c55e",

                    backgroundColor:"rgba(34,197,94,.15)",

                    fill:true,

                    tension:.35

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

    graficoCintura=new Chart(

        document.getElementById("graficoCintura"),

        {

            type:"line",

            data:{

                labels:datas,

                datasets:[{

                    label:"Cintura",

                    data:cintura,

                    borderColor:"#3b82f6",

                    backgroundColor:"rgba(59,130,246,.15)",

                    fill:true,

                    tension:.35

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

//=========================================
// INICIALIZAÇÃO
//=========================================

window.onload=function(){

    carregarTema();

    carregarPerfil();

    carregarMeta();

    atualizarTabela();

    mostrarMedidas();

    atualizarGraficos();

    atualizarDashboard();

};
