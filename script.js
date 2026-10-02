const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const demoForm = document.querySelector('[data-demo-form]');
const formStatus = document.querySelector('[data-form-status]');
const steps = [...document.querySelectorAll('[data-screen]')];
const screenLabel = document.querySelector('[data-screen-label]');
const screenTitle = document.querySelector('[data-screen-title]');
const caption = document.querySelector('[data-caption]');
const screenContent = document.querySelector('[data-screen-content]');
const hero = document.querySelector('.hero');
const heroPerson = document.querySelector('.hero-person');
const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
const heroImages = [...document.querySelectorAll('.hero-slide img')];
const backdrop = document.querySelector('.person-backdrop');
const phoneImage = document.querySelector('[data-phone-image]');
const phoneTabs = [...document.querySelectorAll('[data-phone-tab]')];
const phoneLabel = document.querySelector('[data-phone-label]');
const phoneCounter = document.querySelector('[data-phone-counter]');
const phoneStage = document.querySelector('.phone-stage');
const dashboardMotion = document.querySelector('[data-dashboard-motion]');
const dashboardMotionRing = dashboardMotion?.querySelector('[data-motion-ring]');
const dashboardMotionFrequency = dashboardMotion?.querySelector('[data-motion-frequency]');
const dashboardMotionContext = dashboardMotion?.querySelector('[data-motion-context]');
const dashboardMotionMetric = dashboardMotion?.querySelector('[data-motion-metric]');
const dashboardMotionGrowth = dashboardMotion?.querySelector('[data-motion-growth]');
const dashboardMotionBars = [...(dashboardMotion?.querySelectorAll('.dashboard-motion-bars i') || [])];
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const differentialsNav = document.querySelector('[data-differentials-nav]');
const differentialsSection = document.querySelector('#diferenciais');
const whatsappLink = document.querySelector('[data-whatsapp-link]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let heroIndex = 0;
let heroTimer;
let phoneTimer;
let dashboardMotionFrame;

const whatsappNumber = (whatsappLink?.dataset.whatsappNumber || '5571987336205').replace(/\D/g, '');
if (whatsappLink && whatsappNumber) {
  whatsappLink.href = `https://web.whatsapp.com/send?phone=${whatsappNumber}`;
  whatsappLink.target = '_blank';
  whatsappLink.rel = 'noopener noreferrer';
}
whatsappLink?.addEventListener('click', (event) => {
  if (!whatsappNumber) {
    event.preventDefault();
    return;
  }
  whatsappLink.href = `https://web.whatsapp.com/send?phone=${whatsappNumber}`;
});

const footerSocials = document.querySelector('.footer-socials');
if (footerSocials && !footerSocials.querySelector('[data-youtube-placeholder]')) {
  const youtubePlaceholder = document.createElement('span');
  youtubePlaceholder.className = 'social-link social-link-placeholder';
  youtubePlaceholder.dataset.youtubePlaceholder = '';
  youtubePlaceholder.setAttribute('role', 'img');
  youtubePlaceholder.setAttribute('aria-label', 'YouTube da Tec Escola, canal em breve');
  youtubePlaceholder.title = 'Canal no YouTube em breve';
  youtubePlaceholder.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"></path><path class="social-play" d="m9.6 8.3 6.3 3.7-6.3 3.7z"></path></svg>';
  footerSocials.append(youtubePlaceholder);
}

function setActiveNav(link) {
  navLinks.forEach((navLink) => {
    const isActive = navLink === link;
    navLink.classList.toggle('is-active', isActive);
    if (isActive) navLink.setAttribute('aria-current', 'page');
    else navLink.removeAttribute('aria-current');
  });
}

const screens = {
  dashboard: {
    label: 'VISÃO GERAL',
    title: 'Seu dia começa aqui',
    caption: 'Dashboard do aluno',
    content: '<div class="metric metric-blue"><small>Próxima aula</small><strong>História</strong><span>10:50 · Sala 03</span></div><div class="metric"><small>Progresso médio</small><strong>78%</strong><span>+12% neste bimestre</span></div><div class="preview-chart"><small>Atividades da semana</small><div class="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
  },
  schedule: {
    label: 'GRADE DE HORÁRIOS',
    title: 'Tudo no seu tempo',
    caption: 'Rotina acadêmica',
    content: '<div class="metric metric-blue"><small>Agora</small><strong>Sociologia</strong><span>10:50 · Sala 03</span></div><div class="metric"><small>Próximo intervalo</small><strong>12:30</strong><span>Quarta-feira</span></div><div class="preview-chart"><small>Aulas da semana</small><div class="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
  },
  learning: {
    label: 'CENTRAL DE ESTUDOS',
    title: 'Aprender também é avançar',
    caption: 'Aprendizagem em movimento',
    content: '<div class="metric metric-blue"><small>Em andamento</small><strong>Ciências</strong><span>2 atividades para concluir</span></div><div class="metric"><small>Desempenho</small><strong>84%</strong><span>Boa evolução</span></div><div class="preview-chart"><small>Progresso de estudos</small><div class="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
  },
};

const dashboardScenes = {
  dashboard: { frequency: '92%', ring: '92%', context: 'Matrículas ativas', metric: 'Matrículas ativas', growth: '+12%', bars: [35, 62, 48, 82, 57, 73, 90] },
  schedule: { frequency: '88%', ring: '88%', context: 'Presença semanal', metric: 'Aulas acompanhadas', growth: '+8%', bars: [42, 54, 61, 48, 76, 69, 84] },
  learning: { frequency: '84%', ring: '84%', context: 'Desempenho médio', metric: 'Atividades concluídas', growth: '+18%', bars: [30, 46, 58, 64, 72, 78, 94] },
};

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24 && !header.classList.contains('menu-open'));
}

