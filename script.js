// Manejo del menú móvil
document.addEventListener('DOMContentLoaded', function() {
    // Check user authentication and role
    const userRole = sessionStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();

    // If on login page, don't check authentication
    if (currentPage !== 'login.html') {
        if (!userRole) {
            // If not logged in, redirect to login page
            window.location.href = 'login.html';
            return; // Stop further execution
        }

        // Redirect to correct dashboard if on the wrong one
        if (userRole === 'psychologist' && currentPage === 'paciente.html') {
            window.location.href = 'index.html';
            return;
        }
        if (userRole === 'patient' && currentPage === 'index.html') {
            window.location.href = 'paciente.html';
            return;
        }

        // Handle page access based on role (basic example)
        const psychologistPages = ['index.html', 'pacientes.html', 'citas.html', 'evaluaciones.html', 'ajustes.html', 'agregar-paciente.html', 'agregar-cita.html'];
        const patientPages = ['paciente.html', 'mis-citas.html', 'mis-evaluaciones.html', 'mi-progreso.html', 'recursos.html', 'ajustes-paciente.html'];

        if (userRole === 'psychologist' && !psychologistPages.includes(currentPage)) {
             // Optionally redirect to psychologist dashboard or show error
             // window.location.href = 'index.html';
             // return;
             console.warn(`Psychologist trying to access patient page: ${currentPage}`);
        }

         if (userRole === 'patient' && !patientPages.includes(currentPage)) {
             // Optionally redirect to patient dashboard or show error
             // window.location.href = 'paciente.html';
             // return;
             console.warn(`Patient trying to access psychologist page: ${currentPage}`);
         }
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked');

            if (!username || !password || !role) {
                alert('Por favor, complete todos los campos y seleccione su rol.');
                return;
            }

            const selectedRole = role.value;

            // --- Simulación de autenticación ---
            // En un entorno real, aquí harías una llamada a un servidor para verificar credenciales
            // y obtener el rol del usuario.
            // Por ahora, simplemente verificamos que los campos no estén vacíos.
            if (username && password) {
                // Autenticación exitosa simulada
                sessionStorage.setItem('userRole', selectedRole);
                alert('Inicio de sesión exitoso como ' + selectedRole);

                // Redirigir según el rol
                if (selectedRole === 'psychologist') {
                    window.location.href = 'index.html'; // Página principal del psicólogo
                } else if (selectedRole === 'patient') {
                    window.location.href = 'paciente.html'; // Página principal del paciente
                }
            } else {
                // Autenticación fallida simulada
                alert('Usuario o contraseña incorrectos.');
            }
        });
    }

    // Toggle del menú en móvil
    const menuItems = document.querySelectorAll('.nav-links li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar clase active al item clickeado
            this.classList.add('active');
        });
    });

    // Efecto hover en las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Funcionalidad de búsqueda
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Simulación de carga de datos
    function simulateLoading() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 200);
            }, index * 100);
        });
    }

    // Ejecutar animación de carga al iniciar
    simulateLoading();

    // Manejo del botón de logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('userRole'); // Eliminar rol al cerrar sesión
            window.location.href = 'login.html'; // Redirigir al login
        });
    }

    // Manejar la navegación activa
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });

    // Manejo del cambio de tema
    const themeToggle = document.getElementById('themeToggle');
    const themeSwitch = document.getElementById('themeSwitch');
    
    // Aplicar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Función para actualizar el ícono del tema
    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (themeSwitch) {
            themeSwitch.checked = theme === 'dark';
        }
    }

    // Evento para el botón de cambio de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Evento para el switch de tema en ajustes
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Funcionalidad para la página de Citas
    function initializeCalendarPage() {
        const calendar = document.querySelector('.calendar');
        if (calendar) {
            const prevMonthBtn = document.querySelector('.prev-month');
            const nextMonthBtn = document.querySelector('.next-month');
            const currentMonth = document.querySelector('.current-month');
            
            let currentDate = new Date();
            
            function updateCalendar() {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                
                currentMonth.textContent = `${monthNames[month]} ${year}`;
                
                const daysGrid = document.querySelector('.calendar-grid');
                const days = daysGrid.querySelectorAll('.day');
                
                days.forEach((day, index) => {
                    const dayNumber = index + 1;
                    if (dayNumber <= lastDay.getDate()) {
                        day.textContent = dayNumber;
                        day.style.display = 'block';
                        
                        // Marcar el día actual
                        if (dayNumber === new Date().getDate() && 
                            month === new Date().getMonth() && 
                            year === new Date().getFullYear()) {
                            day.classList.add('current-day');
                        }
                    } else {
                        day.style.display = 'none';
                    }
                });
            }
            
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                updateCalendar();
            });
            
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                updateCalendar();
            });
            
            updateCalendar();
        }
    }

    // Funcionalidad para la página de Evaluaciones
    function initializeEvaluationsPage() {
        const evaluationCards = document.querySelectorAll('.evaluation-card');
        
        evaluationCards.forEach(card => {
            const startButton = card.querySelector('.btn-secondary');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    const testName = card.querySelector('h3').textContent;
                    alert(`Iniciando evaluación: ${testName}`);
                });
            }
        });
    }

    // Funcionalidad para la página de Ajustes
    function initializeSettingsPage() {
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Configuración guardada exitosamente');
            });
        }
        
        const passwordForm = document.querySelector('.password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPassword = document.querySelector('input[name="new_password"]').value;
                const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
                
                if (newPassword !== confirmPassword) {
                    alert('Las contraseñas no coinciden');
                    return;
                }
                
                alert('Contraseña actualizada exitosamente');
            });
        }
    }

    // Inicializar funcionalidades según la página actual
    document.addEventListener('DOMContentLoaded', () => {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch (currentPage) {
            case 'citas.html':
                initializeCalendarPage();
                break;
            case 'evaluaciones.html':
                initializeEvaluationsPage();
                break;
            case 'ajustes.html':
                initializeSettingsPage();
                break;
        }
    });
});

// Funcionalidad adicional para cargar pacientes en el formulario de citas
// ... existing code ...

// Funcionalidad para guardar pacientes y citas (simulado en localStorage)
// ... existing code ...

// Funcionalidad para cargar y mostrar pacientes en pacientes.html
// ... existing code ...

// Funcionalidad para cargar y mostrar citas en citas.html y mis-citas.html
// ... existing code ...

// Funcionalidad para cargar pacientes en el select del formulario de agregar-cita
// ... existing code ... 