// ─────────────────────────────────────────────────────────────────
// CHECKMARK SVG
// ─────────────────────────────────────────────────────────────────
const CHECKMARK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
// (ícone removido — feito por CSS puro)

// ─────────────────────────────────────────────────────────────────
// MÁSCARAS
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// SOMENTE NÚMEROS (bloqueia teclas não-numéricas)
// ─────────────────────────────────────────────────────────────────
function onlyNumbers(e) {
  // Permitir: backspace, delete, tab, setas, ctrl+a/c/v/x
  const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
  if (allowed.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

// ─────────────────────────────────────────────────────────────────
// FEEDBACK DE ERRO / VÁLIDO
// ─────────────────────────────────────────────────────────────────
function showError(input, msg) {
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
  input.classList.remove('is-error');
  const el = input.parentElement.querySelector('.field-error-msg');
  if (el) el.style.display = 'none';
}

function markValid(input) {
  clearError(input);
  if (input.value.trim() !== '') input.classList.add('is-valid');
}

// ─────────────────────────────────────────────────────────────────
// REGRAS DE VALIDAÇÃO
// ─────────────────────────────────────────────────────────────────
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

// Aplica máscara + valida no blur
function attachRule(input, ruleKey) {
  const rule = RULES[ruleKey];

  if (rule.mask) {
    input.addEventListener('input', () => {
      const pos = input.selectionStart;
      input.value = rule.mask(input.value);
    });
  }

  input.addEventListener('blur', () => {
    if (!rule.validate(input.value)) {
      showError(input, rule.msg);
    } else {
      markValid(input);
    }
    checkStep2();
  });

  input.addEventListener('focus', () => clearError(input));
}

// ─────────────────────────────────────────────────────────────────
// STEP MANAGEMENT
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// STEP 1 — Tamanho do grupo
// ─────────────────────────────────────────────────────────────────
function selectSize(btn, n) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  setStep(1, 'done');
  setStep(2, 'active');

  const container = document.getElementById('members-container');
  container.innerHTML = '';

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

    // Anexar regras nos novos inputs
    card.querySelectorAll('[data-rule]').forEach(input => {
      const ruleKey = input.dataset.rule;
      attachRule(input, ruleKey);
    });
  }

  checkStep3();
}

// ─────────────────────────────────────────────────────────────────
// STEP 2 — Responsável
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// STEP 3 — Integrantes
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// STEP 4 — Confirmação
// ─────────────────────────────────────────────────────────────────
function confirmarAgendamento() {
  setStep(4, 'done');
}

// ─────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Campos com máscara
  attachRule(document.getElementById('resp-cpf'),      'cpf');
  attachRule(document.getElementById('resp-telefone'), 'telefone');
  attachRule(document.getElementById('resp-cep'),      'cep');
  attachRule(document.getElementById('resp-email'),    'emailRequired');

  // Somente texto obrigatório
  ['resp-nome', 'resp-logradouro', 'resp-bairro', 'resp-cidade'].forEach(id => {
    attachRule(document.getElementById(id), 'nome');
  });

  // Somente números no campo Número
  const numero = document.getElementById('resp-numero');
  numero.addEventListener('keydown', onlyNumbers);
  attachRule(numero, 'required');

  // Selects obrigatórios
  ['resp-sabendo', 'resp-estado'].forEach(id => {
    attachRule(document.getElementById(id), 'select');
  });

  // Data de nascimento
  attachRule(document.getElementById('resp-nascimento'), 'date');

  // Event delegation no container de integrantes
  document.getElementById('members-container').addEventListener('blur', e => {
    if (e.target.matches('[data-rule]')) checkStep3();
  }, true);

  document.getElementById('members-container').addEventListener('input', e => {
    if (e.target.matches('[data-rule]')) checkStep3();
  });
});
