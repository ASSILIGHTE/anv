/**
 * ====================================================================
 * ROMANTIC ANNIVERSARY WEBSITE - APPLICATION LOGIC
 * Theme: Midnight Starry Romance (Twinkling Stars & Cute Polaroid Frame)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG === 'undefined') {
        console.error('Config file not loaded!');
        return;
    }

    // ----------------------------------------------------------------
    // 1. INITIALIZE HERO & TEXT DATA FROM CONFIG
    // ----------------------------------------------------------------
    if (CONFIG.heroSubtitleTop) {
        document.getElementById('heroBadge').textContent = CONFIG.heroSubtitleTop;
    }
    document.getElementById('partnerNameDisplay').textContent = CONFIG.partnerName;
    document.getElementById('footerPartnerName').textContent = CONFIG.partnerName;
    document.getElementById('heroSubtitle').textContent = CONFIG.heroSubtitle || "Jarak terbentang tak pernah mengurangi hangatnya rasa cintaku padamu.";
    
    if (CONFIG.heroPhoto) {
        const heroPhotoImg = document.getElementById('heroPhotoImg');
        if (heroPhotoImg) heroPhotoImg.src = CONFIG.heroPhoto;
    }

    if (CONFIG.heroPhotoTag) {
        const heroPhotoTagText = document.getElementById('heroPhotoTagText');
        if (heroPhotoTagText) heroPhotoTagText.textContent = CONFIG.heroPhotoTag;
    }

    if (CONFIG.yourName && CONFIG.yourName !== "Aku") {
        document.getElementById('heroCouple').innerHTML = `<i class="fa-solid fa-heart-circle-bolt"></i> ${CONFIG.yourName} & ${CONFIG.partnerName}`;
    }

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // ----------------------------------------------------------------
    // 2. TIMELINE RENDERER
    // ----------------------------------------------------------------
    const timelineContainer = document.getElementById('timelineContainer');
    if (timelineContainer && CONFIG.timeline) {
        timelineContainer.innerHTML = CONFIG.timeline.map((item) => `
            <div class="timeline-item reveal-on-scroll">
                <div class="timeline-icon">${item.icon || '✨'}</div>
                <div class="timeline-content">
                    <span class="timeline-date">${item.date}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------
    // 3. MEMORY GALLERY RENDERER & LIGHTBOX LOGIC
    // ----------------------------------------------------------------
    const galleryGrid = document.getElementById('galleryGrid');
    let currentPhotoIndex = 0;

    if (galleryGrid && CONFIG.gallery) {
        galleryGrid.innerHTML = CONFIG.gallery.map((item, index) => `
            <div class="gallery-card reveal-on-scroll" data-index="${index}">
                <img src="${item.image}" alt="${item.caption}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-category">${item.category || 'Memory'}</span>
                    <div class="gallery-caption">${item.caption}</div>
                </div>
            </div>
        `).join('');

        const galleryCards = document.querySelectorAll('.gallery-card');
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-index'));
                openLightbox(idx);
            });
        });
    }

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    function openLightbox(index) {
        if (!CONFIG.gallery || CONFIG.gallery.length === 0) return;
        currentPhotoIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = CONFIG.gallery[currentPhotoIndex];
        if (item) {
            lightboxImg.src = item.image;
            lightboxCaption.textContent = item.caption;
        }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
        updateLightboxContent();
    });
    lightboxNext.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % CONFIG.gallery.length;
        updateLightboxContent();
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentPhotoIndex = (currentPhotoIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
            updateLightboxContent();
        }
        if (e.key === 'ArrowRight') {
            currentPhotoIndex = (currentPhotoIndex + 1) % CONFIG.gallery.length;
            updateLightboxContent();
        }
    });

    // ----------------------------------------------------------------
    // 4. ANIMATED 3D ENVELOPE OPENING & LOVE LETTER LOGIC
    // ----------------------------------------------------------------
    const envelope3DWrapper = document.getElementById('envelope3DWrapper');
    const envelopeBox = document.getElementById('envelopeBox');
    const waxSealBtn = document.getElementById('waxSealBtn');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const envelopePaperPeek = document.getElementById('envelopePaperPeek');
    const envelopeHintText = document.getElementById('envelopeHintText');
    const letterCard = document.getElementById('letterCard');
    let envelopeOpened = false;

    function open3DEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        waxSealBtn.classList.add('broken');
        
        setTimeout(() => {
            envelopeFlap.classList.add('open');
        }, 200);

        setTimeout(() => {
            envelopePaperPeek.classList.add('slide-up');
        }, 400);

        setTimeout(() => {
            envelopeBox.classList.add('opened-fade');
            if (envelopeHintText) envelopeHintText.style.display = 'none';
        }, 700);

        setTimeout(() => {
            if (envelope3DWrapper) envelope3DWrapper.style.display = 'none';
            letterCard.classList.add('open');
            createHeartBurst(40);
        }, 1000);
    }

    if (waxSealBtn) waxSealBtn.addEventListener('click', open3DEnvelope);
    if (envelopeBox) envelopeBox.addEventListener('click', open3DEnvelope);

    if (CONFIG.loveLetter) {
        document.getElementById('letterGreeting').textContent = CONFIG.loveLetter.greeting || "Untuk kamu,";
        const letterBody = document.getElementById('letterBody');
        letterBody.innerHTML = CONFIG.loveLetter.paragraphs.map(p => `<p>${p}</p>`).join('');
        document.getElementById('letterClosing').textContent = CONFIG.loveLetter.closing || "Selamat Anniversary, Sayang.";
        document.getElementById('letterSignature').textContent = CONFIG.loveLetter.signature || "I love you, always & forever ❤️";
    }

    // ----------------------------------------------------------------
    // 5. REASONS WHY I LOVE YOU RENDERER
    // ----------------------------------------------------------------
    const reasonsGrid = document.getElementById('reasonsGrid');
    if (reasonsGrid && CONFIG.reasons) {
        reasonsGrid.innerHTML = CONFIG.reasons.map(r => `
            <div class="reason-card reveal-on-scroll">
                <div class="reason-number">${r.number}</div>
                <h3 class="reason-title">${r.title}</h3>
                <p class="reason-desc">${r.description}</p>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------
    // 6. SWEET LOVE COUPONS RENDERER
    // ----------------------------------------------------------------
    const couponsGrid = document.getElementById('couponsGrid');
    if (couponsGrid && CONFIG.loveCoupons) {
        couponsGrid.innerHTML = CONFIG.loveCoupons.map(c => `
            <div class="coupon-card reveal-on-scroll">
                <div class="coupon-icon">${c.icon}</div>
                <h3 class="coupon-title">${c.title}</h3>
                <p class="coupon-desc">${c.desc}</p>
                <button class="btn-coupon" onclick="alert('Voucher ini telah berhasil kamu klaim! Tunjukkan pesan ini padaku ❤️')">Tukarkan Voucher ✨</button>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------
    // 7. FAVORITE MOMENTS CAROUSEL (Touch Swiper)
    // ----------------------------------------------------------------
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.getElementById('carouselDots');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    let currentSlide = 0;
    let slideCount = 0;

    if (carouselTrack && CONFIG.carousel) {
        slideCount = CONFIG.carousel.length;
        carouselTrack.innerHTML = CONFIG.carousel.map(item => `
            <div class="carousel-slide">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="carousel-caption">
                    <h3>${item.title}</h3>
                    <p>${item.subtitle}</p>
                </div>
            </div>
        `).join('');

        carouselDots.innerHTML = CONFIG.carousel.map((_, i) => `
            <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Slide ${i+1}"></button>
        `).join('');

        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.getAttribute('data-slide'));
                updateCarousel();
            });
        });
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
        });
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        });
    }

    let startX = 0;
    let isSwiping = false;

    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    currentSlide = (currentSlide + 1) % slideCount;
                } else {
                    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                }
                updateCarousel();
            }
            isSwiping = false;
        });
    }

    // ----------------------------------------------------------------
    // 8. REAL-TIME ANNIVERSARY COUNTER
    // ----------------------------------------------------------------
    const startDate = new Date(CONFIG.anniversaryDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('counterDateSubtitle').textContent = startDate.toLocaleDateString('id-ID', options);

    function updateCounter() {
        const now = new Date();
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        document.getElementById('countYears').textContent = years >= 0 ? years : 0;
        document.getElementById('countMonths').textContent = months >= 0 ? months : 0;
        document.getElementById('countDays').textContent = days >= 0 ? days : 0;
        document.getElementById('countHours').textContent = hours;
        document.getElementById('countMinutes').textContent = minutes;
        document.getElementById('countSeconds').textContent = seconds;
    }

    updateCounter();
    setInterval(updateCounter, 1000);

    // ----------------------------------------------------------------
    // 9. FINAL SURPRISE & POPUP MODAL
    // ----------------------------------------------------------------
    if (CONFIG.finalQuote) {
        document.getElementById('finalQuote').textContent = `"${CONFIG.finalQuote}"`;
    }
    if (CONFIG.finalSubtitle) {
        document.getElementById('finalSignature').textContent = `${CONFIG.finalSubtitle}, ${CONFIG.partnerName} ❤️`;
    }

    const surpriseModal = document.getElementById('surpriseModal');
    const surpriseClose = document.getElementById('surpriseClose');
    const surpriseOkBtn = document.getElementById('surpriseOkBtn');
    const loveBurstBtn = document.getElementById('loveBurstBtn');

    if (CONFIG.surpriseMessage) {
        document.getElementById('surpriseBody').textContent = CONFIG.surpriseMessage;
    }

    function openSurpriseModal() {
        createHeartBurst(50);
        surpriseModal.classList.add('active');
    }

    function closeSurpriseModal() {
        surpriseModal.classList.remove('active');
    }

    if (loveBurstBtn) loveBurstBtn.addEventListener('click', openSurpriseModal);
    if (surpriseClose) surpriseClose.addEventListener('click', closeSurpriseModal);
    if (surpriseOkBtn) surpriseOkBtn.addEventListener('click', closeSurpriseModal);

    function createHeartBurst(count) {
        const icons = ['✨', '⭐', '💫', '💖', '🌹', '❤️', '🌟', '📜'];
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            heart.style.transition = `transform ${Math.random() * 2.5 + 2}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${Math.random() * 2.5 + 2}s ease`;
            
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.transform = `translateY(-${Math.random() * 85 + 75}vh) rotate(${Math.random() * 360}deg)`;
                heart.style.opacity = '0';
            }, 50);

            setTimeout(() => {
                heart.remove();
            }, 4500);
        }
    }

    // ----------------------------------------------------------------
    // 10. INTERACTIVE CURSOR SPARKLES TRAIL
    // ----------------------------------------------------------------
    let lastSparkleTime = 0;
    const sparkleIcons = ['✨', '⭐', '💫', '💖'];

    function createCursorSparkle(x, y) {
        const now = Date.now();
        if (now - lastSparkleTime < 60) return;
        lastSparkleTime = now;

        const sparkle = document.createElement('span');
        sparkle.className = 'cursor-sparkle';
        sparkle.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 850);
    }

    document.addEventListener('mousemove', (e) => createCursorSparkle(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            createCursorSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // ----------------------------------------------------------------
    // 11. MUSIC PLAYER LOGIC
    // ----------------------------------------------------------------
    const bgAudio = document.getElementById('bgAudio');
    const musicBtn = document.getElementById('musicBtn');
    const musicStatusText = document.getElementById('musicStatusText');
    const musicTitleText = document.getElementById('musicTitleText');

    if (CONFIG.musicTitle) {
        musicTitleText.textContent = CONFIG.musicTitle;
    }

    if (CONFIG.musicPath) {
        const source = bgAudio.querySelector('source');
        if (source) source.src = CONFIG.musicPath;
        bgAudio.load();
    }

    let isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            bgAudio.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
            musicStatusText.textContent = 'Dihentikan';
            isPlaying = false;
        } else {
            bgAudio.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                musicStatusText.textContent = 'Sedang Diputar 🎵';
                isPlaying = true;
            }).catch(err => {
                console.warn('Autoplay blocked or audio failed:', err);
                musicStatusText.textContent = 'Klik untuk Putar 🎵';
            });
        }
    }

    musicBtn.addEventListener('click', toggleMusic);

    const handleFirstInteraction = () => {
        if (!isPlaying) {
            bgAudio.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                musicStatusText.textContent = 'Sedang Diputar 🎵';
                isPlaying = true;
            }).catch(() => {});
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    // ----------------------------------------------------------------
    // 12. MOBILE NAVIGATION TOGGLE
    // ----------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------------
    // 13. REVEAL OBSERVER
    // ----------------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // ----------------------------------------------------------------
    // 14. MIDNIGHT STARRY CANVAS ENGINE (Stars & Shooting Stars)
    // ----------------------------------------------------------------
    const canvas = document.getElementById('heartsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class StarParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.5;
                this.maxOpacity = Math.random() * 0.75 + 0.25;
                this.opacity = Math.random() * this.maxOpacity;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.growing = Math.random() > 0.5;
                this.color = Math.random() > 0.3 ? '#FFD700' : '#EC4899';
            }

            update() {
                if (this.growing) {
                    this.opacity += this.twinkleSpeed;
                    if (this.opacity >= this.maxOpacity) this.growing = false;
                } else {
                    this.opacity -= this.twinkleSpeed;
                    if (this.opacity <= 0.05) this.growing = true;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width * 0.7;
                this.y = Math.random() * height * 0.4;
                this.length = Math.random() * 80 + 50;
                this.speed = Math.random() * 10 + 8;
                this.size = Math.random() * 2 + 1;
                this.opacity = 0;
                this.active = false;
                this.timer = Math.random() * 200 + 100;
            }

            update() {
                if (!this.active) {
                    this.timer--;
                    if (this.timer <= 0) {
                        this.active = true;
                        this.opacity = 1;
                    }
                    return;
                }

                this.x += this.speed;
                this.y += this.speed * 0.6;
                this.opacity -= 0.015;

                if (this.opacity <= 0 || this.x > width || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                if (!this.active || this.opacity <= 0) return;

                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const grad = ctx.createLinearGradient(
                    this.x, this.y,
                    this.x - this.length, this.y - this.length * 0.6
                );
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.3, '#FFD700');
                grad.addColorStop(1, 'transparent');

                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.length, this.y - this.length * 0.6);
                ctx.stroke();

                ctx.restore();
            }
        }

        const stars = Array.from({ length: 90 }, () => new StarParticle());
        const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            shootingStars.forEach(s => {
                s.update();
                s.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
});
