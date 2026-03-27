document.addEventListener('DOMContentLoaded', function () {

    var navbar = document.querySelector('.navbar');
    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    var cursorFollower = document.querySelector('.cursor-follower');
    var bookingForm = document.getElementById('booking-form');
    var fechaInput = document.getElementById('fecha');

    if (fechaInput) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        fechaInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var isValid = true;
            var requiredFields = bookingForm.querySelectorAll('[required]');

            requiredFields.forEach(function (field) {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                }
            });

            if (!isValid) return;

            var nombre = document.getElementById('nombre').value.trim();
            var especialidad = document.getElementById('especialidad').value;
            var fecha = document.getElementById('fecha').value;
            var obraSocial = document.getElementById('obra-social').value.trim();
            var mensaje = document.getElementById('mensaje').value.trim();

            var fechaFormateada = '';
            if (fecha) {
                var partes = fecha.split('-');
                fechaFormateada = partes[2] + '/' + partes[1] + '/' + partes[0];
            }

            var texto = 'Hola, quisiera solicitar un turno.\n\n';
            texto += '*Nombre:* ' + nombre + '\n';
            texto += '*Especialidad:* ' + especialidad + '\n';
            if (fechaFormateada) texto += '*Fecha preferida:* ' + fechaFormateada + '\n';
            if (obraSocial) texto += '*Obra Social:* ' + obraSocial + '\n';
            if (mensaje) texto += '*Observaciones:* ' + mensaje + '\n';

            var url = 'https://wa.me/5493624862592?text=' + encodeURIComponent(texto);
            window.open(url, '_blank');
        });

        bookingForm.querySelectorAll('[required]').forEach(function (field) {
            field.addEventListener('input', function () {
                if (this.value.trim()) {
                    this.classList.remove('error');
                }
            });
        });
    }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', function (e) {
            cursorFollower.style.opacity = '1';
            cursorFollower.style.left = e.clientX - 10 + 'px';
            cursorFollower.style.top = e.clientY - 10 + 'px';
        });

        document.querySelectorAll('a, button, .bento-tile, .testimonial-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursorFollower.style.transform = 'scale(2)';
                cursorFollower.style.borderColor = 'rgba(192, 57, 43, .5)';
            });
            el.addEventListener('mouseleave', function () {
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = '';
            });
        });
    }

    var revealElements = document.querySelectorAll('.reveal');
    var observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    var countersDone = false;
    var statsSection = document.querySelector('.hero-stats');

    function animateCounters() {
        if (countersDone) return;
        countersDone = true;
        document.querySelectorAll('.stat strong, .about-experience strong').forEach(function (el) {
            var text = el.textContent;
            var prefix = '';
            var suffix = '';
            var target = 0;

            if (text.indexOf('+') === 0) {
                prefix = '+';
                target = parseInt(text.replace('+', ''));
            } else if (text.indexOf('/') !== -1) {
                el.textContent = text;
                return;
            } else {
                target = parseInt(text);
            }

            if (isNaN(target)) return;

            var current = 0;
            var increment = Math.max(1, Math.floor(target / 50));
            var duration = 1500;
            var stepTime = duration / (target / increment);

            el.textContent = prefix + '0' + suffix;

            var timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = prefix + current + suffix;
            }, stepTime);
        });
    }

    if (statsSection) {
        var statsObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                animateCounters();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerOffset = 80;
                var elementPosition = targetEl.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset;

        sections.forEach(function (section) {
            var sectionHeight = section.offsetHeight;
            var sectionTop = section.offsetTop - 100;
            var sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(function (a) {
                    a.classList.remove('active-link');
                    if (a.getAttribute('href') === '#' + sectionId) {
                        a.classList.add('active-link');
                    }
                });
            }
        });
    });

    window.addEventListener('scroll', function () {
        var hero = document.querySelector('.hero-bg img');
        if (hero) {
            var scrolled = window.pageYOffset;
            hero.style.transform = 'translateY(' + scrolled * 0.3 + 'px) scale(1.1)';
        }
    });

    // Service modal
    var modal = document.getElementById('serviceModal');
    var modalImg = document.getElementById('modalImg');
    var modalIcon = document.getElementById('modalIcon');
    var modalTitle = document.getElementById('modalTitle');
    var modalDesc = document.getElementById('modalDesc');
    var modalPoints = document.getElementById('modalPoints');
    var modalWhatsapp = document.getElementById('modalWhatsapp');
    var modalClose = modal ? modal.querySelector('.service-modal-close') : null;
    var modalImgContainer = modal ? modal.querySelector('.service-modal-img') : null;

    document.querySelectorAll('.bento-tile').forEach(function (tile) {
        tile.style.cursor = 'pointer';
        tile.addEventListener('click', function () {
            var title = this.dataset.title;
            var icon = this.dataset.icon;
            var img = this.dataset.img;
            var desc = this.dataset.desc;
            var points = this.dataset.points ? this.dataset.points.split('|') : [];

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalIcon.className = icon;

            if (img) {
                modalImg.src = img;
                modalImg.alt = title;
                modalImg.style.display = '';
                modalImgContainer.classList.remove('no-image');
            } else {
                modalImg.style.display = 'none';
                modalImgContainer.classList.add('no-image');
            }

            modalPoints.innerHTML = '';
            points.forEach(function (point) {
                var li = document.createElement('li');
                li.textContent = point;
                modalPoints.appendChild(li);
            });

            var texto = 'Hola, quisiera solicitar un turno para *' + title + '*.';
            modalWhatsapp.href = 'https://wa.me/5493624862592?text=' + encodeURIComponent(texto);

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function () {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

});
