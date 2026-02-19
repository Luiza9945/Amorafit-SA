document.getElementById('formularioTDEE').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get values from form
  const idade = parseInt(document.getElementById('idade').value);
  const sexo = document.getElementById('sexo').value;
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const nivelAtividade = parseFloat(document.getElementById('nivelAtividade').value);
  const objetivo = document.getElementById('objetivo').value;

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
  switch (objetivo) {
    case 'emagrecer':
      const caloriesToLose = tdee - 500;
      infoText = `Para emagrecer, recomenda-se consumir cerca de ${caloriesToLose.toLocaleString('pt-BR')} kcal/dia`;
      break;
    case 'manter':
      infoText = `Para manter seu peso, recomenda-se consumir cerca de ${tdee.toLocaleString('pt-BR')} kcal/dia`;
      break;
    case 'engordar':
      const caloriesToGain = tdee + 500;
      infoText = `Para ganhar peso, recomenda-se consumir cerca de ${caloriesToGain.toLocaleString('pt-BR')} kcal/dia`;
      break;
  }

  gastoInfoP.textContent = infoText;
  resultadoDiv.style.display = 'block';
});