function updateScrollMotion() {
  if (reduceMotion || !hero) return;
  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
  heroPerson?.style.setProperty('--person-shift', `${progress * 28}px`);
  heroImages.forEach((image) => {
    image.style.setProperty('--image-lift', `${progress * -20}px`);
    image.style.setProperty('--image-scale', `${1 + progress * 0.025}`);
  });
  backdrop?.style.setProperty('--backdrop-lift', `${progress * -10}px`);
}

function setHeroSlide(nextIndex) {
  if (!heroSlides.length) return;
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === heroIndex));
}

function restartHeroTimer() {
  window.clearInterval(heroTimer);
  if (!reduceMotion && heroSlides.length > 1) heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 1000);
}

const phoneScenes = {
  dashboard: { src: './assets/phone-dashboard-cutout.png', label: 'Painel do aluno', alt: 'Painel do aluno no celular' },
  livros: { src: './assets/phone-livros-cutout.png', label: 'Central de livros', alt: 'Indicações de livros no celular' },
  login: { src: './assets/phone-login-cutout.png', label: 'Acesso seguro', alt: 'Tela de acesso seguro no celular' },
};

function setPhoneScene(name) {
  const scene = phoneScenes[name];
  if (!scene || !phoneImage) return;
  const names = Object.keys(phoneScenes);
  const sceneIndex = names.indexOf(name);
  phoneTabs.forEach((tab) => {
    const isActive = tab.dataset.phoneTab === name;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  phoneImage.classList.add('is-changing');
  phoneImage.dataset.phoneScene = name;
  window.setTimeout(() => {
    phoneImage.src = scene.src;
    phoneImage.alt = scene.alt;
    phoneImage.classList.remove('is-changing');
  }, reduceMotion ? 0 : 180);
  if (phoneLabel) phoneLabel.textContent = scene.label;
  if (phoneCounter) phoneCounter.textContent = `${String(sceneIndex + 1).padStart(2, '0')} / ${String(names.length).padStart(2, '0')}`;
}

function restartPhoneTimer() {
  window.clearInterval(phoneTimer);
  if (!reduceMotion && phoneTabs.length > 1) {
    phoneTimer = window.setInterval(() => {
      const names = Object.keys(phoneScenes);
      const active = phoneTabs.findIndex((tab) => tab.classList.contains('is-active'));
      setPhoneScene(names[(active + 1) % names.length]);
    }, 1000);
  }
}

function setScreen(name) {
  const screen = screens[name];
  if (!screen) return;
  steps.forEach((step) => step.classList.toggle('is-active', step.dataset.screen === name));
  const dashboardScene = dashboardScenes[name];
  if (dashboardMotion && dashboardScene) {
    dashboardMotion.dataset.scene = name;
    dashboardMotionRing?.style.setProperty('--ring-progress', dashboardScene.ring);
    if (dashboardMotionFrequency) dashboardMotionFrequency.textContent = dashboardScene.frequency;
    if (dashboardMotionContext) dashboardMotionContext.textContent = dashboardScene.context;
    if (dashboardMotionMetric) dashboardMotionMetric.textContent = dashboardScene.metric;
    if (dashboardMotionGrowth) dashboardMotionGrowth.textContent = dashboardScene.growth;
    dashboardScene.bars.forEach((height, index) => dashboardMotionBars[index]?.style.setProperty('--motion-bar-height', `${height}%`));
    dashboardMotion.classList.remove('is-playing');
    window.cancelAnimationFrame(dashboardMotionFrame);
    dashboardMotionFrame = window.requestAnimationFrame(() => dashboardMotion.classList.add('is-playing'));
  }
  if (screenLabel) screenLabel.textContent = screen.label;
  if (screenTitle) screenTitle.textContent = screen.title;
  if (caption) caption.textContent = screen.caption;
  if (screenContent) {
    screenContent.classList.add('is-changing');
    window.setTimeout(() => {
      screenContent.innerHTML = screen.content;
      screenContent.classList.remove('is-changing');
    }, reduceMotion ? 0 : 160);
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('scroll', updateScrollMotion, { passive: true });
updateHeader();
updateScrollMotion();
setHeroSlide(0);
restartHeroTimer();
setPhoneScene('dashboard');
restartPhoneTimer();
setScreen('dashboard');

phoneTabs.forEach((tab) => tab.addEventListener('click', () => {
  setPhoneScene(tab.dataset.phoneTab);
  restartPhoneTimer();
}));
phoneStage?.addEventListener('mouseenter', () => window.clearInterval(phoneTimer));
phoneStage?.addEventListener('mouseleave', restartPhoneTimer);

navLinks.forEach((link) => link.addEventListener('click', () => setActiveNav(link)));
setActiveNav(navLinks.find((link) => link.getAttribute('href') === window.location.hash));

differentialsNav?.addEventListener('mouseenter', () => differentialsSection?.classList.add('is-previewing'));
differentialsNav?.addEventListener('mouseleave', () => differentialsSection?.classList.remove('is-previewing'));
differentialsNav?.addEventListener('focus', () => differentialsSection?.classList.add('is-previewing'));
differentialsNav?.addEventListener('blur', () => differentialsSection?.classList.remove('is-previewing'));

if (menuButton && header) {
  menuButton.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    updateHeader();
  });
  header.querySelectorAll('.desktop-nav a').forEach((link) => link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setScreen(entry.target.dataset.screen);
  });
}, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
steps.forEach((step) => observer.observe(step));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

const revealItems = document.querySelectorAll('.section:not(.hero) h2, .feature-card, .showcase-step, .profile-card, .differentiator-copy, .stacked-panels, .proof-points div, .faq-list details, .phone-stage, .mobile-copy');
revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
  revealObserver.observe(item);
});

demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = 'Formulário pronto para conectar ao canal de atendimento da Tec Escola.';
  demoForm.reset();
});
