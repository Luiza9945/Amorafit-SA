// Function to recalculate TDEE
function recalcularTDEE(idade, sexo, peso, altura, nivelAtividade, objetivo) {
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (sexo === 'masculino') {
        bmr = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
    } else {
        bmr = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
    }

    // Calculate TDEE
    const tdee = Math.round(bmr * nivelAtividade);

    // Calculate recommended calories based on goal
    let recommendedCalories = tdee;
    if (objetivo === 'emagrecer') {
        recommendedCalories = tdee - 500;
    } else if (objetivo === 'engordar') {
        recommendedCalories = tdee + 500;
    }
    
    // Save to localStorage
    localStorage.setItem('metaCalorias', recommendedCalories);
    
    return recommendedCalories;
}

// Function to get texto do nível de atividade
function getAtividadeTexto(nivelAtividade) {
    let atividadeTexto = '';
    switch(nivelAtividade) {
        case '1.2': atividadeTexto = 'Sedentário'; break;
        case '1.375': atividadeTexto = 'Levemente ativo'; break;
        case '1.55': atividadeTexto = 'Moderadamente ativo'; break;
        case '1.725': atividadeTexto = 'Muito ativo'; break;
        case '1.9': atividadeTexto = 'Extremamente ativo'; break;
        default: atividadeTexto = '-';
    }
    return atividadeTexto;
}

