document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENU MOBILE ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const body = document.body;

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                body.style.overflow = 'auto';
            });
        });
    }

    // --- 2. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('reveal-waiting', 'reveal-left-waiting', 'reveal-right-waiting');
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach((el, i) => {
            el.classList.add('reveal-waiting');
            // Stagger effect for cards in same row
            if (el.closest('.grid-3') || el.closest('.grid-2')) {
                el.style.transitionDelay = `${(i % 3) * 0.1}s`;
            }
            observer.observe(el);
        });

        document.querySelectorAll('.reveal-left').forEach(el => {
            el.classList.add('reveal', 'reveal-left-waiting');
            observer.observe(el);
        });

        document.querySelectorAll('.reveal-right').forEach(el => {
            el.classList.add('reveal', 'reveal-right-waiting');
            observer.observe(el);
        });
    }

    // --- 4. COUNTER ANIMATION ---
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = el.dataset.count;
                    const isNumber = !isNaN(parseInt(target));

                    if (isNumber) {
                        const num = parseInt(target);
                        const suffix = el.dataset.suffix || '';
                        const prefix = el.dataset.prefix || '';
                        const duration = 2000;
                        const start = performance.now();

                        const animate = (now) => {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            el.textContent = prefix + Math.round(num * eased) + suffix;
                            if (progress < 1) requestAnimationFrame(animate);
                        };
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target;
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // --- 5. COOKIE BANNER ---
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const refuseBtn = document.getElementById('refuse-cookies');

    if (banner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            banner.style.transform = 'translateY(0)';
        }, 1500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.transform = 'translateY(200%)';
        });
    }

    if (refuseBtn) {
        refuseBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'refused');
            banner.style.transform = 'translateY(200%)';
        });
    }

    // --- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
