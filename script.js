/* ============================================
   Sri Sai Realty - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(function () {
        preloader.classList.add('hidden');
    }, 3000);

    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    // Back to top click
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Navigation Toggle ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // === Hero Particles ===
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            heroParticles.appendChild(particle);
        }
    }

    // === Counter Animation ===
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(function (counter) {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                } else {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                }
            }
            updateCounter();
        });
    }

    // Trigger counter animation when hero stats are in view
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // === Property Filter ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active button
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            propertyCards.forEach(function (card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function () {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'all 0.4s ease';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function () {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // === Testimonial Slider ===
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    const totalTestimonials = testimonials.length;

    // Create dots
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function () {
            goToTestimonial(i);
        });
        dotsContainer.appendChild(dot);
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = 'translateX(-' + (currentTestimonial * 100) + '%)';

        // Update dots
        document.querySelectorAll('.testimonial-dot').forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    prevBtn.addEventListener('click', function () {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        goToTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', function () {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        goToTestimonial(currentTestimonial);
    });

    // Auto-slide testimonials
    setInterval(function () {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        goToTestimonial(currentTestimonial);
    }, 6000);

    // === Enquiry Form Handling ===
    const enquiryForm = document.getElementById('enquiryForm');
    const formSuccess = document.getElementById('formSuccess');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Gather form data
            const formData = new FormData(enquiryForm);
            const data = {};
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            console.log('Enquiry Form Data:', data);

            // Show success message
            enquiryForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Reset after 5 seconds (optional)
            // setTimeout(resetForm, 5000);
        });
    }

    // Reset form function (exposed globally)
    window.resetForm = function () {
        enquiryForm.reset();
        enquiryForm.style.display = 'block';
        formSuccess.style.display = 'none';
    };

    // === Scroll Reveal Animation ===
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(function () {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                aosObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(function (el) {
        aosObserver.observe(el);
    });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Parallax Effect on Hero ===
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
        }
    });

    // === Phone Number Formatting ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.substring(0, 10);
            if (value.length >= 6) {
                value = value.substring(0, 5) + ' ' + value.substring(5);
            }
            if (value.length >= 2) {
                value = value.substring(0, 2) + ' ' + value.substring(2);
            }
            e.target.value = value;
        });
    }

    // === Property Card Hover Sound Effect (visual) ===
    propertyCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // === Initialize ===
    handleScroll();

});
