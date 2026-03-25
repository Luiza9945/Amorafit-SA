// Function to save form data to localStorage
function salvarDadosFormulario(idade, sexo, peso, altura, nivelAtividade, objetivo) {
  const dadosFormulario = {
    idade: idade,
    sexo: sexo,
    peso: peso,
    altura: altura,
    nivelAtividade: nivelAtividade,
    objetivo: objetivo
  };
  localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));
}

// Function to load form data from localStorage
function carregarDadosFormulario() {
  const dadosSalvos = localStorage.getItem('dadosFormulario');
  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);
    
    // Populate form fields
    document.getElementById('idade').value = dados.idade;
    document.getElementById('sexo').value = dados.sexo;
    document.getElementById('peso').value = dados.peso;
    document.getElementById('altura').value = dados.altura;
    document.getElementById('nivelAtividade').value = dados.nivelAtividade;
    document.getElementById('objetivo').value = dados.objetivo;
    
    // Calculate and display the result
    calcularTDEE(dados.idade, dados.sexo, dados.peso, dados.altura, dados.nivelAtividade, dados.objetivo);
    
    return true;
  }
  return false;
}

// Function to calculate TDEE
function calcularTDEE(idade, sexo, peso, altura, nivelAtividade, objetivo) {
  // Calculate BMR using Mifflin-St Jeor equation
  let bmr;
  if (sexo === 'masculino') {
    bmr = (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  } else {
    bmr = (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
  }

  // Calculate TDEE
  const tdee = Math.round(bmr * nivelAtividade);

  // Display result
  const resultadoDiv = document.getElementById('resultado');
  const gastoCaloriasSpan = document.getElementById('gastoCalorias');
  const gastoInfoP = document.getElementById('gastoInfo');

  gastoCaloriasSpan.textContent = tdee.toLocaleString('pt-BR');

  // Provide additional info based on objective
  let infoText = '';
  let caloriesToLose, caloriesToGain;
  
  switch (objetivo) {
    case 'emagrecer':
      caloriesToLose = tdee - 500;
      infoText = `Para emagrecer, recomenda-se consumir cerca de ${caloriesToLose.toLocaleString('pt-BR')} kcal/dia`;
      break;
    case 'manter':
      infoText = `Para manter seu peso, recomenda-se consumir cerca de ${tdee.toLocaleString('pt-BR')} kcal/dia`;
      break;
    case 'engordar':
      caloriesToGain = tdee + 500;
      infoText = `Para ganhar peso, recomenda-se consumir cerca de ${caloriesToGain.toLocaleString('pt-BR')} kcal/dia`;
      break;
  }

  gastoInfoP.textContent = infoText;
  resultadoDiv.style.display = 'block';

  // Save recommended calories to localStorage
  let recommendedCalories = tdee;
  if (objetivo === 'emagrecer') {
    recommendedCalories = caloriesToLose;
  } else if (objetivo === 'engordar') {
    recommendedCalories = caloriesToGain;
  }
  localStorage.setItem('metaCalorias', recommendedCalories);
}

// Load saved data when page loads
document.addEventListener('DOMContentLoaded', function() {
  carregarDadosFormulario();
});

// Form submit event
document.getElementById('formularioTDEE').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get values from form
  const idade = parseInt(document.getElementById('idade').value);
  const sexo = document.getElementById('sexo').value;
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const nivelAtividade = parseFloat(document.getElementById('nivelAtividade').value);
  const objetivo = document.getElementById('objetivo').value;

  // Save form data to localStorage
  salvarDadosFormulario(idade, sexo, peso, altura, nivelAtividade, objetivo);

  // Calculate and display result
  calcularTDEE(idade, sexo, peso, altura, nivelAtividade, objetivo);
});
