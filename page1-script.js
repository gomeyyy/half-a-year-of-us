/* ============================================
   MEMORY LANE PAGE - JAVASCRIPT
   Carousel, Animations, and Interactions
   ============================================ */

// ============================================
// Carousel Management
// ============================================

// Store carousel state for each month
const carouselState = {};

// Initialize carousels
function initializeCarousels() {
  const months = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr'];
  
  months.forEach(month => {
    const carousel = document.getElementById(`carousel-${month}`);
    const items = carousel ? carousel.querySelectorAll('.carousel-item').length : 0;
    
    carouselState[month] = {
      currentIndex: 0,
      totalItems: items
    };
    
    // Create indicators
    if (items > 0) {
      createIndicators(month, items);
      // Initialize carousel display with first item active
      updateCarousel(month);
    }
  });
}

// Create indicator dots for each carousel
function createIndicators(month, count) {
  const indicatorContainer = document.getElementById(`indicators-${month}`);
  
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'carousel-indicator';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(month, i);
    indicatorContainer.appendChild(dot);
  }
}

// Navigate to specific slide
function goToSlide(month, index) {
  const carousel = document.getElementById(`carousel-${month}`);
  const items = carousel.querySelectorAll('.carousel-item').length;
  
  // Wrap around
  if (index >= items) {
    carouselState[month].currentIndex = 0;
  } else if (index < 0) {
    carouselState[month].currentIndex = items - 1;
  } else {
    carouselState[month].currentIndex = index;
  }
  
  updateCarousel(month);
}

// Move to next slide
function nextImage(month) {
  goToSlide(month, carouselState[month].currentIndex + 1);
}

// Move to previous slide
function previousImage(month) {
  goToSlide(month, carouselState[month].currentIndex - 1);
}

// Update carousel display and indicators
function updateCarousel(month) {
  const carousel = document.getElementById(`carousel-${month}`);
  const currentIndex = carouselState[month].currentIndex;
  const items = carousel.querySelectorAll('.carousel-item');
  const activeItem = items[currentIndex];
  const wrapper = carousel.closest('.carousel-wrapper');
  
  // Center the active item, accounting for carousel padding and gaps.
  if (activeItem && wrapper) {
    const itemCenter = activeItem.offsetLeft + (activeItem.offsetWidth / 2);
    const wrapperCenter = wrapper.clientWidth / 2;
    carousel.style.transform = `translateX(${wrapperCenter - itemCenter}px)`;
  }
  
  // Update active state for all items
  items.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update indicators
  const indicators = document.querySelectorAll(`#indicators-${month} .carousel-indicator`);
  indicators.forEach((indicator, index) => {
    if (index === currentIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

window.addEventListener('resize', () => {
  Object.keys(carouselState).forEach(month => updateCarousel(month));
});

// ============================================
// Keyboard Navigation for Carousels
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    // Get currently visible section's month
    const sections = document.querySelectorAll('.memory-section');
    const activeMonth = getVisibleSection(sections)?.dataset.month;
    if (activeMonth) previousImage(activeMonth);
  } else if (e.key === 'ArrowRight') {
    const sections = document.querySelectorAll('.memory-section');
    const activeMonth = getVisibleSection(sections)?.dataset.month;
    if (activeMonth) nextImage(activeMonth);
  }
});

// Helper function to find the most visible section
function getVisibleSection(sections) {
  let mostVisible = null;
  let maxVisibility = 0;
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const visible = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
    
    if (visible > maxVisibility) {
      maxVisibility = visible;
      mostVisible = section;
    }
  });
  
  return mostVisible;
}

// ============================================
// Scroll Animations - Fade in on scroll
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

function prepareTextReveals() {
  const targets = document.querySelectorAll('.intro-title, .intro-subtitle, .month-title, .letter-card h2, .outro-card h2');

  targets.forEach(target => {
    if (target.dataset.revealedText === 'true') return;

    const words = target.textContent.trim().split(/\s+/);
    target.textContent = '';
    target.classList.add('text-reveal');

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'reveal-word';
      span.style.setProperty('--word-index', index);
      span.textContent = word;
      target.appendChild(span);
    });

    target.dataset.revealedText = 'true';
  });
}

function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });
}

function updateScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

// ============================================
// Smooth Scroll Enhancement
// ============================================

// Add smooth scroll to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// Touch/Swipe Support for Mobile
// ============================================

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe(month) {
  const swipeThreshold = 50; // minimum distance to trigger swipe
  
  if (touchStartX - touchEndX > swipeThreshold) {
    // Swiped left - next image
    nextImage(month);
  } else if (touchEndX - touchStartX > swipeThreshold) {
    // Swiped right - previous image
    previousImage(month);
  }
}

// Add touch listeners to carousels
document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
  const month = wrapper.parentElement.parentElement.dataset.month;
  
  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  wrapper.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(month);
  }, false);
});

// ============================================
// Page Load & Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  prepareTextReveals();
  initializeScrollAnimations();
  updateScrollProgress();

  // Initialize all carousels
  initializeCarousels();
  
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  
  console.log('Memory Lane page loaded successfully! 💖');
});

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ============================================
// Utility: Auto-rotate carousel (optional)
// You can uncomment this if you want carousels to auto-play
// ============================================

/*
const autoRotateInterval = setInterval(() => {
  const months = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr'];
  months.forEach(month => {
    // Uncomment the line below to enable auto-rotate
    // nextImage(month);
  });
}, 5000); // Change every 5 seconds

// Function to toggle auto-rotation (optional)
function toggleAutoRotate(enabled) {
  if (!enabled && autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }
}
*/

// ============================================
// Accessibility: Focus management
// ============================================

// Improve keyboard navigation
document.querySelectorAll('.carousel-btn').forEach(button => {
  button.setAttribute('aria-label', button.textContent.includes('❮') ? 'Previous image' : 'Next image');
});

document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
  indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
});

// ============================================
// Easter Eggs & Fun Effects (Optional)
// ============================================

// Uncomment to add a click counter easter egg
/*
let heartClicks = 0;

document.querySelectorAll('.outro-section').forEach(section => {
  section.addEventListener('click', () => {
    heartClicks++;
    if (heartClicks === 5) {
      createHeartRain();
      heartClicks = 0;
    }
  });
});

function createHeartRain() {
  const hearts = ['💖', '💝', '💗', '💓', '💕'];
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = '-20px';
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    document.body.appendChild(heart);
    
    const duration = 3000 + Math.random() * 2000;
    let startTime = Date.now();
    
    function fall() {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      heart.style.top = (progress * window.innerHeight) + 'px';
      heart.style.opacity = 1 - progress;
      
      if (progress < 1) {
        requestAnimationFrame(fall);
      } else {
        heart.remove();
      }
    }
    
    fall();
  }
}
*/
