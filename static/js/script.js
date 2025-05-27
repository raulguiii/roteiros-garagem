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



// MODAL DE OBSERVAÇÃO
const observacaoButtons = document.querySelectorAll('.btn-observacao');
const observacaoModal = document.getElementById('observacaoModal');
const closeObservacaoButton = document.querySelector('.close-button-observacao');
const listaObservacoes = document.getElementById('listaObservacoes');
let observacoes = []; // Armazena as observações temporariamente

// Abre o modal de observações
observacaoButtons.forEach(button => {
  button.addEventListener('click', () => {
    observacaoModal.style.display = 'block';
    renderizarObservacoes();
  });
});

// Fecha o modal
closeObservacaoButton.addEventListener('click', () => {
  observacaoModal.style.display = 'none';
});

// Fecha ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target == observacaoModal) {
    observacaoModal.style.display = 'none';
  }
});

// Submissão do formulário de observação
document.getElementById('observacaoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const novaObs = document.getElementById('novaObservacao').value.trim();

  if (novaObs) {
    observacoes.push(novaObs);
    document.getElementById('novaObservacao').value = '';
    renderizarObservacoes();
    alert('Observação adicionada com sucesso!');
  }
});

// Renderiza as observações
function renderizarObservacoes() {
  listaObservacoes.innerHTML = '';
  if (observacoes.length === 0) {
    listaObservacoes.innerHTML = '<li>Nenhuma observação registrada.</li>';
    return;
  }

  observacoes.forEach((obs, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${obs}`;
    listaObservacoes.appendChild(li);
  });
}

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



const modalAdicionar = document.getElementById("adicionarAlunoModal");
  const btnAdicionar = document.querySelector(".btn-adicionar-primary");
  const closeAdicionar = document.querySelector(".close-button-adicionar");

  btnAdicionar.addEventListener("click", () => {
    modalAdicionar.style.display = "block";
  });

  closeAdicionar.addEventListener("click", () => {
    modalAdicionar.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modalAdicionar) {
      modalAdicionar.style.display = "none";
    }
  });


  const modalRemover = document.getElementById("removerAlunoModal");
  const btnRemover = document.querySelector(".btn-remover-outline");
  const closeRemover = document.querySelector(".close-button-remover");
  const btnApagar = document.getElementById("btnApagar");
  const confirmarRemocao = document.getElementById("confirmarRemocao");
  const formRemoverAluno = document.getElementById("formRemoverAluno");

  // Abrir modal
  btnRemover.addEventListener("click", () => {
    modalRemover.style.display = "block";
    confirmarRemocao.style.display = "none";
  });

  // Fechar modal
  closeRemover.addEventListener("click", () => {
    modalRemover.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modalRemover) {
      modalRemover.style.display = "none";
    }
  });

  // Mostrar campo de confirmação
  btnApagar.addEventListener("click", () => {
    confirmarRemocao.style.display = "block";
  });

  // Lógica de confirmação
  formRemoverAluno.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nomeRemover").value.trim();
    const confirmacao = document.getElementById("confirmarNome").value.trim();

    if (nome && nome === confirmacao) {
      alert(`Aluno "${nome}" removido com sucesso.`);
      modalRemover.style.display = "none";
      formRemoverAluno.reset();
    } else {
      alert("Os nomes não coincidem. Verifique e tente novamente.");
    }
  });

const modalEditar = document.getElementById("editarAlunoModal");
  const btnEditar = document.querySelector(".btn-editar-primary");
  const closeEditar = document.querySelector(".close-button-editar");
  const buscarEditar = document.getElementById("buscarEditar");
  const camposEditar = document.getElementById("camposEditar");

  // Abrir modal
  btnEditar.addEventListener("click", () => {
    modalEditar.style.display = "block";
    camposEditar.style.display = "none";
  });

  // Fechar modal
  closeEditar.addEventListener("click", () => {
    modalEditar.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modalEditar) {
      modalEditar.style.display = "none";
    }
  });

  // Mostrar campos ao clicar no ícone de busca
  buscarEditar.addEventListener("click", () => {
    camposEditar.style.display = "block";
  });

  // Enviar formulário (pode ser ajustado depois para enviar via AJAX/Flask)
  document.getElementById("formEditarAluno").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Edições salvas com sucesso!");
    modalEditar.style.display = "none";
    this.reset();
    camposEditar.style.display = "none";
  });

document.addEventListener('DOMContentLoaded', function () {
  const modalFrequencia = document.getElementById('frequenciaModal');
  const closeFrequencia = document.querySelector('.close-button-frequencia');

  document.querySelectorAll('.btn-frequencia').forEach(botao => {
    botao.addEventListener('click', () => {
      modalFrequencia.style.display = 'block';
    });
  });

  closeFrequencia.addEventListener('click', () => {
    modalFrequencia.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modalFrequencia) {
      modalFrequencia.style.display = 'none';
    }
  });

  // Geração do calendário
  document.getElementById('gerarCalendario').addEventListener('click', () => {
    const calendario = document.getElementById('calendarioFrequencia');
    calendario.innerHTML = ''; // Limpa o calendário anterior

    const mesAno = document.getElementById('mesAno').value;
    if (!mesAno) return;

    const [ano, mes] = mesAno.split('-').map(Number);
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay(); // 0 = domingo

    // Preenche espaço vazio antes do primeiro dia
    for (let i = 0; i < primeiroDiaSemana; i++) {
      const vazio = document.createElement('div');
      calendario.appendChild(vazio);
    }

    // Cria os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const divDia = document.createElement('div');
      divDia.style.border = '1px solid #ccc';
      divDia.style.padding = '5px';
      divDia.style.borderRadius = '6px';
      divDia.style.background = '#f9f9f9';
      divDia.innerHTML = `
        <strong>${dia}</strong><br>
        <textarea placeholder="Frequência..." rows="2" style="width: 100%; resize: none;"></textarea>
      `;
      calendario.appendChild(divDia);
    }
  });
});

function toggleCollapse(id) {
    const content = document.getElementById(id);
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
}