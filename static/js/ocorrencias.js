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
