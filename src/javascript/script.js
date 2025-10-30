const navbar = document.querySelector('.navbar');
const mobileNavbar = document.querySelector('.navbar__mobile');
const button = document.querySelector('.burguer');
const mobileLinks = document.querySelector('.mobile__links');

function toggleMobileMenu() {
  const isActive = mobileNavbar.classList.toggle('active');
  if (button) {
    button.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    button.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
  }
}

button.addEventListener('click', function () {
  toggleMobileMenu();
});

button.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMobileMenu();
  }
});

if (mobileLinks) {
  mobileLinks.addEventListener('click', function (e) {
    if (e.target && e.target.matches('a')) {
      if (mobileNavbar.classList.contains('active')) toggleMobileMenu();
    }
  });
}

window.addEventListener('scroll', function () {
  if (this.window.pageYOffset > 0) return navbar.classList.add('active');
  return navbar.classList.remove('active');
});

ScrollReveal().reveal('.header__left', {
  origin: 'left',
  duration: 2000,
  distance: '20%'
});

ScrollReveal().reveal('.header__right', {
  origin: 'right',
  duration: 2000,
  distance: '20%'
});