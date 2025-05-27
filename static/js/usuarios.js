// Novo Comunicado
document.querySelector(".btn-primary").addEventListener("click", function () {
  document.getElementById("comunicadoModal").style.display = "block";
});

document.querySelector(".close-button-comunicado").addEventListener("click", function () {
  document.getElementById("comunicadoModal").style.display = "none";
});

window.onclick = function(event) {
  const modal = document.getElementById("comunicadoModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};



//Carregar tabela Usuários
document.addEventListener("DOMContentLoaded", function () {
  let usuariosCarregados = false;

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

      // Se for a aba de usuários e ainda não carregou os dados
      if (tabName === "usuarios" && !usuariosCarregados) {
        usuariosCarregados = true;

        fetch('/api/usuarios')
          .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar dados');
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
            console.error("Erro ao carregar usuários:", error);
          });
      }
    });
  });
});


document.getElementById("formComunicado").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const dataHora = document.getElementById("dataHora").value;

  fetch("/api/comunicado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      titulo: titulo,
      descricao: descricao,
      dataHora: dataHora
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Comunicado salvo com sucesso!");
      document.getElementById("formComunicado").reset();
      document.getElementById("comunicadoModal").style.display = "none";
      // aqui você pode atualizar uma lista de comunicados, se quiser exibir na mesma página
    } else {
      alert("Erro: " + data.message);
    }
  })
  .catch(err => {
    console.error("Erro ao salvar comunicado:", err);
    alert("Erro ao salvar comunicado.");
  });
});
