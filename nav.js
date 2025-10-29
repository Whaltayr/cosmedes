const navnavToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navnavToggle.addEventListener('click', () => {
    navnavToggle.classList.toggle('active');
  navbarMenu.classList.toggle('active');

});