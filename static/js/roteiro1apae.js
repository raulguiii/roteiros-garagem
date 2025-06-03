//              GET ROTEIRO 1 APAE
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('[data-tab="ana-rafael"]').addEventListener("click", function () {
    // Mostrar conteúdo da aba
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    document.getElementById("ana-rafael").style.display = "block";

    // Carregar alunos sempre que abrir a aba
    carregarAlunosRoteiro1Apae();
  });
});

function carregarAlunosRoteiro1Apae() {
  fetch('/api/alunos_roteiro1apae')
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar dados.");
      return response.json();
    })
    .then(data => {
      const tbody = document.getElementById("tabela-alunos-roteiro1apae-body");
      tbody.innerHTML = ""; // Limpa a tabela antes de preencher

      data.alunos.forEach(aluno => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${aluno.escola}</td>
          <td>${aluno.serie || ''}</td>
          <td>${aluno.nome_completo}</td>
          <td>${aluno.horario}</td>
          <td>${aluno.endereco}</td>
          <td>${aluno.responsavel}</td>
          <td>${aluno.cid}</td>
          <td>
            <button class="btn btn-outline btn-sm btn-observacao" data-id="${aluno.id}">
              <i class="fa-solid fa-comment-dots"></i> Observações
            </button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar alunos:", error);
      alert("Erro ao carregar alunos.");
    });
}

let alunoSelecionadoId = null;

// Abrir modal e carregar observações específicas
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-observacao");
  if (btn) {
    alunoSelecionadoId = btn.getAttribute("data-id");

    fetch(`/api/observacoes/${alunoSelecionadoId}`)
      .then(res => res.json())
      .then(data => {
        renderizarObservacoes(data.observacoes);
        document.getElementById("observacaoModal").style.display = "block";
      });
  }
});

// Fechar modal
document.querySelector(".close-button-observacao").addEventListener("click", () => {
  document.getElementById("observacaoModal").style.display = "none";
});


// Enviar nova observação para o backend
document.getElementById('observacaoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const texto = document.getElementById('novaObservacao').value.trim();

  if (texto && alunoSelecionadoId) {
    fetch("/api/observacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aluno_id: alunoSelecionadoId, observacao: texto })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById('novaObservacao').value = '';
      return fetch(`/api/observacoes/${alunoSelecionadoId}`);
    })
    .then(res => res.json())
    .then(data => renderizarObservacoes(data.observacoes));
  }
});

// Renderizar lista no modal
function renderizarObservacoes(observacoes) {
  const lista = document.getElementById('listaObservacoes');
  lista.innerHTML = '';

  if (!observacoes || observacoes.length === 0) {
    lista.innerHTML = '<li>Nenhuma observação registrada.</li>';
    return;
  }

  observacoes.forEach((obs, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${obs.observacao}`;
    lista.appendChild(li);
  });
}
