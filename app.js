document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Sticky Header Logic
       ========================================================================== */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    /* ==========================================================================
       2. Mobile Navigation Menu
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Hamburger animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================================================
       3. Before/After Comparison Slider
       ========================================================================== */
    const slider = document.getElementById('image-slider');
    const afterContainer = document.getElementById('after-img-container');
    const afterImg = document.getElementById('img-after');
    const handle = document.getElementById('slider-handle');

    if (slider && afterContainer && afterImg && handle) {
        let isDragging = false;

        // Synchronize after image size to match slider container width
        const syncSliderWidth = () => {
            const width = slider.offsetWidth;
            afterImg.style.width = width + 'px';
        };

        window.addEventListener('resize', syncSliderWidth);
        syncSliderWidth(); // Initial sync

        // Slider position updater
        const moveSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Clamping value between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Apply widths and positions
            afterContainer.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        // Mouse events
        handle.addEventListener('mousedown', () => {
            isDragging = true;
            slider.style.cursor = 'ew-resize';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            slider.style.cursor = 'default';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch events for mobile responsiveness
        handle.addEventListener('touchstart', () => {
            isDragging = true;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                moveSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        // Click on slider to move to that position
        slider.addEventListener('click', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            moveSlider(e.clientX);
        });
    }

    /* ==========================================================================
       4. Multi-Step Calculator & Messaging Generator
       ========================================================================== */
    const calcForm = document.getElementById('detailing-calc-form');
    const steps = document.querySelectorAll('.calc-step');
    const indicators = document.querySelectorAll('.step-indicator');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    
    let currentStep = 1;

    const showStep = (stepNum) => {
        steps.forEach(step => step.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        const targetStep = document.querySelector(`.calc-step[data-step="${stepNum}"]`);
        const targetIndicator = document.querySelector(`.step-indicator[data-step="${stepNum}"]`);

        if (targetStep) targetStep.classList.add('active');
        if (targetIndicator) targetIndicator.classList.add('active');
        currentStep = stepNum;
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length) {
                showStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // File upload preview logic
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('upload-preview-container');
    const previewImg = document.getElementById('upload-preview-img');
    const removeBtn = document.getElementById('remove-preview-btn');
    const uploadContent = document.querySelector('.upload-zone-content');

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadContent.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    if (fileInput && uploadZone) {
        fileInput.addEventListener('change', (e) => {
            handleFile(e.target.files[0]);
        });

        // Drag and drop events
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
            }, false);
        });

        uploadZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleFile(files[0]);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering file selection window
            fileInput.value = '';
            previewImg.src = '#';
            previewContainer.style.display = 'none';
            uploadContent.style.display = 'block';
        });
    }

    // Submit handler generating custom Messenger messages
    const getMessageText = () => {
        const carClass = document.querySelector('input[name="car_class"]:checked').value;
        const paintCondition = document.querySelector('input[name="paint_condition"]:checked').value;
        
        const selectedServices = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
            selectedServices.push(cb.value);
        });
        
        const phone = document.getElementById('client-phone').value;
        
        let message = `Здравствуйте! Хочу рассчитать точную стоимость детейлинга для моего авто со скидкой 10%:\n\n`;
        message += `🚗 Класс авто: ${carClass}\n`;
        message += `🌀 Состояние ЛКП: ${paintCondition}\n`;
        message += `🛠️ Выбранные услуги: ${selectedServices.length > 0 ? selectedServices.join(', ') : 'Не выбрано'}\n`;
        message += `📞 Контактный телефон: ${phone}\n\n`;
        message += `*Отправляю фото автомобиля следующим сообщением для оценки стоимости.*`;
        
        return encodeURIComponent(message);
    };

    const submitWhatsapp = document.getElementById('btn-submit-whatsapp');
    const submitTelegram = document.getElementById('btn-submit-telegram');

    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    if (submitWhatsapp) {
        submitWhatsapp.addEventListener('click', (e) => {
            const phoneField = document.getElementById('client-phone');
            if (!phoneField.checkValidity()) {
                phoneField.reportValidity();
                return;
            }
            const message = getMessageText();
            // Premium detailing center phone placeholder: +7 (999) 888-77-66 (79998887766)
            const whatsappUrl = `https://wa.me/79998887766?text=${message}`;
            window.open(whatsappUrl, '_blank', 'noopener');
        });
    }

    if (submitTelegram) {
        submitTelegram.addEventListener('click', (e) => {
            const phoneField = document.getElementById('client-phone');
            if (!phoneField.checkValidity()) {
                phoneField.reportValidity();
                return;
            }
            const message = getMessageText();
            // Detailing bot/support username placeholder: detailing_premium_support
            const telegramUrl = `https://t.me/detailing_premium_support?text=${message}`;
            window.open(telegramUrl, '_blank', 'noopener');
        });
    }

    /* ==========================================================================
       5. FAQ Accordion Animation
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle selected item
            if (!isActive) {
                item.classList.add('active');
                // Set max-height equal to scrollHeight for a smooth expand animation
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       6. Lazy-Loading Map
       ========================================================================== */
    const loadMapBtn = document.getElementById('load-map-btn');
    const mapOverlay = document.querySelector('.map-overlay');
    const mapIframe = document.getElementById('contacts-iframe');

    if (loadMapBtn && mapOverlay && mapIframe) {
        loadMapBtn.addEventListener('click', () => {
            const src = mapIframe.getAttribute('data-src');
            mapIframe.setAttribute('src', src);
            mapOverlay.classList.add('hidden');
        });
    }

    /* ==========================================================================
       7. Scroll Reveal Animation (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // Viewport
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the element is visible
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, observerOptions);
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

});
