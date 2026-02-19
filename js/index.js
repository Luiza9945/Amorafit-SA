function adicionar(valor) {
    document.getElementById("display").value += valor;
}

function limpar() {
    document.getElementById("display").value = "";
}

function apagar() {
    let valor = document.getElementById("display").value;
    document.getElementById("display").value = valor.slice(0, -1);
}

function calcular() {
    try {
        let resultado = eval(document.getElementById("display").value);
        document.getElementById("display").value = resultado;
    } catch {
        document.getElementById("display").value = "Erro";
    }
}

// Meta diária de calorias
const META_DIARIA = 1500;

// Dados das refeições
let dados = {
    cafe: 0,
    almoco: 0,
    lanche: 0,
    jantar: 0
};

// Função para calcular calorias
function calcularCalorias() {
    const gramas = parseFloat(document.getElementById("gramas").value);
    const caloriasPorGrama = parseFloat(document.getElementById("caloriasPorGrama").value);
    const refeicao = document.querySelector('input[name="refeicao"]:checked');
    
    // Validação: verificar se refeição foi selecionada
    if (!refeicao) {
        alert("Por favor, selecione uma refeição (Café, Almoço, Lanche ou Jantar)!");
        return;
    }
    
    if (isNaN(gramas) || isNaN(caloriasPorGrama)) {
        alert("Por favor, preencha todos os campos com valores numéricos!");
        return;
    }
    
    if (gramas < 0 || caloriasPorGrama < 0) {
        alert("Os valores não podem ser negativos!");
        return;
    }
    
    const totalCalorias = gramas * caloriasPorGrama;
    
    // Adicionar às refeições
    adicionarCaloriasAoGrafico(totalCalorias, refeicao.value);
    
    // Limpa os campos da calculadora
    document.getElementById("gramas").value = "";
    document.getElementById("caloriasPorGrama").value = "";
}

// Função para adicionar calorias e atualizar o progresso
function adicionarCaloriasAoGrafico(valor, tipoRefeicao) {
    if (valor === 0 || isNaN(valor)) {
        return;
    }

    // Adiciona as calorias à refeição
    dados[tipoRefeicao] += valor;

    // Calcula o total consumido
    const totalConsumido = dados.cafe + dados.almoco + dados.lanche + dados.jantar;
    
    // Calcula o restante
    const restante = META_DIARIA - totalConsumido;

    // Atualiza os elementos do card
    document.getElementById("totalConsumido").innerText = totalConsumido.toFixed(0);
    document.getElementById("kcalRestante").innerText = restante.toFixed(0);

    // Atualiza a barra de progresso
    const percentual = Math.min((totalConsumido / META_DIARIA) * 100, 100);
    document.getElementById("progressBar").style.width = percentual + "%";
    document.getElementById("progressPercent").innerText = percentual.toFixed(0) + "%";
    
    // Uma única cor para a barra de progresso
    const progressBar = document.getElementById("progressBar");
    progressBar.style.background = "linear-gradient(90deg, #667eea 0%, #764ba2 100%)";
    
    // Alerta se passou da meta
    if (restante < 0) {
        document.getElementById("kcalRestante").style.color = "#e74c3c";
    } else {
        document.getElementById("kcalRestante").style.color = "#27ae60";
    }
}

// Função para reiniciar o MFP
function reiniciarMFP() {
    // Reset dados das refeições
    dados = {
        cafe: 0,
        almoco: 0,
        lanche: 0,
        jantar: 0
    };
    
    // Reset dos elementos de display
    document.getElementById("totalConsumido").innerText = "0";
    document.getElementById("kcalRestante").innerText = META_DIARIA;
    
    // Reset da barra de progresso
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("progressPercent").innerText = "0%";
    document.getElementById("kcalRestante").style.color = "#27ae60";
    
    // Limpa os campos de input
    document.getElementById("gramas").value = "";
    document.getElementById("caloriasPorGrama").value = "";
    
    // Desmarca as opções de refeição
    const refeicoes = document.querySelectorAll('input[name="refeicao"]');
    refeicoes.forEach(ref => ref.checked = false);
}
