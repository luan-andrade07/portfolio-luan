'use strict';

// A classe só é adicionada quando este arquivo realmente é executado.
// Assim, sem JavaScript, o conteúdo continua visível por padrão.
document.documentElement.classList.add('js-enabled');

// Menu de navegação para telas menores.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');

function setMenuOpen(isOpen) {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  // Fecha o menu caso a janela volte ao tamanho de desktop.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) setMenuOpen(false);
  });
}

// Filtro acessível para os cartões de projetos.
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const filterEmpty = document.querySelector('#filter-empty');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    let visibleProjects = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'todos' || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;
      if (shouldShow) visibleProjects += 1;
    });

    if (filterEmpty) filterEmpty.hidden = visibleProjects > 0;
  });
});

// Animações de entrada: o conteúdo permanece visível se o recurso não existir.
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const revealItems = document.querySelectorAll('.reveal');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Atualiza automaticamente o ano do rodapé.
const yearElement = document.querySelector('#current-year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());