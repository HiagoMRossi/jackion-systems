(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const config = window.JACKION_CONFIG || {};
  const phone = typeof config.whatsapp === 'string' && /^\d{10,15}$/.test(config.whatsapp) ? config.whatsapp : '';
  const email = typeof config.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email) ? config.email : '';
  const makeContact = (message) => phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : email ? `mailto:${email}?subject=${encodeURIComponent('Novo projeto — Jackion Systems')}&body=${encodeURIComponent(message)}` : '';
  const configureContactLink = (link, message) => {
    const url = makeContact(message);
    if (!url) return false;
    link.href = url;
    if (phone) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    return true;
  };
  $('year').textContent = new Date().getFullYear();
  if (configureContactLink($('direct-link'), 'Olá! Gostaria de conversar sobre um projeto com a Jackion Systems.')) {
    $('contact-direct').hidden = false;
    $('direct-link').firstChild.textContent = phone ? 'Conversar pelo WhatsApp ' : 'Conversar por e-mail ';
    $('form-note').textContent = 'Prepare seu briefing e compartilhe pelo contato direto. O envio depende da sua confirmação no aplicativo.';
  }

  const menuButton = document.querySelector('.menu-toggle');
  const menu = $('menu-principal');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) setMenu(false); });
  const mobile = window.matchMedia('(max-width:680px)');
  mobile.addEventListener('change', () => setMenu(false));

  const tabs = [...document.querySelectorAll('[data-tab]')];
  const selectTab = (selected, focus = false) => {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      $(tab.getAttribute('aria-controls')).hidden = !active;
    });
    document.querySelectorAll('[data-demo]').forEach((demo) => { demo.hidden = demo.dataset.demo !== selected.dataset.tab; });
    if (focus) selected.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  document.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => {
    $('servico').value = button.dataset.service;
    $('servico').dispatchEvent(new Event('change', { bubbles: true }));
    $('contato').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    $('nome').focus({ preventScroll: true });
  }));

  let lastFocus;
  const openDialog = (dialog) => { lastFocus = document.activeElement; dialog.showModal(); };
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { lastFocus?.focus({ preventScroll: true }); });
  });
  $('privacy-button').addEventListener('click', () => openDialog($('privacy-dialog')));

  $('brief-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('nome').value.trim();
    const challenge = $('desafio').value.trim();
    $('nome').setCustomValidity(name ? '' : 'Informe seu nome.');
    $('desafio').setCustomValidity(challenge ? '' : 'Conte o desafio que você quer resolver.');
    if (!$('brief-form').reportValidity()) return;
    const company = $('empresa').value.trim();
    const lines = [ 'Olá, equipe Jackion Systems!', '', 'Gostaria de conversar sobre um projeto.', '', `Nome: ${name}`, ...(company ? [`Negócio: ${company}`] : []), `Preciso de: ${$('servico').value}`, '', 'Desafio:', challenge ];
    $('brief-output').value = lines.join('\n');
    $('copy-status').textContent = '';
    const send = $('send-brief');
    send.hidden = !configureContactLink(send, $('brief-output').value);
    if (!send.hidden) send.firstChild.textContent = phone ? 'Abrir WhatsApp ' : 'Abrir e-mail ';
    openDialog($('brief-dialog'));
  });
  ['nome', 'desafio'].forEach((id) => $(id).addEventListener('input', () => $(id).setCustomValidity('')));

  $('copy-brief').addEventListener('click', async () => {
    const status = $('copy-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText($('brief-output').value);
      status.textContent = 'Briefing copiado. Agora você pode compartilhá-lo com a equipe.';
    } catch {
      $('brief-output').focus();
      $('brief-output').select();
      status.textContent = 'Selecione “Copiar” no seu dispositivo ou use o botão de download.';
    }
  });
  $('download-brief').addEventListener('click', () => {
    const blob = new Blob([$('brief-output').value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'briefing-jackion-systems.txt';
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('copy-status').textContent = 'Download iniciado. O briefing continua disponível aqui para copiar.';
  });
})();
