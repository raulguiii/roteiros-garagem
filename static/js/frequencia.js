//                          FREQUÊNCIA
const frequenciaBtn = document.querySelector('.btn-frequencia-outline');
const frequenciaModal = document.getElementById('frequenciaModal');
const closeFrequencia = document.querySelector('.close-button-frequencia');

if (frequenciaBtn) {
  frequenciaBtn.addEventListener('click', () => {
    frequenciaModal.style.display = 'block';
    carregarTabelaFrequencia();
  });
}

if (closeFrequencia) {
  closeFrequencia.addEventListener('click', () => {
    frequenciaModal.style.display = 'none';
  });
}

function carregarTabelaFrequencia() {
  const tabelaBody = document.querySelector('.frequencia-table tbody');
  tabelaBody.innerHTML = ""; // Limpa a tabela antes de carregar

  fetch('/api/alunos_roteiro1apae')
    .then(response => response.json())
    .then(data => {
      const alunos = data.alunos;

      alunos.forEach(aluno => {
        console.log("Aluno carregado:", aluno); // Debug: verifique se o id existe e é correto

        const tr = document.createElement('tr');
        tr.dataset.idAluno = aluno.id; // atribui id_aluno no data attribute

        const tdNome = document.createElement('td');
        tdNome.textContent = aluno.nome_completo;
        tr.appendChild(tdNome);

        const dias = ['5/5','6/5','7/5','8/5','9/5','12/5','13/5','14/5','15/5','16/5'];
        dias.forEach(() => {
          const td = document.createElement('td');
          const select = document.createElement('select');

          const optionVazia = document.createElement('option');
          optionVazia.value = '';
          optionVazia.text = '';
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

      carregarFrequenciasSalvas();
    })
    .catch(err => {
      console.error('Erro ao carregar alunos:', err);
    });
}

document.getElementById('frequenciaForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const linhas = document.querySelectorAll('.frequencia-table tbody tr');
  const dados = [];

  linhas.forEach(linha => {
    const nome = linha.querySelector('td').textContent.trim();
    const selects = linha.querySelectorAll('select');
    const datas = ['2025-05-05','2025-05-06','2025-05-07','2025-05-08','2025-05-09','2025-05-12','2025-05-13','2025-05-14','2025-05-15','2025-05-16'];

    selects.forEach((select, index) => {
      const valor = select.value;
      if (valor) {
        dados.push({
          nome_completo: nome,
          data: datas[index],
          status: valor
        });
      }
    });
  });

  fetch('/api/frequencia_roteiro1apae', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({frequencias: dados})
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'ok') {
      alert('Frequência salva com sucesso!');
      document.querySelectorAll('select').forEach(sel => sel.disabled = true);
    } else {
      alert('Erro ao salvar: ' + result.erro);
    }
  })
  .catch(err => {
    console.error('Erro no envio da frequência:', err);
  });
});

function carregarFrequenciasSalvas() {
  fetch('/api/frequencia_roteiro1apae/roteiro1apae')
    .then(res => res.json())
    .then(dados => {
      console.log("Frequências carregadas:", dados); // Debug

      dados.forEach(item => {
        const idAluno = item.id_aluno;
        const data = item.data;
        const status = item.status;

        const linha = Array.from(document.querySelectorAll('.frequencia-table tbody tr'))
          .find(tr => tr.dataset.idAluno == idAluno);

        if (!linha) {
          console.warn("Linha para aluno ID", idAluno, "não encontrada");
          return;
        }

        const datas = ['2025-05-05','2025-05-06','2025-05-07','2025-05-08','2025-05-09','2025-05-12','2025-05-13','2025-05-14','2025-05-15','2025-05-16'];

        // Corrige formato da data para ISO (YYYY-MM-DD)
        const dataISO = new Date(data).toISOString().split('T')[0];

        const index = datas.indexOf(dataISO);

        if (index === -1) {
          console.warn("Data", data, "convertida para", dataISO, "não encontrada na lista de datas");
          return;
        }

        const select = linha.querySelectorAll('select')[index];
        if (!select) {
          console.warn("Select não encontrado para index", index);
          return;
        }

        select.value = status;
        select.disabled = true;
      });

    })
    .catch(erro => {
      console.error("Erro ao carregar frequências:", erro);
    });
}