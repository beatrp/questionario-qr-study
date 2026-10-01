
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqhh4xL2clX-6LJe8QwX-bryc18KNgPIx7dgUTrwXUJyiT7biuVjbYiblJEIcSVSKH/exec';

document.addEventListener('DOMContentLoaded', () => {
  const stepRole = document.getElementById('step-role');
  const btnNextRole = document.getElementById('btnNextRole');
  const btnBacks = document.querySelectorAll('.btn-back');
  const form = document.getElementById('surveyForm');
  const thankYouScreen = document.getElementById('thankYouScreen');
  const progressBar = document.getElementById('progressBar');

  let selectedRole = '';
  let tcleConsentimento = '';

  const tcleModal = document.getElementById('tcleModal');
  const tcleCheckbox = document.getElementById('tcleCheckbox');
  const btnNextTcle = document.getElementById('btnNextTcle');

  tcleModal.addEventListener('cancel', (e) => e.preventDefault());
  tcleModal.showModal();

  tcleCheckbox.addEventListener('change', () => {
    btnNextTcle.disabled = !tcleCheckbox.checked;
  });

  btnNextTcle.addEventListener('click', () => {
    if (tcleConsentimento || !tcleCheckbox.checked) return;
    tcleConsentimento = 'Aceito participar';
    tcleModal.close();
    form.inert = false;
    stepRole.classList.add('active');
    stepRole.querySelector('input[name="cargo"]').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btnDeclineTcle').addEventListener('click', () => {
    if (tcleConsentimento) return;
    tcleConsentimento = 'Não aceito participar';
    tcleModal.close();
    form.classList.add('hidden');
    const declinedScreen = document.getElementById('declinedScreen');
    declinedScreen.classList.remove('hidden');
    declinedScreen.setAttribute('tabindex', '-1');
    declinedScreen.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Avançar do Filtro de Cargo para a Seção Específica
  btnNextRole.addEventListener('click', () => {
    if (tcleConsentimento !== 'Aceito participar') return;
    const roleRadio = document.querySelector('input[name="cargo"]:checked');
    if (!roleRadio) {
      alert('Por favor, selecione seu perfil antes de avançar.');
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
    } else if (selectedRole === 'Pais / Responsáveis') {
      document.getElementById('step-pais').classList.add('active');
    }

    form.querySelectorAll('input[name="nome"], input[name="email"]').forEach(input => {
      input.disabled = !input.closest('.form-step').classList.contains('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Botões de Voltar
  btnBacks.forEach(btn => {
    btn.addEventListener('click', () => {
      if (tcleConsentimento !== 'Aceito participar') return;
      document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
      form.querySelectorAll('input[name="nome"], input[name="email"]').forEach(input => {
        input.disabled = true;
      });
      stepRole.classList.add('active');
      progressBar.style.width = '20%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Envio do Formulário para o Google Sheets
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (tcleConsentimento !== 'Aceito participar') return;

    if (SCRIPT_URL === 'COLE_SEU_WEB_APP_URL_AQUI' || !SCRIPT_URL) {
      alert('Atenção: A URL do Google Apps Script ainda não foi configurada no script.js!');
      return;
    }

    const submitBtn = form.querySelector('.form-step.active button[type="submit"]');
    if (!submitBtn || !form.reportValidity()) return;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Enviando respostas...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.set('tcle_consentimento', 'Aceito participar');
    formData.append('TCLE_Versao', 'QRStudy-2026-09');
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
