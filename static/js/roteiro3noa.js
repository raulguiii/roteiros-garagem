document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('[data-tab="giovana-jussimar"]').addEventListener("click", function () {
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    document.getElementById("giovana-jussimar").style.display = "block";

    carregarAlunosRoteiro3Noa();
  });
});

function carregarAlunosRoteiro3Noa() {
  fetch('/api/alunos_roteiro3noa')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById("tabela-alunos-roteiro3noa-body");
      tbody.innerHTML = "";

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
            <button class="btn btn-outline btn-sm btn-observacao-3noa" data-id="${aluno.id}">
              <i class="fa-solid fa-comment-dots"></i> Observações
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

// Abrir modal de observações
let alunoSelecionadoId3noa = null;

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-observacao-3noa");
  if (btn) {
    alunoSelecionadoId3noa = btn.getAttribute("data-id");

    fetch(`/api/observacoes3noa/${alunoSelecionadoId3noa}`)
      .then(res => res.json())
      .then(data => {
        renderizarObservacoes3noa(data.observacoes);
        document.getElementById("observacaoModal3noa").style.display = "block";
      });
  }
});

document.getElementById('observacaoForm3noa').addEventListener('submit', function(e) {
  e.preventDefault();
  const texto = document.getElementById('novaObservacao3noa').value.trim();

  if (texto && alunoSelecionadoId3noa) {
    fetch("/api/observacoes3noa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aluno_id: alunoSelecionadoId3noa, observacao: texto })
    })
    .then(() => {
      document.getElementById('novaObservacao3noa').value = '';
      return fetch(`/api/observacoes3noa/${alunoSelecionadoId3noa}`);
    })
    .then(res => res.json())
    .then(data => renderizarObservacoes3noa(data.observacoes));
  }
});

function renderizarObservacoes3noa(observacoes) {
  const lista = document.getElementById('listaObservacoes3noa');
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

document.querySelector(".close-button-observacao-3noa").addEventListener("click", () => {
  document.getElementById("observacaoModal3noa").style.display = "none";
});


// ADICIONAR ALUNO - Giovana e Jussimar
const modalAdicionar3noa = document.getElementById("adicionarAlunoModal3noa");
const btnAdicionar3noa = document.querySelector("#giovana-jussimar .btn-adicionar-primary");
const closeAdicionar3noa = document.querySelector(".close-button-adicionar-3noa");

btnAdicionar3noa.addEventListener("click", () => {
  modalAdicionar3noa.style.display = "block";
});

closeAdicionar3noa.addEventListener("click", () => {
  modalAdicionar3noa.style.display = "none";
});

const formAdicionarAluno3noa = document.getElementById("formAdicionarAluno3noa");

formAdicionarAluno3noa.addEventListener("submit", function (e) {
  e.preventDefault();

  const escola = document.getElementById("escola3noa").value;
  const serie = document.getElementById("serie3noa").value;
  const nome_completo = document.getElementById("nomeAluno3noa").value;
  const horario = document.getElementById("horario3noa").value;
  const endereco = document.getElementById("endereco3noa").value;
  const responsavel = document.getElementById("responsavel3noa").value;
  const cid = document.getElementById("cid3noa").value;

  fetch("/api/alunos_roteiro3noa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      escola,
      serie,
      nome_completo,
      horario,
      endereco,
      responsavel,
      cid,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao adicionar aluno.");
      return res.json();
    })
    .then((data) => {
      alert("Aluno adicionado com sucesso!");
      formAdicionarAluno3noa.reset();
      modalAdicionar3noa.style.display = "none";
      carregarAlunosRoteiro3Noa(); // Recarrega a tabela
    })
    .catch((err) => {
      alert("Erro: " + err.message);
    });
});
