// ========================================
// GSAP SCROLLTRIGGER ANIMATIONS
// ========================================

gsap.registerPlugin(ScrollTrigger);

// Animate items on scroll
gsap.utils.toArray('.items-group').forEach((item, index) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
    delay: index * 0.1
  });
});

// Parallax effect on images
gsap.utils.toArray('.img-container img').forEach((img) => {
  gsap.to(img, {
    y: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: img,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });
});

// Hero fade in
gsap.from('.hero-portfolio', {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: 'power3.out',
  delay: 0.2
});

// Filters fade in
gsap.from('.filter-btn', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
  delay: 0.4
});


// ========================================
// FILTER FUNCTIONALITY
// ========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.items-group');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter items with animation
    items.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      
      if (filter === '*' || category === filter) {
        // Show item
        gsap.to(item, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          display: 'flex',
          ease: 'power2.out',
          delay: index * 0.05
        });
        item.classList.remove('hidden');
      } else {
        // Hide item
        gsap.to(item, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            item.style.display = 'none';
            item.classList.add('hidden');
          }
        });
      }
    });
    
    // Refresh ScrollTrigger after filtering
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);
  });
});


// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================

const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lb-image');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const lbCounter = document.getElementById('lb-counter');

let currentImages = [];
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

// Open lightbox
function openLightbox(images, index) {
  currentImages = images;
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Animate image entrance
  gsap.fromTo(lbImage, 
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
  );
}

// Close lightbox
function closeLightbox() {
  gsap.to(lbImage, {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    }
  });
}

// Update lightbox image
function updateLightboxImage() {
  // Animate out
  gsap.to(lbImage, {
    opacity: 0,
    x: -30,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      lbImage.src = currentImages[currentIndex];
      lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      
      // Animate in
      gsap.fromTo(lbImage,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  });
}

// Navigate to next image
function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightboxImage();
}

// Navigate to previous image
function prevImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
}

// Event listeners
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);

// Close on background click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// Mouse wheel navigation
lightbox.addEventListener('wheel', (e) => {
  if (!lightbox.classList.contains('active')) return;
  e.preventDefault();
  
  if (e.deltaY > 0) {
    nextImage();
  } else if (e.deltaY < 0) {
    prevImage();
  }
}, { passive: false });

// Touch/swipe support
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 75;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage(); // Swipe left
    } else {
      prevImage(); // Swipe right
    }
  }
}

// Click on images to open lightbox
document.querySelectorAll('.items-group').forEach(group => {
  const images = Array.from(group.querySelectorAll('.img-container img')).map(img => img.src);
  
  group.querySelectorAll('.img-container img').forEach((img, index) => {
    img.addEventListener('click', () => {
      openLightbox(images, index);
    });
  });
  
  // Also add click to "View gallery" button
  const viewBtn = group.querySelector('.view-gallery-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      openLightbox(images, 0);
    });
  }
});


// ========================================
// MOBILE SLIDER FUNCTIONALITY
// ========================================

// Add scroll indicators for mobile sliders
if (window.innerWidth <= 768) {
  document.querySelectorAll('.img-container').forEach(container => {
    let isScrolling;
    
    container.addEventListener('scroll', () => {
      container.style.scrollSnapType = 'none';
      
      clearTimeout(isScrolling);
      
      isScrolling = setTimeout(() => {
        container.style.scrollSnapType = 'x mandatory';
      }, 150);
    });
  });
}


// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// ========================================
// PERFORMANCE: LAZY LOADING OPTIMIZATION
// ========================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}


// ========================================
// REFRESH SCROLLTRIGGER ON RESIZE
// ========================================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});


// ========================================
// PRELOAD CRITICAL IMAGES
// ========================================

window.addEventListener('load', () => {
  // Preload first few images for better performance
  const firstImages = document.querySelectorAll('.items-group:nth-child(-n+3) img');
  firstImages.forEach(img => {
    const preloadImg = new Image();
    preloadImg.src = img.src;
  });
});


// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c🎨 Portfolio Gallery Loaded', 'color: #4caf50; font-size: 16px; font-weight: bold;');
console.log('%c✨ GSAP ScrollTrigger Active', 'color: #667eea; font-size: 12px;');
console.log('%c📱 Mobile Optimized', 'color: #764ba2; font-size: 12px;');