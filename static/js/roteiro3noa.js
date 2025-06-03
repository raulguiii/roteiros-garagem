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


// -------- REMOVER ALUNO - Giovana e Jussimar --------

const modalRemover3noa = document.getElementById("removerAlunoModal3noa");
const btnRemover3noa = document.querySelector("#giovana-jussimar .btn-remover-outline");
const closeRemover3noa = document.querySelector(".close-button-remover-3noa");
const btnApagar3noa = document.getElementById("btnApagar3noa");
const confirmarRemocao3noa = document.getElementById("confirmarRemocao3noa");
const formRemoverAluno3noa = document.getElementById("formRemoverAluno3noa");
const inputNome3noa = document.getElementById("nomeRemover3noa");
const inputConfirmar3noa = document.getElementById("confirmarNome3noa");
const btnBuscar3noa = document.getElementById("btnBuscar3noa");

// Abrir modal
btnRemover3noa.addEventListener("click", () => {
  modalRemover3noa.style.display = "block";
  confirmarRemocao3noa.style.display = "none";
});

// Fechar modal
closeRemover3noa.addEventListener("click", () => {
  modalRemover3noa.style.display = "none";
});

// Buscar aluno
btnBuscar3noa.addEventListener("click", () => {
  const nome = inputNome3noa.value.trim();
  if (!nome) {
    alert("Digite o nome do aluno para buscar.");
    return;
  }

  fetch(`/api/alunos_roteiro3noa`)
    .then(response => response.json())
    .then(data => {
      const alunos = data.alunos;
      const alunoEncontrado = alunos.find(aluno => aluno.nome_completo.toLowerCase() === nome.toLowerCase());

      if (alunoEncontrado) {
        confirmarRemocao3noa.style.display = "block";
        alert(`Aluno "${nome}" encontrado. Confirme o nome abaixo para remover.`);
      } else {
        confirmarRemocao3noa.style.display = "none";
        alert("Aluno não encontrado.");
      }
    })
    .catch(error => {
      console.error("Erro ao buscar aluno:", error);
      alert("Erro ao buscar aluno.");
    });
});

// Clique no botão "Apagar" exibe o campo de confirmação
btnApagar3noa.addEventListener("click", () => {
  confirmarRemocao3noa.style.display = "block";
});

// Remover aluno
formRemoverAluno3noa.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = inputNome3noa.value.trim();
  const confirmacao = inputConfirmar3noa.value.trim();

  if (nome && nome === confirmacao) {
    fetch(`/api/alunos_roteiro3noa/${encodeURIComponent(nome)}`, {
      method: "DELETE"
    })
      .then(response => {
        if (response.ok) {
          alert(`Aluno "${nome}" removido com sucesso.`);
          modalRemover3noa.style.display = "none";
          formRemoverAluno3noa.reset();
          confirmarRemocao3noa.style.display = "none";
          carregarAlunosRoteiro3Noa(); // Atualiza a tabela
        } else {
          return response.json().then(data => {
            throw new Error(data.erro || "Erro ao remover aluno.");
          });
        }
      })
      .catch(error => {
        alert(error.message);
      });
  } else {
    alert("Os nomes não coincidem. Verifique e tente novamente.");
  }
});

