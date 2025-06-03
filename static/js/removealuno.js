const modalRemover = document.getElementById("removerAlunoModal");
const closeRemover = document.querySelector(".close-button-remover");
const formRemover = document.getElementById("formRemoverAluno");
const inputNomeRemover = document.getElementById("nomeRemover");
const inputConfirmarNome = document.getElementById("confirmarNome");
const btnApagar = document.getElementById("btnApagar");
const divConfirmar = document.getElementById("confirmarRemocao");
const lupaRemover = document.querySelector(".lupa-remover");

let apiEndpointRemover = "";

// Abrir modal remover
document.querySelectorAll(".btn-remover-outline").forEach(button => {
  button.addEventListener("click", () => {
    apiEndpointRemover = button.getAttribute("data-api");
    modalRemover.style.display = "block";
    divConfirmar.style.display = "none";
    formRemover.reset();
  });
});

// Fechar modal remover
closeRemover.addEventListener("click", () => {
  modalRemover.style.display = "none";
});

// Lupa — Buscar aluno antes de permitir a remoção
lupaRemover.addEventListener("click", () => {
  const nome = inputNomeRemover.value.trim();

  if (!nome) {
    alert("Digite o nome do aluno para buscar.");
    return;
  }

  fetch(apiEndpointRemover)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar alunos.");
      }
      return response.json();
    })
    .then(data => {
      const alunos = data.alunos || [];

      // Verificar se o nome existe na lista
      const alunoEncontrado = alunos.find(aluno => aluno.nome_completo.toLowerCase() === nome.toLowerCase());

      if (alunoEncontrado) {
        alert(`Aluno "${alunoEncontrado.nome_completo}" encontrado. Confirme o nome abaixo para prosseguir com a remoção.`);
        divConfirmar.style.display = "block";
      } else {
        alert(`Aluno "${nome}" não encontrado na tabela.`);
        divConfirmar.style.display = "none";
      }
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro na busca: " + error.message);
    });
});

// Clicar em "Apagar" mostra confirmação
btnApagar.addEventListener("click", () => {
  const nome = inputNomeRemover.value.trim();
  if (nome) {
    divConfirmar.style.display = "block";
  } else {
    alert("Preencha o nome do aluno antes de apagar.");
  }
});

// Confirmar remoção
formRemover.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = inputNomeRemover.value.trim();
  const confirmar = inputConfirmarNome.value.trim();

  if (nome === "" || confirmar === "") {
    alert("Preencha os dois campos.");
    return;
  }

  if (nome !== confirmar) {
    alert("Os nomes não coincidem. Verifique.");
    return;
  }

  fetch(`${apiEndpointRemover}/${encodeURIComponent(nome)}`, {
    method: "DELETE",
  })
    .then(response => {
      if (response.ok) {
        alert(`Aluno "${nome}" removido com sucesso.`);
        modalRemover.style.display = "none";
        formRemover.reset();

        // Atualiza a tabela correta
        if (apiEndpointRemover.includes("roteiro1apae")) carregarAlunosRoteiro1Apae();
        else if (apiEndpointRemover.includes("roteiro3noa")) carregarAlunosRoteiro3Noa();
        else if (apiEndpointRemover.includes("roteiro5")) carregarAlunosRoteiro5();
        // ... Adiciona mais conforme suas rotas
      } else {
        return response.json().then(data => {
          throw new Error(data.erro || "Erro ao remover aluno.");
        });
      }
    })
    .catch(error => {
      alert("Erro: " + error.message);
      });
});