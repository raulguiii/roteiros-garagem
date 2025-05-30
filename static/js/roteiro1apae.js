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

window.addEventListener("click", (event) => {
  if (event.target == document.getElementById("observacaoModal")) {
    document.getElementById("observacaoModal").style.display = "none";
  }
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


                        //  ADICIONAR ALUNO 

const modalAdicionar = document.getElementById("adicionarAlunoModal");
  const btnAdicionar = document.querySelector(".btn-adicionar-primary");
  const closeAdicionar = document.querySelector(".close-button-adicionar");

  btnAdicionar.addEventListener("click", () => {
    modalAdicionar.style.display = "block";
  });

  closeAdicionar.addEventListener("click", () => {
    modalAdicionar.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modalAdicionar) {
      modalAdicionar.style.display = "none";
    }
  });

 const formAdicionarAluno = document.getElementById("formAdicionarAluno");

  formAdicionarAluno.addEventListener("submit", function (e) {
    e.preventDefault(); // Impede o recarregamento da página

    // Captura os valores do formulário
    const escola = document.getElementById("escola").value;
    const serie = document.getElementById("serie").value;
    const nome_completo = document.getElementById("nomeAluno").value;
    const horario = document.getElementById("horario").value;
    const endereco = document.getElementById("endereco").value;
    const responsavel = document.getElementById("responsavel").value;
    const cid = document.getElementById("cid").value;

    // Envia os dados para a API
    fetch("/api/alunos_roteiro1apae", {
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
        formAdicionarAluno.reset();
        modalAdicionar.style.display = "none";
        carregarAlunosRoteiro1Apae(); // <- Recarrega a tabela após adicionar
        })
      .catch((err) => {
        alert("Erro: " + err.message);
      });
  });


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



                        //  REMOVER ALUNO 

const modalRemover = document.getElementById("removerAlunoModal");
const btnRemover = document.querySelector(".btn-remover-outline");
const closeRemover = document.querySelector(".close-button-remover");
const btnApagar = document.getElementById("btnApagar");
const confirmarRemocao = document.getElementById("confirmarRemocao");
const formRemoverAluno = document.getElementById("formRemoverAluno");
const inputNome = document.getElementById("nomeRemover");
const inputConfirmar = document.getElementById("confirmarNome");
const btnBuscar = document.querySelector(".fa-magnifying-glass");

//  Abrir modal
btnRemover.addEventListener("click", () => {
  modalRemover.style.display = "block";
  confirmarRemocao.style.display = "none";
});

// Fechar modal
closeRemover.addEventListener("click", () => {
  modalRemover.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == modalRemover) {
    modalRemover.style.display = "none";
  }
});

// Buscar aluno
btnBuscar.addEventListener("click", () => {
  const nome = inputNome.value.trim();
  if (!nome) {
    alert("Digite o nome do aluno para buscar.");
    return;
  }

  fetch(`/api/alunos_roteiro1apae`)
    .then(response => response.json())
    .then(data => {
      const alunos = data.alunos;
      const alunoEncontrado = alunos.find(aluno => aluno.nome_completo.toLowerCase() === nome.toLowerCase());

      if (alunoEncontrado) {
        confirmarRemocao.style.display = "block";
        alert(`Aluno "${nome}" encontrado. Confirme o nome abaixo para remover.`);
      } else {
        confirmarRemocao.style.display = "none";
        alert("Aluno não encontrado.");
      }
    })
    .catch(error => {
      console.error("Erro ao buscar aluno:", error);
      alert("Erro ao buscar aluno.");
    });
});

//  Remover aluno
formRemoverAluno.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = inputNome.value.trim();
  const confirmacao = inputConfirmar.value.trim();

  if (nome && nome === confirmacao) {
    fetch(`/api/alunos_roteiro1apae/${encodeURIComponent(nome)}`, {
      method: "DELETE"
    })
      .then(response => {
        if (response.ok) {
          alert(`Aluno "${nome}" removido com sucesso.`);
          modalRemover.style.display = "none";
          formRemoverAluno.reset();
          confirmarRemocao.style.display = "none";
          carregarAlunosRoteiro1Apae();
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