const navbar = document.querySelector('.navbar');
const mobileNavbar = document.querySelector('.navbar__mobile');
const button = document.querySelector('.burguer');

button.addEventListener('click', function () {
  mobileNavbar.classList.toggle('active');
});

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