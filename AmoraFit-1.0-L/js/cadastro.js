document.addEventListener('DOMContentLoaded', function() {
  const btnCadastrar = document.getElementById('btn-cadastrar');

  btnCadastrar.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get form values
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar').value;

    // Validation
    if (!nome || !email || !senha || !confirmar) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmar) {
      alert('As senhas não conferem. Por favor, tente novamente.');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Save user information to localStorage
    const usuario = {
      nome: nome,
      email: email,
      senha: senha
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // If all validations pass, redirect to formulario.html
    window.location.href = 'formulario.html';
  });
});
