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
