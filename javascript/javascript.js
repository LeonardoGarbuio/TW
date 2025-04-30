document.addEventListener('DOMContentLoaded', function() {
    // Navegação suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Atualiza URL sem recarregar página
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Menu mobile toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('#main-nav ul');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Header scroll behavior
    const header = document.querySelector('#header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('hide-header');
        } else {
            header.classList.remove('hide-header');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Testimonial slider
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    
    function updateTestimonialSlider(index) {
        if (!testimonialTrack) return;
        
        currentSlide = index;
        
        // Atualizar posição do slider
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Atualizar dots de navegação
        testimonialDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
            dot.setAttribute('aria-current', idx === currentSlide);
        });
    }
    
    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateTestimonialSlider(index);
            });
        });
    }
    
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => {
            const newIndex = (currentSlide - 1 + testimonialDots.length) % testimonialDots.length;
            updateTestimonialSlider(newIndex);
        });
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => {
            const newIndex = (currentSlide + 1) % testimonialDots.length;
            updateTestimonialSlider(newIndex);
        });
    }
    
    // Form validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Validação de email
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // Aqui viria a lógica de envio do formulário
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            } else {
                alert('Por favor, preencha corretamente todos os campos obrigatórios.');
            }
        });
    }
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Mostrar/ocultar o botão conforme o scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
    
    // Animação de revelação de elementos no scroll
    function revealOnScroll() {
        const revealElements = document.querySelectorAll('.reveal');
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Adicionar classe 'reveal' aos elementos que queremos animar
    function setupRevealElements() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('reveal');
        });
        
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.add('reveal');
        });
        
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.add('reveal');
        });
    }
    
    // Inicializar animações
    setupRevealElements();
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Executar uma vez para elementos já visíveis
    
    // Carrossel automático para depoimentos
    let testimonialInterval;
    
    function startTestimonialCarousel() {
        if (!testimonialTrack) return;
        
        testimonialInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % testimonialDots.length;
            updateTestimonialSlider(nextSlide);
        }, 5000); // Intervalo de 5 segundos
    }
    
    function stopTestimonialCarousel() {
        clearInterval(testimonialInterval);
    }
    
    // Iniciar carrossel automático
    startTestimonialCarousel();
    
    // Parar o carrossel quando o usuário interagir com os controles
    if (testimonialTrack) {
        const testimonialControls = document.querySelector('.testimonial-navigation');
        if (testimonialControls) {
            testimonialControls.addEventListener('mouseenter', stopTestimonialCarousel);
            testimonialControls.addEventListener('mouseleave', startTestimonialCarousel);
        }
    }
    
    // Lazy loading de imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
});