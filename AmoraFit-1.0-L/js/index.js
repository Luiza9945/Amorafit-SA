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
let META_DIARIA = parseInt(localStorage.getItem('metaCalorias')) || 1500;

// Dados das refeições
let dados = {
    cafe: 0,
    almoco: 0,
    lanche: 0,
    jantar: 0
};

// Histórico de alimentos consumidos
let historicoAlimentos = [];

// Função para salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('dadosRefeicoes', JSON.stringify(dados));
    localStorage.setItem('historicoAlimentos', JSON.stringify(historicoAlimentos));
}

// Função para carregar dados do localStorage
function carregarDados() {
    // Carregar meta de calorias
    META_DIARIA = parseInt(localStorage.getItem('metaCalorias')) || 1500;
    document.getElementById("metakcal").innerText = META_DIARIA;
    
    // Carregar dados das refeições
    const dadosSalvos = localStorage.getItem('dadosRefeicoes');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
    
    // Carregar histórico de alimentos
    const historicoSalvo = localStorage.getItem('historicoAlimentos');
    if (historicoSalvo) {
        historicoAlimentos = JSON.parse(historicoSalvo);
    }
    
    // Atualizar a interface
    atualizarInterface();
    
    // Renderizar o histórico
    renderizarHistorico();
}

// Função para atualizar a interface com os dados carregados
function atualizarInterface() {
    // Calcula o total consumido
    const totalConsumido = dados.cafe + dados.almoco + dados.lanche + dados.jantar;
    
    // Calcula o restante
    const restante = META_DIARIA - totalConsumido;

    // Atualiza os elementos do card
    document.getElementById("totalConsumido").innerText = totalConsumido.toFixed(0);
    document.getElementById("kcalRestante").innerText = restante.toFixed(0);
    document.getElementById("metakcal").innerText = META_DIARIA;

    // Atualiza a barra de progresso
    const percentual = Math.min((totalConsumido / META_DIARIA) * 100, 100);
    document.getElementById("progressBar").style.width = percentual + "%";
    document.getElementById("progressPercent").innerText = percentual.toFixed(0) + "%";
    
    // Alerta se passou da meta
    if (restante < 0) {
        document.getElementById("kcalRestante").style.color = "#e74c3c";
    } else {
        document.getElementById("kcalRestante").style.color = "#27ae60";
    }
    
    // Atualiza a cor da barra de progresso com tons de verde
    atualizarCorBarraProgresso(percentual);
}

// Função para atualizar a cor da barra com tons de verde
function atualizarCorBarraProgresso(percentual) {
    const progressBar = document.getElementById("progressBar");
    
    // Calcula a intensidade do verde (de 0% a 100%)
    const r = Math.round(168 - (percentual * 1.23));
    const g = Math.round(230 - (percentual * 1.24));
    const b = Math.round(207 - (percentual * 1.28));
    
    const corVerde = `rgb(${r}, ${g}, ${b})`;
    progressBar.style.background = corVerde;
}

// Carregar dados ao iniciar a página
carregarDados();

// Escutar mudanças no localStorage (para atualizar quando o perfil for editado)
window.addEventListener('storage', function(e) {
    if (e.key === 'metaCalorias') {
        META_DIARIA = parseInt(localStorage.getItem('metaCalorias')) || 1500;
        document.getElementById("metakcal").innerText = META_DIARIA;
        
        // Recalcular o restante com a nova meta
        const totalConsumido = dados.cafe + dados.almoco + dados.lanche + dados.jantar;
        const restante = META_DIARIA - totalConsumido;
        document.getElementById("kcalRestante").innerText = restante.toFixed(0);
        
        // Atualizar a barra de progresso
        const percentual = Math.min((totalConsumido / META_DIARIA) * 100, 100);
        document.getElementById("progressBar").style.width = percentual + "%";
        document.getElementById("progressPercent").innerText = percentual.toFixed(0) + "%";
        
        // Atualizar cor do restante
        if (restante < 0) {
            document.getElementById("kcalRestante").style.color = "#e74c3c";
        } else {
            document.getElementById("kcalRestante").style.color = "#27ae60";
        }
    }
});