// Function to get texto do objetivo
function getObjetivoTexto(objetivo) {
    let objetivoTexto = '';
    switch(objetivo) {
        case 'emagrecer': objetivoTexto = 'Emagrecer'; break;
        case 'manter': objetivoTexto = 'Manter peso'; break;
        case 'engordar': objetivoTexto = 'Ganhar peso'; break;
        default: objetivoTexto = '-';
    }
    return objetivoTexto;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    
    // Carregar dados do usuário do localStorage
    const usuarioStored = localStorage.getItem('usuario');
    
    if (usuarioStored) {
        const usuario = JSON.parse(usuarioStored);
        
        // Atualizar o nome do usuário
        const nomeElement = document.getElementById('nomeUsuario');
        if (nomeElement && usuario.nome) {
            nomeElement.textContent = usuario.nome;
        }
        
        // Atualizar o email do usuário
        const emailElement = document.getElementById('emailUsuario');
        if (emailElement && usuario.email) {
            emailElement.textContent = usuario.email;
        }
    } else {
        // Se não houver usuário logado, redirecionar para login
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados do formulário (idade, peso, altura, etc.)
    const dadosFormularioStored = localStorage.getItem('dadosFormulario');
    if (dadosFormularioStored) {
        const dados = JSON.parse(dadosFormularioStored);
        
        // Atualizar idade
        const idadeElement = document.getElementById('idadeUsuario');
        if (idadeElement && dados.idade) {
            idadeElement.textContent = dados.idade;
        }
        
        // Atualizar peso
        const pesoElement = document.getElementById('pesoUsuario');
        if (pesoElement && dados.peso) {
            pesoElement.textContent = dados.peso;
        }
        
        // Atualizar altura
        const alturaElement = document.getElementById('alturaUsuario');
        if (alturaElement && dados.altura) {
            alturaElement.textContent = dados.altura;
        }
        
        // Atualizar nível de atividade
        const atividadeElement = document.getElementById('atividadeUsuario');
        if (atividadeElement && dados.nivelAtividade) {
            atividadeElement.textContent = getAtividadeTexto(dados.nivelAtividade);
        }
        
        // Atualizar objetivo
        const objetivoElement = document.getElementById('objetivoUsuario');
        if (objetivoElement && dados.objetivo) {
            objetivoElement.textContent = getObjetivoTexto(dados.objetivo);
        }
    }

    const editarBtn = document.getElementById('editarBtn');
    const atualizarDadosBtn = document.getElementById('atualizarDadosBtn');
    
    console.log('Buttons found:', editarBtn, atualizarDadosBtn);

    document.getElementById('sairBtn').addEventListener('click', () => {
      alert('Você saiu da sua conta.');
      window.location.href = 'login.html';
    });

    // ========== Modal 1: Editar Perfil (Nome e Email) ==========
    const modalEditar = document.getElementById('modalEditar');
    const fecharModal = document.getElementById('fecharModal');
    const cancelarEdicao = document.getElementById('cancelarEdicao');
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    
    const novoNomeInput = document.getElementById('novoNome');
    const novoEmailInput = document.getElementById('novoEmail');

    // Abrir modal de edição de perfil (nome e email)
    editarBtn.addEventListener('click', function() {
        console.log('Editar perfil clicked');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            novoNomeInput.value = usuario.nome || '';
            novoEmailInput.value = usuario.email || '';
        }
        modalEditar.style.display = 'block';
    });

    function fecharModalEditar() {
        modalEditar.style.display = 'none';
    }

    fecharModal.addEventListener('click', fecharModalEditar);
    cancelarEdicao.addEventListener('click', fecharModalEditar);

    window.addEventListener('click', function(event) {
        if (event.target === modalEditar) {
            fecharModalEditar();
        }
    });

    // Salvar alterações do perfil (nome e email)
    formEditarPerfil.addEventListener('submit', function(e) {
        e.preventDefault();

        const novoNome = novoNomeInput.value.trim();
        const novoEmail = novoEmailInput.value.trim();

        if (!novoNome || !novoEmail) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Atualizar dados do usuário (nome e email)
        const usuarioAtual = JSON.parse(localStorage.getItem('usuario'));
        usuarioAtual.nome = novoNome;
        usuarioAtual.email = novoEmail;
        localStorage.setItem('usuario', JSON.stringify(usuarioAtual));

        // Atualizar visualização na página
        document.getElementById('nomeUsuario').textContent = novoNome;
        document.getElementById('emailUsuario').textContent = novoEmail;

        alert('Perfil atualizado com sucesso!');
        fecharModalEditar();
    });

    // ========== Modal 2: Atualizar Dados (Idade, Peso, Altura, Atividade, Objetivo) ==========
    const modalAtualizarDados = document.getElementById('modalAtualizarDados');
    console.log('Modal atualizar dados:', modalAtualizarDados);
    
    const fecharModalDados = document.getElementById('fecharModalDados');
    const cancelarAtualizacao = document.getElementById('cancelarAtualizacao');
    const formAtualizarDados = document.getElementById('formAtualizarDados');
    
    const novaIdadeInput = document.getElementById('novaIdade');
    const novoPesoInput = document.getElementById('novoPeso');
    const novaAlturaInput = document.getElementById('novaAltura');
    const novoNivelAtividadeInput = document.getElementById('novoNivelAtividade');
    const novoObjetivoInput = document.getElementById('novoObjetivo');

    // Abrir modal de atualização de dados
    if (atualizarDadosBtn) {
        atualizarDadosBtn.addEventListener('click', function() {
            console.log('Atualizar dados clicked');
            const dadosFormulario = JSON.parse(localStorage.getItem('dadosFormulario') || '{}');
            novaIdadeInput.value = dadosFormulario.idade || '';
            novoPesoInput.value = dadosFormulario.peso || '';
            novaAlturaInput.value = dadosFormulario.altura || '';
            novoNivelAtividadeInput.value = dadosFormulario.nivelAtividade || '1.2';
            novoObjetivoInput.value = dadosFormulario.objetivo || 'manter';
            
            modalAtualizarDados.style.display = 'block';
            console.log('Modal should be visible now');
        });
    }

    function fecharModalAtualizarDados() {
        modalAtualizarDados.style.display = 'none';
    }

    if (fecharModalDados) {
        fecharModalDados.addEventListener('click', fecharModalAtualizarDados);
    }
    if (cancelarAtualizacao) {
        cancelarAtualizacao.addEventListener('click', fecharModalAtualizarDados);
    }

    window.addEventListener('click', function(event) {
        if (event.target === modalAtualizarDados) {
            fecharModalAtualizarDados();
        }
    });

    // Salvar alterações dos dados (idade, peso, altura, etc.)
    if (formAtualizarDados) {
        formAtualizarDados.addEventListener('submit', function(e) {
            e.preventDefault();

            const novaIdade = parseInt(novaIdadeInput.value);
            const novoPeso = parseFloat(novoPesoInput.value);
            const novaAltura = parseFloat(novaAlturaInput.value);
            const novoNivelAtividade = parseFloat(novoNivelAtividadeInput.value);
            const novoObjetivo = novoObjetivoInput.value;

            if (!novaIdade || !novoPeso || !novaAltura) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Obter o sexo do usuário dos dados salvos
            const dadosFormularioAtual = JSON.parse(localStorage.getItem('dadosFormulario') || '{}');
            const sexo = dadosFormularioAtual.sexo || 'feminino';
            
            const novosDadosFormulario = {
                idade: novaIdade,
                sexo: sexo,
                peso: novoPeso,
                altura: novaAltura,
                nivelAtividade: novoNivelAtividade,
                objetivo: novoObjetivo
            };
            localStorage.setItem('dadosFormulario', JSON.stringify(novosDadosFormulario));

            // Recalcular TDEE e atualizar meta de calorias
            recalcularTDEE(novaIdade, sexo, novoPeso, novaAltura, novoNivelAtividade, novoObjetivo);

            // Atualizar visualização na página
            document.getElementById('idadeUsuario').textContent = novaIdade;
            document.getElementById('pesoUsuario').textContent = novoPeso;
            document.getElementById('alturaUsuario').textContent = novaAltura;
            document.getElementById('atividadeUsuario').textContent = getAtividadeTexto(String(novoNivelAtividade));
            document.getElementById('objetivoUsuario').textContent = getObjetivoTexto(novoObjetivo);

            alert('Dados atualizados com sucesso! O limite de calorias foi recalculado.');
            fecharModalAtualizarDados();
        });
    }
});
