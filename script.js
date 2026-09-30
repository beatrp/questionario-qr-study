
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqhh4xL2clX-6LJe8QwX-bryc18KNgPIx7dgUTrwXUJyiT7biuVjbYiblJEIcSVSKH/exec';

document.addEventListener('DOMContentLoaded', () => {
  const stepRole = document.getElementById('step-role');
  const btnNextRole = document.getElementById('btnNextRole');
  const btnBacks = document.querySelectorAll('.btn-back');
  const form = document.getElementById('surveyForm');
  const thankYouScreen = document.getElementById('thankYouScreen');
  const progressBar = document.getElementById('progressBar');

  let selectedRole = '';

  // Avançar do Filtro de Cargo para a Seção Específica
  btnNextRole.addEventListener('click', () => {
    const roleRadio = document.querySelector('input[name="cargo"]:checked');
    if (!roleRadio) {
      alert('Por favor, selecione sua função antes de avançar.');
      return;
    }

    selectedRole = roleRadio.value;
    stepRole.classList.remove('active');

    // Atualiza barra de progresso para 100% no formulário ativo
    progressBar.style.width = '100%';

    if (selectedRole === 'Direção / Gestão') {
      document.getElementById('step-direcao').classList.add('active');
    } else if (selectedRole === 'Secretaria / Administração') {
      document.getElementById('step-secretaria').classList.add('active');
    } else if (selectedRole === 'Inspetor / Portaria') {
      document.getElementById('step-portaria').classList.add('active');
    } else if (selectedRole === 'Professor') {
      document.getElementById('step-professor').classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Botões de Voltar
  btnBacks.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
      stepRole.classList.add('active');
      progressBar.style.width = '20%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Envio do Formulário para o Google Sheets
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (SCRIPT_URL === 'COLE_SEU_WEB_APP_URL_AQUI' || !SCRIPT_URL) {
      alert('Atenção: A URL do Google Apps Script ainda não foi configurada no script.js!');
      return;
    }

    const submitBtn = form.querySelector('.form-step.active button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Enviando respostas...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.append('Data_Hora', new Date().toLocaleString('pt-BR'));

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(() => {
      form.classList.add('hidden');
      thankYouScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      console.error('Erro no envio:', error);
      alert('Ocorreu um erro ao salvar as respostas. Por favor, tente novamente.');
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    });
  });
});