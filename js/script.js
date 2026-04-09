document.addEventListener('DOMContentLoaded', () => {

    // Standard elements
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    // --- PHASE 2: SCROLL REVEAL LOGIC REMOVED ---

    // Mobile menu toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (!navLinks || !navActions) return;
            navLinks.classList.toggle('mobile-active');
            navActions.classList.toggle('mobile-active');
            document.body.classList.toggle('no-scroll');
            
            const icon = menuBtn.querySelector('i');
            if (!icon) return;
            if (navLinks.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.nav-item, .nav-actions .btn, .dropdown-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Updated to match CSS max-width 1150px
            if (window.innerWidth <= 1150) {
                if (navLinks) navLinks.classList.remove('mobile-active');
                if (navActions) navActions.classList.remove('mobile-active');
                document.body.classList.remove('no-scroll');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('i');
                    if (!icon) return;
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- STORE LOGIC ---
    // 1. Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Shopping Cart Array & UI
    let cart = [];
    const cartToggleBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total');

    function toggleCart() {
        if(cartSidebar) {
            cartSidebar.classList.toggle('active');
            if (cartOverlay) cartOverlay.classList.toggle('active');
            
            // Hide/Show floating button on click
            const cartFloatBtn = document.getElementById('cart-btn-float');
            if(cartFloatBtn) {
                if(cartSidebar.classList.contains('active')) {
                    cartFloatBtn.style.opacity = '0';
                    cartFloatBtn.style.visibility = 'hidden';
                    cartFloatBtn.style.transform = 'scale(0.8)';
                } else {
                    cartFloatBtn.style.opacity = '1';
                    cartFloatBtn.style.visibility = 'visible';
                    cartFloatBtn.style.transform = 'scale(1)';
                }
            }
        }
    }
    
    if(cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    const cartFloatBtn = document.getElementById('cart-btn-float');
    if(cartFloatBtn) cartFloatBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    const addBtns = document.querySelectorAll('.add-to-cart');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check array
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            // Visual feedback on the button
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = 'var(--brand-orange)';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.background = ''; // reset
            }, 1000);

            // Update UI list
            updateCartUI();
        });
    });

    function updateCartUI() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        } else {
            cart.forEach((item, index) => {
                totalItems += item.quantity;
                totalPrice += (item.price * item.quantity);

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        // Update all cart count indicators (navbar and floating)
        document.querySelectorAll('#cart-count, #cart-count-float').forEach(el => {
            el.innerText = totalItems;
        });
        if(cartTotalPrice) cartTotalPrice.innerText = '$' + totalPrice.toFixed(2);

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1); // remove from array
                updateCartUI();
            });
        });
    }


    // --- PARTICLE CANVAS LOGIC: INTERACTIVE CONSTELLATION & BURST ---
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let pulses = [];
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 60 : 120;
        
        let mouse = { x: null, y: null, radius: isMobile ? 80 : 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.baseSize = Math.random() * 3 + 1; // Improved size variance
                this.size = this.baseSize;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.friction = 0.96; // Slightly more liquid damping
                this.accX = 0;
                this.accY = 0;
            }

            update() {
                // Mouse interaction (Burst effect)
                if (mouse.x !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        let strength = force * 20; // Increased burst intensity
                        
                        this.accX += directionX * strength;
                        this.accY += directionY * strength;
                        this.size = this.baseSize * 1.5;
                    } else {
                        this.size += (this.baseSize - this.size) * 0.1;
                    }
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                }

                this.vx += this.accX;
                this.vy += this.accY;
                
                this.x += this.vx;
                this.y += this.vy;

                // Damping
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.accX *= 0.4;
                this.accY *= 0.4;

                // Subtle ambient drift
                this.vx += (Math.random() - 0.5) * 0.04;
                this.vy += (Math.random() - 0.5) * 0.04;

                // Boundary check
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                if (this.size > this.baseSize + 0.5) {
                    ctx.shadowBlur = 12; // Brighter glow when repelled
                    ctx.shadowColor = '#00E5FF';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        class CircuitPulse {
            constructor() {
                this.reset();
            }

            reset() {
                this.p1 = particles[Math.floor(Math.random() * particles.length)];
                this.findTarget();
                this.progress = 0;
                this.speed = Math.random() * 0.02 + 0.01;
                this.alive = true;
                this.hops = 0;
                this.maxHops = 3 + Math.floor(Math.random() * 3);
            }

            findTarget() {
                // Find a nearby particle to hop to
                let neighbors = particles.filter(p => {
                    if (p === this.p1) return false;
                    let dist = Math.sqrt(Math.pow(p.x - this.p1.x, 2) + Math.pow(p.y - this.p1.y, 2));
                    return dist < 150;
                });

                if (neighbors.length > 0) {
                    this.p2 = neighbors[Math.floor(Math.random() * neighbors.length)];
                } else {
                    this.alive = false;
                }
            }

            update() {
                if (!this.alive) {
                    this.reset();
                    return;
                }

                this.progress += this.speed;
                if (this.progress >= 1) {
                    this.p1 = this.p2;
                    this.progress = 0;
                    this.hops++;
                    if (this.hops >= this.maxHops) {
                        this.reset();
                    } else {
                        this.findTarget();
                    }
                }
            }

            draw() {
                if (!this.alive || !this.p1 || !this.p2) return;
                
                let x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
                let y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00E5FF';
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function init() {
            particles = [];
            pulses = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            let pulseCount = isMobile ? 5 : 12;
            for (let i = 0; i < pulseCount; i++) {
                pulses.push(new CircuitPulse());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Constellation lines
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - distance / 150)})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            pulses.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }
        
        resize();
        animate();
    }

    // --- WHATSAPP INTEGRATION & FORMS ---
    const WHATSAPP_PHONE = '51906681667';

    function formatWhatsAppOrder(cart, userDetails) {
        let message = `🚀 *NUEVO PEDIDO SAIDEX 4.0*\n`;
        message += `---------------------------\n`;
        message += `👤 *Cliente:* ${userDetails.name}\n`;
        message += `📍 *Dirección:* ${userDetails.address}\n\n`;
        message += `🛒 *PRODUCTOS:*\n`;
        
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `- ${item.quantity}x ${item.name} ... $${subtotal.toFixed(2)}\n`;
            total += subtotal;
        });

        message += `\n---------------------------\n`;
        message += `💰 *TOTAL A PAGAR:* $${total.toFixed(2)}\n`;
        message += `---------------------------\n`;
        message += `_Enviado desde la Tienda Inteligente_`;
        return encodeURIComponent(message);
    }

    function sendToWhatsApp(message) {
        // Unique Design: Loading animation before redirection
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(10px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10000; color: #FFF; font-family: 'Inter', sans-serif;
        `;
        overlay.innerHTML = `
            <div class="loader-neon" style="width: 60px; height: 60px; border: 4px solid #00E5FF; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 0 20px #00E5FF;"></div>
            <h3 style="letter-spacing: 2px; color: #00E5FF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);">CONECTANDO CON SAIDEX...</h3>
            <p style="margin-top: 10px; opacity: 0.7;">Sincronizando despacho por WhatsApp</p>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
            document.body.removeChild(overlay);
        }, 1500);
    }

    // --- VISIT MODAL LOGIC (Updated for WA) ---
    const visitModal = document.getElementById('visit-modal');
    const openVisitBtn = document.getElementById('btn-agenda-visita');
    const closeVisitBtn = document.getElementById('close-visit-modal');
    const visitForm = document.getElementById('visita-tecnica-form');

    if (openVisitBtn && visitModal) {
        openVisitBtn.addEventListener('click', () => {
            visitModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        if (closeVisitBtn) {
            closeVisitBtn.addEventListener('click', () => {
                visitModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === visitModal) {
                visitModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        if (visitForm) {
            visitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get data
                const name = visitForm.querySelector('input[type="text"]').value;
                const phone = visitForm.querySelector('input[type="tel"]').value;
                const type = visitForm.querySelector('select').value;
                const date = visitForm.querySelector('input[type="date"]').value;
                const desc = visitForm.querySelector('textarea').value;

                let waMsg = `🛠 *SOLICITUD TÉCNICA ESPECIALIZADA*\n`;
                waMsg += `---------------------------\n`;
                waMsg += `👤 *Nombre:* ${name}\n`;
                waMsg += `📞 *Teléfono:* ${phone}\n`;
                waMsg += `⚙️ *Servicio:* ${type}\n`;
                waMsg += `📅 *Fecha:* ${date}\n`;
                waMsg += `📝 *Detalle:* ${desc || 'Sin comentarios'}\n`;
                waMsg += `---------------------------\n`;
                waMsg += `_Sincronizado vía SAIDEX Web_`;

                sendToWhatsApp(encodeURIComponent(waMsg));
                visitForm.reset();
                visitModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // --- STORE CHECKOUT LOGIC ---
    const checkoutBtn = document.querySelector('.btn-checkout'); // Added in HTML
    const checkoutModal = document.getElementById('checkout-modal'); // Added in HTML
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            if (!checkoutModal) return;
            checkoutModal.classList.add('active');
            // Hide cart sidebar
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
        if (closeCheckoutBtn && checkoutModal) {
            closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
        }
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userData = {
                    name: document.getElementById('check-name').value,
                    address: document.getElementById('check-address').value
                };
                
                const message = formatWhatsAppOrder(cart, userData);
                sendToWhatsApp(message);
                
                // Finalize
                checkoutModal.classList.remove('active');
                cart = [];
                updateCartUI();
            });
        }
    }

    // --- STATS COUNTER ANIMATION ---
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;
        const speed = 100; // Counter progression speed

        const animate = (counter) => {
            const target = +counter.getAttribute('data-target');
            const count = parseInt(counter.innerText.replace(/\D/g, ''), 10) || 0;
            const inc = Math.max(1, target / speed);

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(() => animate(counter), 20);
            } else {
                counter.innerText = target;
            }
        };

        const observerOptions = {
            threshold: 0.2
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(counter => animate(counter));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- SCROLL REVEAL ANIMATIONS ---
    function initScrollReveal() {
        const revealEls = document.querySelectorAll('.scroll-bounce');
        if (revealEls.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observerOptions = {
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Once visible, we can stop observing
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealEls.forEach(el => observer.observe(el));
    }

    // Initialize all restored features
    initCounterAnimations();
    initScrollReveal();
});
