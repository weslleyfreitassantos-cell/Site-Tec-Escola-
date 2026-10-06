const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const demoForm = document.querySelector('[data-demo-form]');
const formStatus = document.querySelector('[data-form-status]');
const steps = [...document.querySelectorAll('[data-screen]')];
const screenLabel = document.querySelector('[data-screen-label]');
const screenTitle = document.querySelector('[data-screen-title]');
const caption = document.querySelector('[data-caption]');
const screenContent = document.querySelector('[data-screen-content]');
const featureCards = [...document.querySelectorAll('[data-feature-card]')];
const featureGrid = document.querySelector('.feature-grid');
const hero = document.querySelector('.hero');
const heroPerson = document.querySelector('.hero-person');
const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
const heroImages = [...document.querySelectorAll('.hero-slide img')];
const backdrop = document.querySelector('.person-backdrop');
const phoneImage = document.querySelector('[data-phone-image]');
const phoneTabs = [...document.querySelectorAll('[data-phone-tab]')];
const phoneStage = document.querySelector('.phone-stage');
const phoneDevice = document.querySelector('.phone-device');
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const navTargets = navLinks.map((link) => {
  const target = document.querySelector(link.getAttribute('href'));
  return target?.closest('section') || target;
});
const tvSchoolSlides = [...document.querySelectorAll('[data-tv-school-slide]')];
const tvSchoolDots = [...document.querySelectorAll('[data-tv-school-dot]')];
const tvSchoolVideos = [...document.querySelectorAll('[data-tv-school-video]')];
const tvSchoolStage = document.querySelector('.tv-school-stage');
const tvSchoolToggle = document.querySelector('[data-tv-school-toggle]');
const differentialsNav = document.querySelector('[data-differentials-nav]');
const differentialsSection = document.querySelector('#diferenciais');
const whatsappLink = document.querySelector('[data-whatsapp-link]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let heroIndex = 0;
let heroTimer;
let phoneTimer;
let tvSchoolTimer;
let tvSchoolFeedbackTimer;
let tvSchoolPaused = false;
const TV_SCHOOL_SLIDE_DURATION = 3000;
let featureCardTimer;
let featureCardsInView = false;

function playTvSchoolVideo(video) {
  if (!video || tvSchoolPaused) return;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.play().catch(() => {});
}

const whatsappNumber = (whatsappLink?.dataset.whatsappNumber || '5571987336205').replace(/\D/g, '');
const getWhatsappUrl = (message = '') => {
  if (!whatsappNumber) return '';
  const url = `https://wa.me/${whatsappNumber}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
};

if (whatsappLink && whatsappNumber) {
  whatsappLink.href = getWhatsappUrl();
  whatsappLink.target = '_blank';
  whatsappLink.rel = 'noopener noreferrer';
}

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

function updateActiveNavFromScroll() {
  const marker = window.scrollY + (header?.offsetHeight || 78) + 16;
  let activeIndex = 0;

  navTargets.forEach((target, index) => {
    if (target && target.offsetTop <= marker) activeIndex = index;
  });

  setActiveNav(navLinks[activeIndex]);
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
  if (!reduceMotion && heroSlides.length > 1) heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 4000);
}

const phoneScenes = {
  dashboard: { src: './assets/phone-dashboard-cutout.png', alt: 'Painel do aluno no celular' },
  livros: { src: './assets/phone-livros-cutout.png', alt: 'Indicações de livros no celular' },
  login: { src: './assets/phone-login-cutout.png', alt: 'Tela de acesso seguro no celular' },
};

function setPhoneScene(name) {
  const scene = phoneScenes[name];
  if (!scene || !phoneImage) return;
  phoneTabs.forEach((tab) => {
    const isActive = tab.dataset.phoneTab === name;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  phoneImage.classList.add('is-changing');
  phoneImage.dataset.phoneScene = name;
  if (phoneDevice) phoneDevice.dataset.phoneScene = name;
  window.setTimeout(() => {
    phoneImage.src = scene.src;
    phoneImage.alt = scene.alt;
    phoneImage.classList.remove('is-changing');
  }, reduceMotion ? 0 : 180);
}

function restartPhoneTimer() {
  window.clearInterval(phoneTimer);
  if (!reduceMotion && phoneTabs.length > 1) {
    phoneTimer = window.setInterval(() => {
      const names = Object.keys(phoneScenes);
      const active = phoneTabs.findIndex((tab) => tab.classList.contains('is-active'));
      setPhoneScene(names[(active + 1) % names.length]);
    }, 4000);
  }
}

function setActiveFeatureCard(nextIndex) {
  if (!featureCards.length) return;
  const activeIndex = (nextIndex + featureCards.length) % featureCards.length;
  featureCards.forEach((card, index) => card.classList.toggle('is-active', index === activeIndex));
}

function restartFeatureCardTimer() {
  window.clearInterval(featureCardTimer);
  if (reduceMotion || featureCards.length < 2 || !featureCardsInView) return;
  featureCardTimer = window.setInterval(() => {
    const activeIndex = featureCards.findIndex((card) => card.classList.contains('is-active'));
    setActiveFeatureCard(activeIndex + 1);
  }, 1000);
}

function setTvSchoolSlide(nextIndex) {
  if (!tvSchoolSlides.length) return;
  const activeIndex = (nextIndex + tvSchoolSlides.length) % tvSchoolSlides.length;
  tvSchoolVideos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
  tvSchoolSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeIndex));
  tvSchoolDots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-pressed', String(isActive));
  });
  const activeVideo = tvSchoolSlides[activeIndex].querySelector('[data-tv-school-video]');
  playTvSchoolVideo(activeVideo);
}

function restartTvSchoolTimer() {
  window.clearTimeout(tvSchoolTimer);
  if (reduceMotion || tvSchoolSlides.length < 2) return;
  const activeIndex = tvSchoolSlides.findIndex((slide) => slide.classList.contains('is-active'));
  tvSchoolTimer = window.setTimeout(() => {
    setTvSchoolSlide(activeIndex + 1);
    restartTvSchoolTimer();
  }, TV_SCHOOL_SLIDE_DURATION);
}

function setTvSchoolPaused(paused) {
  tvSchoolPaused = paused;
  window.clearTimeout(tvSchoolFeedbackTimer);
  tvSchoolStage?.classList.toggle('is-paused', paused);
  tvSchoolStage?.classList.toggle('is-feedback', !paused);
  tvSchoolToggle?.setAttribute('aria-pressed', String(paused));
  tvSchoolToggle?.setAttribute('aria-label', paused ? 'Retomar carrossel da TV Escola' : 'Pausar carrossel da TV Escola');
  tvSchoolToggle?.setAttribute('title', paused ? 'Retomar carrossel da TV Escola' : 'Pausar carrossel da TV Escola');
  tvSchoolToggle?.setAttribute('data-tv-school-feedback', paused ? 'pause' : 'play');

  const activeVideo = tvSchoolSlides.find((slide) => slide.classList.contains('is-active'))?.querySelector('[data-tv-school-video]');
  if (paused) {
    window.clearTimeout(tvSchoolTimer);
    activeVideo?.pause();
    return;
  }

  playTvSchoolVideo(activeVideo);
  restartTvSchoolTimer();
  tvSchoolFeedbackTimer = window.setTimeout(() => tvSchoolStage?.classList.remove('is-feedback'), 800);
}

function setScreen(name) {
  const screen = screens[name];
  if (!screen) return;
  steps.forEach((step) => step.classList.toggle('is-active', step.dataset.screen === name));
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
window.addEventListener('scroll', updateActiveNavFromScroll, { passive: true });
updateHeader();
updateScrollMotion();
updateActiveNavFromScroll();
setHeroSlide(0);
restartHeroTimer();
setPhoneScene('dashboard');
restartPhoneTimer();
setScreen('dashboard');
setActiveFeatureCard(0);
setTvSchoolSlide(0);
restartTvSchoolTimer();

phoneTabs.forEach((tab) => tab.addEventListener('click', () => {
  setPhoneScene(tab.dataset.phoneTab);
  restartPhoneTimer();
}));
phoneStage?.addEventListener('mouseenter', () => window.clearInterval(phoneTimer));
phoneStage?.addEventListener('mouseleave', restartPhoneTimer);

tvSchoolDots.forEach((dot) => dot.addEventListener('click', () => {
  setTvSchoolSlide(Number(dot.dataset.tvSchoolDot));
  if (!tvSchoolPaused) restartTvSchoolTimer();
}));

tvSchoolToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  setTvSchoolPaused(!tvSchoolPaused);
});

tvSchoolStage?.addEventListener('click', (event) => {
  if (event.target.closest('[data-tv-school-dot], [data-tv-school-toggle]')) return;
  setTvSchoolPaused(!tvSchoolPaused);
});

tvSchoolVideos.forEach((video) => video.addEventListener('ended', () => {
  const activeIndex = tvSchoolSlides.findIndex((slide) => slide.classList.contains('is-active'));
  if (tvSchoolSlides[activeIndex]?.contains(video)) {
    setTvSchoolSlide(activeIndex + 1);
    restartTvSchoolTimer();
  }
}));

const tvSchoolVisibilityObserver = tvSchoolStage ? new IntersectionObserver(([entry]) => {
  const activeVideo = tvSchoolSlides.find((slide) => slide.classList.contains('is-active'))?.querySelector('[data-tv-school-video]');
  if (entry.isIntersecting) {
    playTvSchoolVideo(activeVideo);
  } else if (!tvSchoolPaused) {
    activeVideo?.pause();
  }
}, { threshold: .35 }) : null;
tvSchoolVisibilityObserver?.observe(tvSchoolStage);

const featureVisibilityObserver = featureGrid ? new IntersectionObserver(([entry]) => {
  featureCardsInView = entry.isIntersecting;
  if (entry.isIntersecting) {
    setActiveFeatureCard(0);
    restartFeatureCardTimer();
  } else {
    window.clearInterval(featureCardTimer);
  }
}, { threshold: .25 }) : null;
featureVisibilityObserver?.observe(featureGrid);

navLinks.forEach((link) => link.addEventListener('click', () => setActiveNav(link)));

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

const revealItems = document.querySelectorAll('.section:not(.hero) h2, .feature-card, .showcase-step, .profile-card, .differentiator-copy, .stacked-panels, .phone-stage, .mobile-copy');
revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
  revealObserver.observe(item);
});

demoForm?.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    event.target.removeAttribute('aria-invalid');
  }
});

demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const requiredFields = [...demoForm.querySelectorAll('[required]')];
  const invalidField = requiredFields.find((field) => {
    const value = field.value.trim();
    const invalidEmail = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return !value || invalidEmail;
  });

  requiredFields.forEach((field) => field.removeAttribute('aria-invalid'));
  if (invalidField) {
    invalidField.setAttribute('aria-invalid', 'true');
    formStatus.textContent = 'Preencha todos os campos obrigatórios para continuar.';
    invalidField.focus();
    return;
  }

  if (!whatsappNumber) {
    formStatus.textContent = 'Não foi possível abrir o canal de atendimento. Tente novamente mais tarde.';
    return;
  }

  const data = new FormData(demoForm);
  const message = [
    'Olá! Gostaria de solicitar uma demonstração do Tec Escola.',
    '',
    `Instituição: ${data.get('institution')}`,
    `Nome: ${data.get('name')}`,
    `E-mail profissional: ${data.get('email')}`,
    `WhatsApp: ${data.get('phone')}`,
    `Cargo: ${data.get('role')}`,
  ].join('\n');

  formStatus.textContent = 'Abrindo o WhatsApp para concluir o atendimento...';
  window.location.assign(getWhatsappUrl(message));
});
