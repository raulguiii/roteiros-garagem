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

// Botão de Atestado
const atestadoButton = document.querySelector('#ana-rafael .btn-outline');
const atestadoModal = document.getElementById('atestadoModal');
const closeAtestadoButton = document.querySelector('.close-button-atestado');

// Abre o modal ao clicar no botão Atestado
atestadoButton.addEventListener('click', () => {
  atestadoModal.style.display = 'block';
});

// Fecha o modal ao clicar no X
closeAtestadoButton.addEventListener('click', () => {
  atestadoModal.style.display = 'none';
});

// Fecha se clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target == atestadoModal) {
    atestadoModal.style.display = 'none';
  }
});

// Ação do formulário de atestado (simples)
document.getElementById('atestadoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileUpload');
  if (fileInput.files.length > 0) {
    alert('Atestado enviado com sucesso!');
    atestadoModal.style.display = 'none';
    fileInput.value = '';
  } else {
    alert('Por favor, selecione um arquivo!');
  }
});
