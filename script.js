       document.addEventListener('DOMContentLoaded', () => {
            const root = document.getElementById('sliderRoot');
            const track = document.getElementById('sliderTrack');
            const slides = Array.from(track.querySelectorAll('.slide'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const dotsContainer = document.getElementById('dots');

            let index = 0;
            const AUTOPLAY_DELAY = 4000;
            let autoplayTimer = null;

            // build dots
            slides.forEach((_, i) => {
                const b = document.createElement('button');
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(b);
            });
            const dots = Array.from(dotsContainer.children);

            function updateUI() {
                // move using percentage — keeps layout simple and responsive
                track.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach((d, i) => d.classList.toggle('active', i === index));
            }

            function goTo(i) {
                index = (i + slides.length) % slides.length;
                updateUI();
                restartAutoplay();
            }
            function next() { goTo(index + 1); }
            function prev() { goTo(index - 1); }

            // autoplay controls
            function startAutoplay() {
                stopAutoplay();
                autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
            }
            function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
            function restartAutoplay() { stopAutoplay(); startAutoplay(); }

            // basic touch support (horizontal swipe)
            let touchStartX = 0;
            let touchDeltaX = 0;
            root.addEventListener('touchstart', e => {
                stopAutoplay();
                touchStartX = e.touches[0].clientX;
                touchDeltaX = 0;
            }, { passive: true });
            root.addEventListener('touchmove', e => {
                touchDeltaX = e.touches[0].clientX - touchStartX;
            }, { passive: true });
            root.addEventListener('touchend', () => {
                if (Math.abs(touchDeltaX) > 50) {
                    if (touchDeltaX < 0) next();
                    else prev();
                } else restartAutoplay();
            });

            // pause on hover/focus
            root.addEventListener('mouseenter', stopAutoplay);
            root.addEventListener('mouseleave', startAutoplay);
            root.addEventListener('focusin', stopAutoplay);
            root.addEventListener('focusout', startAutoplay);

            // keyboard nav
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'ArrowRight') next();
            });

            // wire up buttons
            prevBtn.addEventListener('click', prev);
            nextBtn.addEventListener('click', next);

            // initialize
            updateUI();
            startAutoplay();

            // make slider responsive if you change container size
            // using resize observer to ensure it stays functional when layout changes
            if (window.ResizeObserver) {
                new ResizeObserver(() => updateUI()).observe(root);
            } else {
                window.addEventListener('resize', updateUI);
            }
        });