// Função para calcular calorias
function calcularCalorias() {
    const nomeAlimento = document.getElementById("nomeAlimento").value.trim();
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
    
    // Nome é opcional - se não tiver, usa "Alimento"
    const nomeExibir = nomeAlimento || "Alimento";
    
    // Criar objeto de alimento
    const alimento = {
        id: Date.now(),
        nome: nomeExibir,
        gramas: gramas,
        kcalPorGrama: caloriasPorGrama,
        totalCalorias: totalCalorias,
        refeicao: refeicao.value,
        data: new Date().toLocaleDateString()
    };
    
    // Adicionar ao histórico
    historicoAlimentos.push(alimento);
    
    // Adicionar às refeições
    adicionarCaloriasAoGrafico(totalCalorias, refeicao.value);
    
    // Renderizar o histórico
    renderizarHistorico();
    
    // Salvar dados
    salvarDados();
    
    // Limpa os campos da calculadora
    document.getElementById("nomeAlimento").value = "";
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
    
    // Atualiza a cor da barra de progresso com tons de verde
    atualizarCorBarraProgresso(percentual);
    
    // Alerta se passou da meta
    if (restante < 0) {
        document.getElementById("kcalRestante").style.color = "#e74c3c";
    } else {
        document.getElementById("kcalRestante").style.color = "#27ae60";
    }
    
    // Salvar os dados no localStorage
    salvarDados();
}

