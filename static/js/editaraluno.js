
const modalEditar = document.getElementById("editarAlunoModal");
const btnsEditar = document.querySelectorAll(".btn-editar-primary");
const closeEditar = document.querySelector(".close-button-editar");
const buscarEditar = document.getElementById("buscarEditar");
const camposEditar = document.getElementById("camposEditar");

let apiBuscar = "";
let apiEditar = "";

// Abrir modal
btnsEditar.forEach(btn => {
  btn.addEventListener("click", () => {
    apiBuscar = btn.getAttribute("data-api-busca");
    apiEditar = btn.getAttribute("data-api");
    modalEditar.style.display = "block";
    camposEditar.style.display = "none";
    document.getElementById("formEditarAluno").reset();
  });
});

// Fechar modal
closeEditar.addEventListener("click", () => {
  modalEditar.style.display = "none";
});

// Buscar aluno pela lupa
buscarEditar.addEventListener("click", async () => {
  const nome = document.getElementById("nomeEditar").value.trim();

  if (!nome) {
    alert("Digite o nome do aluno.");
    return;
  }

  try {
    const response = await fetch(`${apiBuscar}?nome=${encodeURIComponent(nome)}`);
    const data = await response.json();

    if (response.ok) {
      document.getElementById("escolaEditar").value = data.aluno.escola;
      document.getElementById("serieEditar").value = data.aluno.serie;
      document.getElementById("horarioEditar").value = data.aluno.horario;
      document.getElementById("enderecoEditar").value = data.aluno.endereco;
      document.getElementById("responsavelEditar").value = data.aluno.responsavel;
      document.getElementById("cidEditar").value = data.aluno.cid;

      camposEditar.style.display = "block";
    } else {
      alert(data.erro);
      camposEditar.style.display = "none";
    }
  } catch (error) {
    alert("Erro ao buscar aluno.");
    console.error(error);
  }
});

// Salvar alterações
document.getElementById("formEditarAluno").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nomeEditar").value.trim();
  const escola = document.getElementById("escolaEditar").value.trim();
  const serie = document.getElementById("serieEditar").value.trim();
  const horario = document.getElementById("horarioEditar").value.trim();
  const endereco = document.getElementById("enderecoEditar").value.trim();
  const responsavel = document.getElementById("responsavelEditar").value.trim();
  const cid = document.getElementById("cidEditar").value.trim();

  try {
    const response = await fetch(apiEditar, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, escola, serie, horario, endereco, responsavel, cid })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Aluno atualizado com sucesso!");
      modalEditar.style.display = "none";
      this.reset();
      camposEditar.style.display = "none";

      // Atualizar lista (opcional, se quiser pode condicionar conforme o roteiro)
      if (apiEditar.includes("roteiro1apae")) {
        carregarAlunosRoteiro1Apae();
      } else if (apiEditar.includes("roteiro3noa")) {
        carregarAlunosRoteiro3Noa();
      }

    } else {
      alert(data.erro);
    }
  } catch (error) {
    alert("Erro ao atualizar aluno.");
    console.error(error);
  }
});
