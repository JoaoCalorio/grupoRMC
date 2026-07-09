

const CHECKMARK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;



function maskCPF(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

function maskPhone(v) {
  const d = v.replace(/\D/g, '').substring(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
}

function maskCEP(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2')
    .substring(0, 9);
}

function onlyNumbers(e) {
  const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
  if (allowed.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}


function showError(input, msg) {
  if (!input) return;
  input.classList.add('is-error');
  input.classList.remove('is-valid');
  let el = input.parentElement.querySelector('.field-error-msg');
  if (!el) {
    el = document.createElement('span');
    el.className = 'field-error-msg';
    input.parentElement.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'flex';
}

function clearError(input) {
  if (!input) return;
  input.classList.remove('is-error');
  const el = input.parentElement.querySelector('.field-error-msg');
  if (el) el.style.display = 'none';
}

function markValid(input) {
  if (!input) return;
  clearError(input);
  if (input.value.trim() !== '') input.classList.add('is-valid');
}



const RULES = {
  cpf: {
    mask: maskCPF,
    validate: v => v.replace(/\D/g, '').length === 11,
    msg: 'CPF deve ter 11 dígitos (000.000.000-00)'
  },
  telefone: {
    mask: maskPhone,
    validate: v => { const d = v.replace(/\D/g, ''); return d.length === 10 || d.length === 11; },
    msg: 'Telefone inválido — use (00) 00000-0000'
  },
  cep: {
    mask: maskCEP,
    validate: v => v.replace(/\D/g, '').length === 8,
    msg: 'CEP deve ter 8 dígitos (00000-000)'
  },
  email: {
    mask: null,
    validate: v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    msg: 'E-mail inválido'
  },
  emailRequired: {
    mask: null,
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    msg: 'E-mail inválido'
  },
  nome: {
    mask: null,
    validate: v => v.trim().length >= 3,
    msg: 'Nome muito curto'
  },
  required: {
    mask: null,
    validate: v => v.trim() !== '',
    msg: 'Campo obrigatório'
  },
  date: {
    mask: null,
    validate: v => v !== '',
    msg: 'Selecione uma data'
  },
  select: {
    mask: null,
    validate: v => v !== '',
    msg: 'Selecione uma opção'
  }
};

function attachRule(input, ruleKey) {
  if (!input) return;
  const rule = RULES[ruleKey];
  if (!rule) return;

  if (rule.mask) {
    input.addEventListener('input', () => {
      const start = input.selectionStart;
      input.value = rule.mask(input.value);
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  input.addEventListener('blur', () => {
    if (!rule.validate(input.value)) {
      showError(input, rule.msg);
    } else {
      markValid(input);
    }
    checkStep2();
    checkStep3();
  });

  input.addEventListener('focus', () => clearError(input));
}



function setStep(n, state) {
  const item   = document.getElementById('step-' + n);
  const circle = document.getElementById('step-circle-' + n);
  if (!item || !circle) return;
  item.classList.remove('active', 'done');
  if (state === 'done') {
    item.classList.add('done');
    circle.innerHTML = CHECKMARK;
  } else if (state === 'active') {
    item.classList.add('active');
    circle.textContent = n;
  } else {
    circle.textContent = n;
  }
}



function selectSize(btn, n) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');

  setStep(1, 'done');
  setStep(2, 'active');

  renderMembers(n);
  checkStep3();
}

function renderMembers(n) {
  const container = document.getElementById('members-container');
  container.innerHTML = '';

  if (!n || n < 1) {
    showMembersPlaceholder();
    return;
  }

  for (let i = 1; i <= n; i++) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.style.animationDelay = (i - 1) * 60 + 'ms';
    card.innerHTML = `
      <div class="member-card-header">
        <div class="member-badge">${i}</div>
        <span>Integrante ${i}</span>
      </div>
      <div class="member-card-body">
        <div class="form-grid">
          <div class="field span-2">
            <label>Nome completo <span class="required">*</span></label>
            <input type="text" name="membro[${i}][nome]" data-rule="nome" placeholder="Nome do integrante" />
          </div>
          <div class="field">
            <label>CPF <span class="required">*</span></label>
            <input type="text" name="membro[${i}][cpf]" data-rule="cpf" placeholder="000.000.000-00" maxlength="14" />
          </div>
          <div class="field">
            <label>Data de nascimento <span class="required">*</span></label>
            <input type="date" name="membro[${i}][nascimento]" data-rule="date" />
          </div>
          <div class="field span-2">
            <label>E-mail <span class="hint">(opcional)</span></label>
            <input type="email" name="membro[${i}][email]" data-rule="email" placeholder="exemplo@email.com" />
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);

    card.querySelectorAll('[data-rule]').forEach(input => {
      attachRule(input, input.dataset.rule);
      if (input.dataset.rule === 'cpf') input.addEventListener('keydown', onlyNumbers);
    });
  }
}

function showMembersPlaceholder() {
  const container = document.getElementById('members-container');
  container.innerHTML = `
    <div class="members-placeholder">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p>Selecione o número de integrantes acima para exibir os formulários</p>
    </div>
  `;
}



const RESP_REQUIRED = [
  'resp-nome', 'resp-cpf', 'resp-nascimento',
  'resp-email', 'resp-telefone', 'resp-sabendo',
  'resp-logradouro', 'resp-numero', 'resp-bairro',
  'resp-cep', 'resp-cidade', 'resp-estado'
];

function checkStep2() {
  const allFilled = RESP_REQUIRED.every(id => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '' && !el.classList.contains('is-error');
  });

  if (allFilled) {
    setStep(2, 'done');
    const step3 = document.getElementById('step-3');
    if (!step3.classList.contains('done') && !step3.classList.contains('active')) {
      setStep(3, 'active');
    }
  } else {
    const step2 = document.getElementById('step-2');
    if (step2.classList.contains('done')) {
      setStep(2, 'active');
      const step3 = document.getElementById('step-3');
      const step4 = document.getElementById('step-4');
      if (step3.classList.contains('done')) setStep(3, 'active');
      if (step4.classList.contains('done') || step4.classList.contains('active')) setStep(4, '');
    }
  }
}

function checkStep3() {
  const container = document.getElementById('members-container');
  const required = container.querySelectorAll('input[data-rule="nome"], input[data-rule="cpf"], input[data-rule="date"]');
  if (required.length === 0) return;

  const allOk = Array.from(required).every(el =>
    el.value.trim() !== '' && !el.classList.contains('is-error')
  );

  if (allOk) {
    setStep(3, 'done');
    const step4 = document.getElementById('step-4');
    if (!step4.classList.contains('done')) setStep(4, 'active');
  } else {
    const step3 = document.getElementById('step-3');
    if (step3.classList.contains('done')) {
      setStep(3, 'active');
      setStep(4, '');
    }
  }
}


const BACKEND_URL = '/api/usuarios';

async function confirmarAgendamento(event) {
  if (event && event.preventDefault) event.preventDefault();

  const btn = document.getElementById('btn-confirmar');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('loading');
  }

  const responsavel = {
    nome: document.getElementById('resp-nome').value.trim(),
    cpf: document.getElementById('resp-cpf').value.trim(),
    dataDeNascimento: document.getElementById('resp-nascimento').value,
    email: document.getElementById('resp-email').value.trim(),
    telefone: document.getElementById('resp-telefone').value.trim(),
    logradouro: document.getElementById('resp-logradouro').value.trim(),
    numero: document.getElementById('resp-numero').value.trim(),
    complemento: document.getElementById('resp-complemento').value.trim(),
    bairro: document.getElementById('resp-bairro').value.trim(),
    cep: document.getElementById('resp-cep').value.trim(),
    cidade: document.getElementById('resp-cidade').value.trim(),
    estado: document.getElementById('resp-estado').value.trim(),
    sabendo: document.getElementById('resp-sabendo').value
  };

  const integrantes = Array.from(document.querySelectorAll('#members-container .member-card')).map((card, index) => {
    const nomeEl = card.querySelector(`input[name="membro[${index + 1}][nome]"]`);
    const cpfEl = card.querySelector(`input[name="membro[${index + 1}][cpf]"]`);
    const nascEl = card.querySelector(`input[name="membro[${index + 1}][nascimento]"]`);
    const emailEl = card.querySelector(`input[name="membro[${index + 1}][email]"]`);
    return {
      nome: nomeEl ? nomeEl.value.trim() : '',
      cpf: cpfEl ? cpfEl.value.trim() : '',
      dataDeNascimento: nascEl ? nascEl.value : '',
      email: emailEl ? emailEl.value.trim() : ''
    };
  }).filter(m => m.nome || m.cpf || m.email);


  const respErr = RESP_REQUIRED.map(id => document.getElementById(id)).find(el => !el || el.value.trim() === '' || el.classList.contains('is-error'));
  if (respErr) {
    alert('Preencha corretamente os dados do responsável antes de confirmar.');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
    return;
  }
  const memberRequired = Array.from(document.querySelectorAll('#members-container input[data-rule="nome"], #members-container input[data-rule="cpf"], #members-container input[data-rule="date"]'));
  const badMember = memberRequired.find(i => i.value.trim() === '' || i.classList.contains('is-error'));
  if (badMember) {
    alert('Preencha corretamente os dados dos integrantes.');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
    return;
  }

  const payload = { ...responsavel, integrantes };

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Erro ${res.status}`);
    }

    const data = await res.json();
    alert('Agendamento confirmado com sucesso!');
    clearForm();
    console.log('Resposta do servidor:', data);
    setStep(4, 'done');
  } catch (err) {
    console.error(err);
    alert('Erro ao confirmar agendamento. Verifique o console.');
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  }
}

function clearForm() {
  const formEls = document.querySelectorAll('input, select, textarea');
  formEls.forEach(el => {
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
    el.classList.remove('is-valid', 'is-error');
  });
  document.querySelectorAll('.field-error-msg').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  setStep(1, 'active');
  setStep(2, '', '');
  setStep(3, '', '');
  setStep(4, '', '');
  showMembersPlaceholder();
}



document.addEventListener('DOMContentLoaded', () => {
  attachRule(document.getElementById('resp-cpf'), 'cpf');
  attachRule(document.getElementById('resp-telefone'), 'telefone');
  attachRule(document.getElementById('resp-cep'), 'cep');
  attachRule(document.getElementById('resp-email'), 'emailRequired');

  ['resp-nome', 'resp-logradouro', 'resp-bairro', 'resp-cidade'].forEach(id => {
    attachRule(document.getElementById(id), 'nome');
  });

  const numero = document.getElementById('resp-numero');
  if (numero) {
    numero.addEventListener('keydown', onlyNumbers);
    attachRule(numero, 'required');
  }

  ['resp-sabendo', 'resp-estado'].forEach(id => {
    attachRule(document.getElementById(id), 'select');
  });

  attachRule(document.getElementById('resp-nascimento'), 'date');

  const membersContainer = document.getElementById('members-container');
  if (membersContainer) {
    membersContainer.addEventListener('blur', e => {
      if (e.target && e.target.matches('[data-rule]')) checkStep3();
    }, true);

    membersContainer.addEventListener('input', e => {
      if (e.target && e.target.matches('[data-rule]')) checkStep3();
    });
  }

  const btn = document.getElementById('btn-confirmar');
  if (btn) {
    btn.addEventListener('click', confirmarAgendamento);
  }

  showMembersPlaceholder();
});