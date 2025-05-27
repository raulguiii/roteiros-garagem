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
function carregarComunicados() {
  fetch('/api/comunicados')
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        const ul = document.querySelector('.notification-list');
        ul.innerHTML = ''; // limpa a lista antes

        data.comunicados.forEach(c => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${c.titulo}</strong><br>
            ${c.descricao}<br>
            <small>${c.data_hora_formatada}h</small>
          `;
          ul.appendChild(li);
        });

        // Atualiza badge com a quantidade de comunicados
        const badge = document.querySelector('.notification .badge');
        badge.textContent = data.comunicados.length;
      }
      else {
        console.error('Erro ao carregar comunicados:', data.message);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar comunicados:', err);
    });
}

function toggleNotifications() {
  const dropdown = document.getElementById("notificationDropdown");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    carregarComunicados();
    dropdown.style.display = "block";
  }
}

  // Fecha o dropdown ao clicar fora
  document.addEventListener("click", function(event) {
    const notification = document.querySelector(".notification");
    const dropdown = document.getElementById("notificationDropdown");

    if (!notification.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });




function abrirMensagemDiretaModal() {
  document.getElementById("mensagemDiretaModal").style.display = "block";

  // Preenche os usuários
  fetch('/api/usuarios')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("usuarioDestino");
      select.innerHTML = "";
      data.usuarios.forEach(usuario => {
        const opt = document.createElement("option");
        opt.value = usuario.id;
        opt.textContent = usuario.nome_completo;
        select.appendChild(opt);
      });
    });
}

document.getElementById("formMensagemDireta").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("tituloDireta").value.trim();
  const descricao = document.getElementById("descricaoDireta").value.trim();
  const dataHora = document.getElementById("dataHoraDireta").value;
  const usuarioDestino = document.getElementById("usuarioDestino").value;

  fetch("/api/mensagem-direta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, dataHora, usuarioDestino })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Mensagem direta enviada!");
      document.getElementById("formMensagemDireta").reset();
      document.getElementById("mensagemDiretaModal").style.display = "none";
    } else {
      alert("Erro: " + data.message);
    }
  })
  .catch(err => {
    console.error("Erro ao enviar mensagem direta:", err);
    alert("Erro ao enviar mensagem direta.");
  });
});

function toggleMensagensDiretas() {
  const dropdown = document.getElementById("mensagensDiretasDropdown");
  if (dropdown.style.display === "none") {
    fetchMensagensDiretas();
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

function fetchMensagensDiretas() {
  fetch('/api/mensagens-diretas')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("listaMensagensDiretas");
      const semMensagens = document.getElementById("semMensagens");
      lista.innerHTML = "";

      if (data.success && data.mensagens.length > 0) {
        semMensagens.style.display = "none";
        data.mensagens.forEach(msg => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${msg.titulo}</strong><br><small>${msg.data_hora_formatada}</small><br>${msg.descricao}`;
          lista.appendChild(li);
        });
      } else {
        semMensagens.style.display = "block";
      }
    })
    .catch(err => {
      console.error("Erro ao buscar mensagens diretas:", err);
    });
}

// Fechar dropdown ao clicar fora
window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("mensagensDiretasDropdown");
  const icon = document.getElementById("iconeEnvelope");
  if (!icon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});