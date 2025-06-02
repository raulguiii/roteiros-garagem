// Função para abrir e fechar a sidebar no mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Fecha a sidebar ao clicar fora dela (opcional, para melhorar usabilidade)
document.addEventListener('click', function (event) {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.menu-toggle');
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnToggle = toggle.contains(event.target);

  if (!isClickInsideSidebar && !isClickOnToggle) {
    sidebar.classList.remove('active');
  }
});

// Função para alternar abas e conteúdo
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove a classe active dos itens do menu
    navItems.forEach(i => i.classList.remove('active'));
    // Adiciona active no item clicado
    item.classList.add('active');

    // Esconde todos os conteúdos
    tabContents.forEach(tc => (tc.style.display = 'none'));

    // Mostra o conteúdo correto
    const tabToShow = item.getAttribute('data-tab');
    document.getElementById(tabToShow).style.display = 'block';

    // Opcional: Fecha a sidebar ao clicar em uma aba no mobile
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });
});

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  }

  // Fecha o menu se clicar fora
  document.addEventListener('click', function(event) {
    const profile = document.querySelector('.user-profile');
    const menu = document.getElementById('userMenu');
    if (!profile.contains(event.target)) {
      menu.style.display = 'none';
    }
  });

function toggleCollapse(id) {
    const content = document.getElementById(id);
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
}


// Abrir e Fechar Modal de Frequência
const frequenciaBtn = document.querySelector('.btn-frequencia-outline');
const frequenciaModal = document.getElementById('frequenciaModal');
const closeFrequencia = document.querySelector('.close-button-frequencia');

if (frequenciaBtn) {
  frequenciaBtn.addEventListener('click', () => {
    frequenciaModal.style.display = 'block';
  });
}

closeFrequencia.addEventListener('click', () => {
  frequenciaModal.style.display = 'none';
});



document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('.frequencia-table tbody');

  fetch('/api/alunos_roteiro1apae')
    .then(response => response.json())
    .then(data => {
      const alunos = data.alunos;

      alunos.forEach(aluno => {
        const tr = document.createElement('tr');

        // Coluna nome do aluno
        const tdNome = document.createElement('td');
        tdNome.textContent = aluno.nome_completo;
        tr.appendChild(tdNome);

        // Gerar selects para cada dia
        const dias = ['5/5','6/5','7/5','8/5','9/5','12/5','13/5','14/5','15/5','16/5'];
        dias.forEach(() => {
          const td = document.createElement('td');
          const select = document.createElement('select');

          // opção vazia para não selecionar nada inicialmente
          const optionVazia = document.createElement('option');
          optionVazia.value = '';
          optionVazia.text = '';  // pode ser vazio ou "Selecione"
          optionVazia.selected = true;
          select.appendChild(optionVazia);

          ['PF','PP','FF','FP','A','S'].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.text = opt;
            select.appendChild(option);
          });

          td.appendChild(select);
          tr.appendChild(td);
        });

        tabelaBody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar alunos:', err);
    });
});


