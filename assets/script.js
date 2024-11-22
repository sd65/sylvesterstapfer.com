document.addEventListener('DOMContentLoaded', () => {

  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');

  // Toggle menu open/close
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('open');
    menu.classList.toggle('open');
  });

});
