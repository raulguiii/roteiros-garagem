// ADICIONAR ALUNO
const modal = document.getElementById("modalAdicionarAluno");
const closeButton = document.querySelector(".close-button-adicionar");
const form = document.getElementById("formAdicionarAluno");

let apiEndpoint = "";

// Abrir modal
document.querySelectorAll(".btn-adicionar").forEach(button => {
  button.addEventListener("click", () => {
    apiEndpoint = button.getAttribute("data-api");
    modal.style.display = "block";
  });
});

// Fechar modal
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Enviar formulário
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    escola: document.getElementById("escola").value,
    serie: document.getElementById("serie").value,
    nome_completo: document.getElementById("nome_completo").value,
    horario: document.getElementById("horario").value,
    endereco: document.getElementById("endereco").value,
    responsavel: document.getElementById("responsavel").value,
    cid: document.getElementById("cid").value
  };

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao adicionar aluno.");
      return res.json();
    })
    .then(data => {
      alert("Aluno adicionado com sucesso!");
      form.reset();
      modal.style.display = "none";

      // Aqui você pode criar uma verificação para chamar a função de recarregar a tabela correspondente:
      if (apiEndpoint.includes("roteiro1apae")) carregarAlunosRoteiro1Apae();
      else if (apiEndpoint.includes("roteiro3noa")) carregarAlunosRoteiro3Noa();
      else if (apiEndpoint.includes("roteiro5")) carregarAlunosRoteiro5();
      // ... e assim por diante
    })
    .catch(err => {
      alert("Erro: " + err.message);
    });
});