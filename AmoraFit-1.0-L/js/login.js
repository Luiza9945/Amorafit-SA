document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-login');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Validation
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Get stored user from localStorage
    const usuarioStored = localStorage.getItem('usuario');
    
    if (!usuarioStored) {
      alert('Nenhum usuário encontrado. Por favor, cadastre-se primeiro.');
      return;
    }

    // Parse the stored user
    const usuario = JSON.parse(usuarioStored);

    // Validate credentials
    if (usuario.email === email && usuario.senha === senha) {
      // Login successful - redirect to calculadora.html
      window.location.href = 'calculadora.html';
    } else {
      alert('E-mail ou senha incorretos. Por favor, tente novamente.');
    }
  });
});
