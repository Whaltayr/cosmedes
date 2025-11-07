// ========================================
// NAVBAR TOGGLE FUNCTIONALITY
// ========================================

const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

// Toggle menu on click
navbarToggle.addEventListener('click', () => {
  navbarToggle.classList.toggle('active');
  navbarMenu.classList.toggle('active');
  
  // Prevent body scroll when menu is open on mobile
  if (navbarMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.navbar-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 800) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Close menu on resize if window gets bigger
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});


// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (currentScroll > 50) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '1px 1px 10px rgba(0, 0, 0, 0.1)';
  }
  
  lastScroll = currentScroll;
});


// ========================================
// ACTIVE LINK HIGHLIGHT
// ========================================

// Get current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Update active link
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active-link');
  } else {
    link.classList.remove('active-link');
  }
});