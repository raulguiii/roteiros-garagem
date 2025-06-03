// Função para carregar os atestados e exibir na tabela
function carregarAtestados() {
  fetch('/api/atestados')
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#tabela-atestados tbody');
      tbody.innerHTML = ''; // Limpa tabela antes de preencher

      data.forEach(item => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${item.aluno}</td>
          <td>${item.monitora}</td>
          <td>
            <a href="${item.arquivo}" target="_blank" rel="noopener noreferrer">
              <img src="${item.arquivo}" alt="Atestado de ${item.aluno}" style="max-width: 100px; max-height: 100px; border-radius: 4px;">
            </a>
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Erro ao carregar atestados:', err));
}

// Chamar essa função quando a aba for ativada
document.querySelector('[data-tab="atestados"]').addEventListener('click', () => {
  carregarAtestados();
});

// Botão de Atestado
const atestadoButtons = document.querySelectorAll('.btn-outline-atestado');
const atestadoModal = document.getElementById('atestadoModal');
const closeAtestadoButton = document.querySelector('.close-button-atestado');

// Abre o modal em qualquer aba
atestadoButtons.forEach(button => {
  button.addEventListener('click', () => {
    atestadoModal.style.display = 'block';
  });
});

// Fecha o modal
closeAtestadoButton.addEventListener('click', () => {
  atestadoModal.style.display = 'none';
});

// Ação do formulário de atestado com envio via API
document.getElementById('atestadoForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const aluno = document.getElementById('aluno').value.trim();
  const monitora = document.getElementById('monitora').value.trim();
  const fileInput = document.getElementById('fileUpload');

  if (!aluno || !monitora) {
    alert('Por favor, preencha os campos de aluno e monitora!');
    return;
  }

  if (fileInput.files.length === 0) {
    alert('Por favor, selecione um arquivo!');
    return;
  }

  const formData = new FormData();
  formData.append('aluno', aluno);
  formData.append('monitora', monitora);
  formData.append('file', fileInput.files[0]);

  // Envia para o backend
  fetch('/api/atestados', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        alert('Atestado enviado com sucesso!');
        carregarAtestados(); // Atualiza a tabela após envio
        atestadoModal.style.display = 'none';
        document.getElementById('atestadoForm').reset();
      } else {
        alert('Erro ao enviar atestado: ' + response.message);
      }
    })
    .catch(error => {
      console.error('Erro no envio do atestado:', error);
      alert('Ocorreu um erro ao enviar o atestado.');
    });
});
