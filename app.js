// ===========================================
// Optivex STUDIO - APP.JS (გამართული ვერსია 7.0 - Tawk.to removed)
// ===========================================

// 0. გლობალური UI ცვლადები
const authModal = document.getElementById('authModal');
const openChatBtn = document.getElementById('open-chat-btn');
const loginRegisterBtn = document.getElementById('auth-link-logged-out');
const closeModalBtn = authModal ? authModal.querySelector('.close-btn') : null;

// Dropdown და ნავიგაციის UI ელემენტები
const authLinkLoggedOut = document.getElementById('auth-link-logged-out'); 
const authInfoLoggedIn = document.getElementById('auth-info-logged-in'); 
const userEmailDisplay = document.getElementById('user-email-display');
const logoutButton = document.getElementById('logout-button'); 
const logoutDropdownContent = document.getElementById('logout-dropdown-content'); 

// Burger Menu Elements
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

// 🛑 ფორმის ცვლადები (დეკლარირებულია გლობალურად, ინიციალიზდება DOMContentLoaded-ში)
let loginFormContainer, registerFormContainer, showLoginTab, showRegisterTab, loginForm, loginButton, loginError, registerError, registrationForm, registerButton;

// 🛑 Google Button (ინიციალიზდება DOMContentLoaded-ში)
let googleLoginBtn; 


// ===========================================
// 1. DOM-ზე დამოკიდებული ლოგიკა (UI, Animations, Burger Menu)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {

    // 🛑 1.0. ფორმის ცვლადების ინიციალიზაცია (აქ გარანტირებულია, რომ ელემენტები არსებობს)
    loginFormContainer = document.getElementById('login-form-container');
    registerFormContainer = document.getElementById('register-form-container');
    showLoginTab = document.getElementById('show-login-tab');
    showRegisterTab = document.getElementById('show-register-tab');
    loginForm = document.getElementById('loginForm');
    loginButton = document.getElementById('loginButton');
    loginError = document.getElementById('login-error');
    registerError = document.getElementById('register-error');
    registrationForm = document.getElementById('registrationForm');
    registerButton = document.getElementById('registerButton');
    
    // 🛑 Google Button Initialization
    googleLoginBtn = document.getElementById('google-login-button');
    
    // 1.1 Loader-ის დამალვა
    const loader = document.getElementById('site-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 600);
    }

    // 1.2 Smooth Scroll
    document.querySelectorAll('nav a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    // 1.3 Reveal Animations
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('revealed');
                en.target.classList.remove('revealer');
            }
        });
    }, { threshold: .12 });
    document.querySelectorAll('.revealer').forEach(el => io.observe(el));


    // 1.4 Lightbox Logic
    const lb = document.getElementById('lightbox');
    const lbImg = lb ? lb.querySelector('img') : null;

    document.querySelectorAll('[data-preview-open]').forEach(btn => btn.addEventListener('click', e => {
        if (lb && lbImg) {
            const card = btn.closest('.project-card');
            const img = card.querySelector('.project-media img');
            lbImg.src = img.src;
            lb.classList.add('active');
            lb.setAttribute('aria-hidden', 'false');
        }
    }));

    if (lb) {
        lb.addEventListener('click', () => {
            lb.classList.remove('active');
            lb.setAttribute('aria-hidden', 'true');
            if (lbImg) lbImg.src = '';
        });
    }

    // 1.5 Burger Menu & Navbar Scroll Logic
    
    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 50) { 
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
    
    // Burger Menu Logic
    if (burger && navMenu) {
        const toggleMenu = () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('open');
        };
        
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    
        document.addEventListener('click', (e) => {
            const clickedInsideMenu = navMenu.contains(e.target) || burger.contains(e.target);
            if (!clickedInsideMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    }

    // ===========================================
    // 🛑 5. მოდალის, შესვლისა და რეგისტრაციის ლოგიკა (DOMContentLoaded-ში)
    // ===========================================

    // --- მოდალის გამოჩენა/დამალვა ---

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'none';
        });
    }

    if (authModal) {
        window.addEventListener('click', (event) => {
            if (event.target == authModal) {
                authModal.style.display = 'none';
            }
        });
    }


    // --- ტაბებს შორის გადართვა ---
    function switchTab(showLogin) {
        if (!loginFormContainer || !registerFormContainer || !showLoginTab || !showRegisterTab) return;

        if (showLogin) {
            loginFormContainer.style.display = 'block';
            registerFormContainer.style.display = 'none';
            showLoginTab.classList.add('active-tab');
            showRegisterTab.classList.remove('active-tab');
        } else {
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
            showLoginTab.classList.remove('active-tab');
            showRegisterTab.classList.add('active-tab');
        }
        if(loginError) loginError.textContent = ''; 
        if(registerError) registerError.textContent = '';
    }

    if (showLoginTab) showLoginTab.addEventListener('click', () => switchTab(true));
    if (showRegisterTab) showRegisterTab.addEventListener('click', () => switchTab(false));


    // --- 5.1 Google Login (OAuth) ლოგიკა ---

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof auth === 'undefined') return;
            
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    if (authModal) authModal.style.display = 'none';
                    alert(`Welcome, ${result.user.email}!`);
                })
                .catch((error) => {
                    const currentErrorDisplay = loginFormContainer.style.display === 'block' ? loginError : registerError;
                    if(currentErrorDisplay) currentErrorDisplay.textContent = `Google Login Error: ${error.code.replace('auth/', '').replace(/-/g, ' ')}`;
                });
        });
    }


    // --- 5.2 შესვლა (Login) ლოგიკა ---
    if (loginButton && loginForm) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = loginForm.elements['email'].value;
            const password = loginForm.elements['password'].value;
            
            if(loginError) loginError.textContent = ''; 
            
            if (typeof auth === 'undefined') {
                if(loginError) loginError.textContent = 'Firebase is not ready. Please try again.';
                return;
            }

            auth.signInWithEmailAndPassword(email, password) 
                .then(() => {
                    if (authModal) authModal.style.display = 'none';
                })
                .catch((error) => {
                    if(loginError) loginError.textContent = `Error: ${error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ')}`;
                });
        });
    }


    // --- 5.3 რეგისტრაცია (Register) ლოგიკა ---
    if (registerButton && registrationForm) { 
        registerButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            console.log('Attempting registration...'); 

            const email = registrationForm.elements['email'].value;
            const password = registrationForm.elements['password'].value;
            const confirmPassword = registrationForm.elements['confirm_password'].value;
            
            if(registerError) registerError.textContent = ''; 
            
            // 1. Password Match Check
            if (password !== confirmPassword) {
                if(registerError) registerError.textContent = 'Passwords do not match.';
                return;
            }
            
            if (typeof auth === 'undefined') {
                if(registerError) registerError.textContent = 'Firebase is not ready. Please try again.';
                return;
            }

            // Firebase-ის რეგისტრაცია
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('User created successfully.');
                    alert('Registration successful! Welcome.');
                    if (authModal) authModal.style.display = 'none';
                })
                .catch((error) => {
                    console.error('Registration Failed:', error);
                    if(registerError) registerError.textContent = `Error: ${error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ')}`;
                });
        });
    }
    
    // --- გასვლა (Logout) ლოგიკა ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (typeof auth === 'undefined') return;
            auth.signOut()
                .then(() => {
                    alert('You have been logged out successfully.');
                })
                .catch((error) => {
                    alert('Logout Error: ' + error.message);
                });
        });
    }

}); // END OF DOMContentLoaded



