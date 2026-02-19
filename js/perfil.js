 const editarBtn = document.getElementById('editarBtn');
    const inputFoto = document.getElementById('inputFoto');
    const fotoPerfil = document.getElementById('fotoPerfil');

    editarBtn.addEventListener('click', () => inputFoto.click());

    inputFoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          fotoPerfil.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('sairBtn').addEventListener('click', () => {
      alert('Você saiu da sua conta.');
      window.location.href = 'login.html';
    });