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
