document.addEventListener("DOMContentLoaded", function () {
  let usuariosCarregados = false;
  let ocorrenciasCarregadas = false;

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Esconde todas as abas
      document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
      });

      // Mostra a aba clicada
      const tabToShow = document.getElementById(tabName);
      if (tabToShow) {
        tabToShow.style.display = "block";
      }

      if (tabName === "usuarios" && !usuariosCarregados) {
        usuariosCarregados = true;

        fetch('/api/usuarios')
          .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar usuários');
            return response.json();
          })
          .then(data => {
            const tbody = document.getElementById("usuarios-tbody");
            tbody.innerHTML = "";

            data.usuarios.forEach(usuario => {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${usuario.nome_completo}</td>
                <td>${usuario.celular}</td>
                <td>${usuario.cpf}</td>
                <td>${usuario.roteiro}</td>
                <td>${usuario.destino}</td>
                <td>${usuario.cargo}</td>
                <td>${usuario.senha}</td>
              `;
              tbody.appendChild(row);
            });
          })
          .catch(error => {
            console.error(error);
          });
      }

      if (tabName === "ocorrencias" && !ocorrenciasCarregadas) {
        ocorrenciasCarregadas = true;

        fetch('/api/ocorrencias')
          .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar ocorrências');
            return response.json();
          })
          .then(data => {
            const tbody = document.getElementById("ocorrencias-tbody");
            tbody.innerHTML = "";

            data.ocorrencias.forEach(ocorrencia => {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${new Date(ocorrencia.data).toLocaleDateString()}</td>
                <td>${ocorrencia.monitora || ''}</td>
                <td>${ocorrencia.motorista || ''}</td>
                <td>${ocorrencia.aluno || ''}</td>
                <td>${ocorrencia.escola || ''}</td>
                <td>${ocorrencia.descricao}</td>
              `;
              tbody.appendChild(row);
            });
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  });
});


// CRIAR NOVA OCORRENCIA
// Seleciona o botão de ocorrência
const ocorrenciaButton = document.querySelector('#ana-rafael .btn-primary');
const modal = document.getElementById('ocorrenciaModal');
const closeButton = document.querySelector('.close-button');

// Abre o modal ao clicar no botão Ocorrência
ocorrenciaButton.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Fecha o modal ao clicar no X
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha o modal se clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

document.getElementById('ocorrenciaForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    data: new Date().toISOString().split('T')[0],  // data atual (yyyy-mm-dd)
    monitora: document.getElementById('monitoraOcorrencia').value,
    motorista: document.getElementById('motoristaOcorrencia').value,
    aluno: document.getElementById('alunoOcorrencia').value,
    escola: document.getElementById('escolaOcorrencia').value,
    descricao: document.getElementById('descricaoOcorrencia').value
  };

  fetch('/api/ocorrencias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      alert('Ocorrência registrada com sucesso!');
      modal.style.display = 'none';
    } else {
      alert('Erro: ' + response.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert('Erro ao enviar a ocorrência.');
  });
});