// Função para renderizar o histórico
function renderizarHistorico() {
    // Limpar as listas
    document.getElementById('historico-cafe').innerHTML = '';
    document.getElementById('historico-almoco').innerHTML = '';
    document.getElementById('historico-lanche').innerHTML = '';
    document.getElementById('historico-jantar').innerHTML = '';
    
    // Renderizar cada alimento no histórico
    historicoAlimentos.forEach(alimento => {
        const itemHTML = `
            <div class="historico-item">
                <div class="historico-info">
                    <div class="historico-nome">${alimento.nome}</div>
                    <div class="historico-detalhes">
                        ${alimento.gramas}g | <span class="kcal">${alimento.totalCalorias.toFixed(0)} kcal</span>
                    </div>
                </div>
                <div class="historico-acoes">
                    <button class="btn-excluir" onclick="excluirAlimento(${alimento.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar ao container correto
        const container = document.getElementById(`historico-${alimento.refeicao}`);
        if (container) {
            container.innerHTML += itemHTML;
        }
    });
    
    // Mostrar mensagem se estiver vazio
    const listas = ['cafe', 'almoco', 'lanche', 'jantar'];
    listas.forEach(ref => {
        const container = document.getElementById(`historico-${ref}`);
        if (container && container.innerHTML === '') {
            container.innerHTML = '<div class="historico-vazio">Nenhum alimento registrado</div>';
        }
    });
}

// Função para excluir alimento
function excluirAlimento(id) {
    // Encontrar o alimento
    const alimento = historicoAlimentos.find(a => a.id === id);
    if (!alimento) return;
    
    // Confirmar exclusão
    if (!confirm(`Tem certeza que deseja excluir "${alimento.nome}"?`)) {
        return;
    }
    
    // Remover do histórico
    historicoAlimentos = historicoAlimentos.filter(a => a.id !== id);
    
    // Atualizar os dados da refeição (subtrair as calorias)
    dados[alimento.refeicao] -= alimento.totalCalorias;
    
    // Garantir que não fique negativo
    if (dados[alimento.refeicao] < 0) {
        dados[alimento.refeicao] = 0;
    }
    
    // Atualizar a interface
    atualizarInterface();
    
    // Renderizar o histórico
    renderizarHistorico();
    
    // Salvar dados
    salvarDados();
}

// Função para editar alimento
function editarAlimento(id) {
    // Encontrar o alimento
    const alimento = historicoAlimentos.find(a => a.id === id);
    if (!alimento) return;
    
    // Preencher os campos do formulário
    document.getElementById("nomeAlimento").value = alimento.nome;
    document.getElementById("gramas").value = alimento.gramas;
    document.getElementById("caloriasPorGrama").value = alimento.kcalPorGrama;
    
    // Selecionar a refeição correta
    const radios = document.querySelectorAll('input[name="refeicao"]');
    radios.forEach(radio => {
        radio.checked = (radio.value === alimento.refeicao);
    });
    
    // Remover o alimento do histórico (será adicionado novamente ao salvar)
    historicoAlimentos = historicoAlimentos.filter(a => a.id !== id);
    
    // Atualizar os dados da refeição (subtrair as calorias)
    dados[alimento.refeicao] -= alimento.totalCalorias;
    
    // Garantir que não fique negativo
    if (dados[alimento.refeicao] < 0) {
        dados[alimento.refeicao] = 0;
    }
    
    // Atualizar a interface
    atualizarInterface();
    
    // Renderizar o histórico
    renderizarHistorico();
    
    // Salvar dados
    salvarDados();
    
    // Mudar texto do botão para "Atualizar"
    document.getElementById("btnAdicionar").innerText = "Atualizar";
}

// Função para reiniciar o MFP
function reiniciarMFP() {
    if (!confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
        return;
    }
    
    // Reset dados das refeições
    dados = {
        cafe: 0,
        almoco: 0,
        lanche: 0,
        jantar: 0
    };
    
    // Limpar histórico
    historicoAlimentos = [];
    
    // Reset dos elementos de display
    document.getElementById("totalConsumido").innerText = "0";
    document.getElementById("kcalRestante").innerText = META_DIARIA;
    
    // Reset da barra de progresso
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("progressPercent").innerText = "0%";
    document.getElementById("kcalRestante").style.color = "#27ae60";
    
    // Reset da cor da barra de progresso para verde inicial
    const progressBar = document.getElementById("progressBar");
    progressBar.style.backgroundColor = "#7ABF98";
    
    // Limpa os campos de input
    document.getElementById("nomeAlimento").value = "";
    document.getElementById("gramas").value = "";
    document.getElementById("caloriasPorGrama").value = "";
    
    // Desmarca as opções de refeição
    const refeicoes = document.querySelectorAll('input[name="refeicao"]');
    refeicoes.forEach(ref => ref.checked = false);
    
    // Renderizar o histórico vazio
    renderizarHistorico();
    
    // Salvar dados
    salvarDados();
}

// ==========================================
// Tabela Nutricional - Busca de Alimentos
// ==========================================

// Banco de dados de alimentos (calorias por grama)
const bancoAlimentos = [
    // Frutas
    { nome: "Maçã", kcalPorGrama: 0.52 },
    { nome: "Banana", kcalPorGrama: 0.89 },
    { nome: "Uva", kcalPorGrama: 0.67 },
    { nome: "Morango", kcalPorGrama: 0.32 },
    { nome: "Mamão", kcalPorGrama: 0.43 },
    { nome: "Melancia", kcalPorGrama: 0.30 },
    { nome: "Laranja", kcalPorGrama: 0.47 },
    { nome: "Manga", kcalPorGrama: 0.60 },
    { nome: "Abacate", kcalPorGrama: 1.60 },
    { nome: "Goiaba", kcalPorGrama: 0.68 },
    
    // Cereais e Grãos
    { nome: "Arroz", kcalPorGrama: 1.30 },
    { nome: "Arroz branco", kcalPorGrama: 1.30 },
    { nome: "Arroz integral", kcalPorGrama: 1.23 },
    { nome: "Feijão", kcalPorGrama: 1.43 },
    { nome: "Feijão preto", kcalPorGrama: 1.43 },
    { nome: "Feijão carioca", kcalPorGrama: 1.40 },
    { nome: "Lentilha", kcalPorGrama: 1.16 },
    { nome: "Grão de bico", kcalPorGrama: 1.64 },
    { nome: "Aveia", kcalPorGrama: 3.89 },
    { nome: "Trigo", kcalPorGrama: 3.40 },
    { nome: "Milho", kcalPorGrama: 0.86 },
    { nome: "Pão", kcalPorGrama: 2.65 },
    { nome: "Pão branco", kcalPorGrama: 2.65 },
    { nome: "Pão integral", kcalPorGrama: 2.47 },
    { nome: "Macarrão", kcalPorGrama: 1.31 },
    { nome: "Lasanha", kcalPorGrama: 1.50 },
    
    // Proteínas
    { nome: "Frango", kcalPorGrama: 1.65 },
    { nome: "Frango grelhado", kcalPorGrama: 1.65 },
    { nome: "Peito de frango", kcalPorGrama: 1.65 },
    { nome: "Coxa de frango", kcalPorGrama: 2.09 },
    { nome: "Carne bovina", kcalPorGrama: 2.50 },
    { nome: "Carne moída", kcalPorGrama: 2.50 },
    { nome: "Alcatra", kcalPorGrama: 2.06 },
    { nome: "Picanha", kcalPorGrama: 2.71 },
    { nome: "Filé mignon", kcalPorGrama: 2.24 },
    { nome: "Contrafilé", kcalPorGrama: 2.78 },
    { nome: "Porco", kcalPorGrama: 2.42 },
    { nome: "Pernil de porco", kcalPorGrama: 2.17 },
    { nome: "Bacon", kcalPorGrama: 5.41 },
    { nome: "Linguiça", kcalPorGrama: 3.01 },
    { nome: "Salsicha", kcalPorGrama: 3.33 },
    { nome: "Peixe", kcalPorGrama: 1.36 },
    { nome: "Salmão", kcalPorGrama: 2.08 },
    { nome: "Atum", kcalPorGrama: 1.30 },
    { nome: "Tilápia", kcalPorGrama: 0.96 },
    { nome: "Ovo", kcalPorGrama: 1.55 },
    { nome: "Clara de ovo", kcalPorGrama: 0.52 },
    { nome: "Gema de ovo", kcalPorGrama: 3.22 },
    
    // Laticínios
    { nome: "Leite", kcalPorGrama: 0.61 },
    { nome: "Leite integral", kcalPorGrama: 0.61 },
    { nome: "Leite desnatado", kcalPorGrama: 0.34 },
    { nome: "Leite condensado", kcalPorGrama: 3.21 },
    { nome: "Queijo", kcalPorGrama: 4.02 },
    { nome: "Queijo mussarela", kcalPorGrama: 2.80 },
    { nome: "Queijo cheddar", kcalPorGrama: 4.02 },
    { nome: "Queijo ricota", kcalPorGrama: 1.74 },
    { nome: "Queijo cottage", kcalPorGrama: 0.98 },
    { nome: "Iogurte", kcalPorGrama: 0.61 },
    { nome: "Iogurte natural", kcalPorGrama: 0.59 },
    { nome: "Iogurte grego", kcalPorGrama: 0.97 },
    { nome: "Nata", kcalPorGrama: 2.60 },
    { nome: "Cream cheese", kcalPorGrama: 3.42 },
    
    // Oleaginosas
    { nome: "Amendoim", kcalPorGrama: 5.67 },
    { nome: "Castanha", kcalPorGrama: 6.60 },
    { nome: "Castanha de caju", kcalPorGrama: 5.74 },
    { nome: "Nozes", kcalPorGrama: 6.54 },
    { nome: "Amêndoas", kcalPorGrama: 5.75 },
    { nome: "Pistache", kcalPorGrama: 5.60 },
    { nome: "Avelã", kcalPorGrama: 6.28 },
    { nome: "Macadâmia", kcalPorGrama: 7.18 },
    
    // Verduras e Legumes
    { nome: "Alface", kcalPorGrama: 0.15 },
    { nome: "Tomate", kcalPorGrama: 0.18 },
    { nome: "Cenoura", kcalPorGrama: 0.41 },
    { nome: "Batata", kcalPorGrama: 0.77 },
    { nome: "Batata doce", kcalPorGrama: 0.86 },
    { nome: "Cebola", kcalPorGrama: 0.40 },
    { nome: "Alho", kcalPorGrama: 1.49 },
    { nome: "Brócolis", kcalPorGrama: 0.34 },
    { nome: "Espinafre", kcalPorGrama: 0.23 },
    { nome: "Pepino", kcalPorGrama: 0.15 },
    { nome: "Beterraba", kcalPorGrama: 0.43 },
    { nome: "Abóbora", kcalPorGrama: 0.26 },
    { nome: "Berinjela", kcalPorGrama: 0.25 },
    { nome: "Pimentão", kcalPorGrama: 0.26 },
    { nome: "Vagem", kcalPorGrama: 0.31 },
    { nome: "Repolho", kcalPorGrama: 0.25 },
    { nome: "Couve-flor", kcalPorGrama: 0.25 },
    { nome: "Ervilha", kcalPorGrama: 0.81 },
    { nome: "Milho verde", kcalPorGrama: 0.86 },
    
    // Others
    { nome: "Azeite", kcalPorGrama: 8.84 },
    { nome: "Óleo", kcalPorGrama: 8.84 },
    { nome: "Manteiga", kcalPorGrama: 7.17 },
    { nome: "Mel", kcalPorGrama: 3.04 },
    { nome: "Açúcar", kcalPorGrama: 3.87 },
    { nome: "Açúcar refinado", kcalPorGrama: 3.87 },
    { nome: "Chocolate", kcalPorGrama: 5.46 },
    { nome: "Chocolate ao leite", kcalPorGrama: 5.35 },
    { nome: "Biscoito", kcalPorGrama: 4.88 },
    { nome: "Biscoito recheado", kcalPorGrama: 4.83 },
    { nome: "Batata frita", kcalPorGrama: 5.36 },
    { nome: "Pizza", kcalPorGrama: 2.66 },
    { nome: "Hambúrguer", kcalPorGrama: 2.95 },
    { nome: "Hot dog", kcalPorGrama: 2.90 },
    { nome: "Sorvete", kcalPorGrama: 2.07 },
    { nome: "Paçoca", kcalPorGrama: 4.82 },
    { nome: "Rapadura", kcalPorGrama: 3.78 },
    { nome: "Goiabada", kcalPorGrama: 2.84 },
    { nome: "Marmelo", kcalPorGrama: 2.90 },
    { nome: "Polenta", kcalPorGrama: 0.86 },
    { nome: "Torrada", kcalPorGrama: 4.07 }
];

// Função para buscar alimentos
function buscarAlimento() {
    const input = document.getElementById('searchAlimento');
    const resultados = document.getElementById('resultadosBusca');
    const termo = input.value.toLowerCase().trim();
    
    // Limpa resultados anteriores
    resultados.innerHTML = '';
    
    // Se o campo estiver vazio, esconde os resultados
    if (termo.length === 0) {
        resultados.classList.remove('active');
        return;
    }
    
    // Filtra alimentos que contêm o termo de busca
    const alimentosFiltrados = bancoAlimentos.filter(alimento => 
        alimento.nome.toLowerCase().includes(termo)
    );
    
    // Se não encontrar nenhum alimento
    if (alimentosFiltrados.length === 0) {
        resultados.innerHTML = '<div class="no-results">Nenhum alimento encontrado</div>';
        resultados.classList.add('active');
        return;
    }
    
    // Limita a mostra a 10 resultados
    const resultadosLimitados = alimentosFiltrados.slice(0, 10);
    
    // Cria os elementos de resultado
    resultadosLimitados.forEach(alimento => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <span class="food-name">${alimento.nome}</span>
            <span class="food-calories">${alimento.kcalPorGrama.toFixed(2)} <span class="kcal-label">kcal/g</span></span>
        `;
        
        // Adiciona evento de clique para preencher o campo
        item.onclick = function() {
            selecionarAlimento(alimento);
        };
        
        resultados.appendChild(item);
    });
    
    // Mostra os resultados
    resultados.classList.add('active');
}

// Função para selecionar um alimento e preencher o campo
function selecionarAlimento(alimento) {
    // Preenche o campo de nome do alimento
    document.getElementById('nomeAlimento').value = alimento.nome;
    
    // Preenche o campo de calorias por grama
    document.getElementById('caloriasPorGrama').value = alimento.kcalPorGrama.toFixed(2);
    
    // Limpa e esconde os resultados
    const resultados = document.getElementById('resultadosBusca');
    resultados.innerHTML = '';
    resultados.classList.remove('active');
    
    // Limpa o campo de busca
    document.getElementById('searchAlimento').value = '';
    
    // Dá foco ao campo de gramas para facilitar o uso
    document.getElementById('gramas').focus();
}

// Fecha os resultados quando clica fora
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.food-search-container');
    const resultados = document.getElementById('resultadosBusca');
    
    if (searchContainer && !searchContainer.contains(e.target)) {
        resultados.classList.remove('active');
    }
});

// Pesquisa em tempo real - ouve digitação no campo de busca
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchAlimento');
    if (searchInput) {
        searchInput.addEventListener('keyup', buscarAlimento);
    }
});