document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. აქტიური კლასის შეცვლა ღილაკებზე
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // 2. პროექტების გაფილტვრა
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'block';
                    // მცირე დაყოვნება ანიმაციისთვის
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    // ანიმაციის დასრულების შემდეგ დამალვა
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});


// ===========================================
// 2. Contact Form Submission (Formspree) (GLOBAL)
// ===========================================

const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                alert('Message sent — we will reply shortly');
                form.reset();
            } else {
                alert('Problem sending message — try email');
            }

        } catch (err) {
            alert('Network error — email info@optivexstudio.com');
        }

        btn.disabled = false;
        btn.textContent = 'Send Message';
    });
}

// ===========================================
// 3. Firebase Auth UI მართვა (GLOBAL)
// ===========================================

if (openChatBtn) {
    openChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (typeof auth === 'undefined' || !auth.currentUser) {
            if (authModal) {
                authModal.style.display = 'block';
            }
        } else {
            // Open Intergram chat
            if (typeof window.openOptivexChat === 'function') {
                window.openOptivexChat();
            }
        }
    });
}

if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged((user) => {
        if (user) {
            if (authLinkLoggedOut) authLinkLoggedOut.style.display = 'none';
            if (authInfoLoggedIn) authInfoLoggedIn.style.display = 'flex'; 
            
            // Display Name: ყოველთვის აჩვენებს Email-ის ნაწილს
            let displayName = user.email ? user.email.split('@')[0] : 'User';
            if (userEmailDisplay) userEmailDisplay.textContent = displayName;

            if (logoutDropdownContent) logoutDropdownContent.style.display = 'none';
            
        } else {
            if (authLinkLoggedOut) authLinkLoggedOut.style.display = 'block';
            if (authInfoLoggedIn) authInfoLoggedIn.style.display = 'none'; 
        }
    });
}


// ===========================================
// 4. Connect with Support ღილაკის ლოგიკა (GLOBAL)
// ===========================================

if (openChatBtn) {
    openChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (typeof auth === 'undefined' || !auth.currentUser) {
            if (authModal) {
                authModal.style.display = 'block';
            }
        } else {
            // TODO: Open our custom chat widget here
            console.log('Opening custom chat...');
        }
    });
}

if (loginRegisterBtn) {
    loginRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (authModal) {
            authModal.style.display = 'block';
        }
    });
}


// ===========================================
// 6. Dropdown-ის მართვის ლოგიკა (GLOBAL)
// ===========================================

if (userEmailDisplay && logoutDropdownContent && authInfoLoggedIn) {
    userEmailDisplay.addEventListener('click', (event) => {
        event.stopPropagation(); 
        if (logoutDropdownContent.style.display === 'block') {
            logoutDropdownContent.style.display = 'none';
        } else {
            logoutDropdownContent.style.display = 'block';
        }
    });

    document.addEventListener('click', (event) => {
        const isClickInside = authInfoLoggedIn.contains(event.target);
        if (!isClickInside && logoutDropdownContent.style.display === 'block') {
            logoutDropdownContent.style.display = 'none';
        }
    });
}