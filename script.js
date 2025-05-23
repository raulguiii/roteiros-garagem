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

// Seleciona o botão de ocorrência
const ocorrenciaButton = document.querySelector('#ana-rafael .btn-primary');
const modal = document.getElementById('ocorrenciaModal');
const closeButton = document.querySelector('.close-button');

// Abre o modal ao clicar no botão Ocorrência
ocorrenciaButton.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Fecha o modal ao clicar no X
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha o modal se clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Ação do formulário (você pode adaptar para enviar os dados via backend depois)
document.getElementById('ocorrenciaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Ocorrência enviada com sucesso!');
  modal.style.display = 'none';
});
