console.log('main.js cargado');

// Manejo del menú móvil y funcionalidades básicas
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando funcionalidades...');

    // Manejo del botón de logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clickeado');
            // Limpiar cualquier sesión almacenada
            sessionStorage.removeItem('userRole');
            localStorage.removeItem('currentUser');
            // Redirigir a la página principal
            window.location.href = '/pages/log/index.html';
        });
    }

    // Manejo del cambio de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Aplicar tema guardado
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        // Evento para el botón de cambio de tema
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            console.log('Tema cambiado a:', newTheme);
        });
    }

    // Función para actualizar el ícono del tema
    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // Manejo del switch de tema en ajustes
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            themeSwitch.checked = savedTheme === 'dark';
        }

        themeSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            console.log('Tema cambiado a:', newTheme);
        });
    }

    // Manejo específico de los botones del mood tracker
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Remover clase active de todos los botones
            moodButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            console.log('Estado de ánimo seleccionado:', this.querySelector('i').className);
        });
    });

    // Manejo del botón "Guardar" del mood tracker
    const moodSaveButton = document.querySelector('.mood-tracker .btn-primary');
    if (moodSaveButton) {
        moodSaveButton.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedMood = document.querySelector('.mood-btn.active');
            const notes = document.querySelector('.mood-tracker textarea').value;
            
            if (selectedMood) {
                const moodIcon = selectedMood.querySelector('i').className;
                const moodData = {
                    mood: moodIcon,
                    notes: notes,
                    date: new Date().toISOString()
                };
                
                // Guardar en localStorage
                const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
                moodEntries.push(moodData);
                localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
                
                console.log('Estado de ánimo guardado:', moodData);
                alert('Estado de ánimo guardado exitosamente');
                
                // Limpiar formulario
                document.querySelector('.mood-tracker textarea').value = '';
                moodButtons.forEach(btn => btn.classList.remove('active'));
            } else {
                alert('Por favor, selecciona cómo te sientes hoy');
            }
        });
    }

    // Manejo de botones de citas específicos
    const confirmButton = document.querySelector('.appointment-actions .btn-primary');
    if (confirmButton) {
        confirmButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cita confirmada');
            alert('Cita confirmada exitosamente');
        });
    }

    const rescheduleButton = document.querySelector('.appointment-actions .btn-secondary');
    if (rescheduleButton) {
        rescheduleButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Reprogramar cita');
            alert('Funcionalidad de reprogramación en desarrollo');
        });
    }

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

    // Manejo de formularios de ajustes
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de ajustes enviado');
            alert('Configuración guardada exitosamente');
        });
    });

    // Manejo de formularios de contraseña
    const passwordForms = document.querySelectorAll('form');
    passwordForms.forEach(form => {
        const passwordInputs = form.querySelectorAll('input[type="password"]');
        if (passwordInputs.length >= 2) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const newPassword = form.querySelector('input[name="new-password"], input[id="new-password"]');
                const confirmPassword = form.querySelector('input[name="confirm-password"], input[id="confirm-password"]');
                
                if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
                    alert('Las contraseñas no coinciden');
                    return;
                }
                
                console.log('Contraseña actualizada');
                alert('Contraseña actualizada exitosamente');
            });
        }
    });

    // Manejo de botones de evaluación
    const evaluationButtons = document.querySelectorAll('.evaluation-card .btn-secondary, .evaluation-item .btn-secondary');
    evaluationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const testName = this.closest('.evaluation-card, .evaluation-item')?.querySelector('h3, h4')?.textContent || 'Evaluación';
            console.log('Iniciando evaluación:', testName);
            alert(`Iniciando evaluación: ${testName}`);
        });
    });

    // Manejo de botones de recursos
    const resourceButtons = document.querySelectorAll('.resource-item .btn-secondary');
    resourceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceName = this.closest('.resource-item')?.querySelector('h3')?.textContent || 'Recurso';
            console.log('Abriendo recurso:', resourceName);
            alert(`Abriendo: ${resourceName}`);
        });
    });

    // Manejo de botones de citas
    const appointmentButtons = document.querySelectorAll('.appointment-actions .btn-secondary');
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            console.log('Acción de cita:', action);
            alert(`Acción: ${action}`);
        });
    });

    // Manejo de botones de pacientes
    const patientButtons = document.querySelectorAll('.patient-actions .btn-icon');
    patientButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.title || 'Acción';
            console.log('Acción de paciente:', action);
            alert(`Acción: ${action}`);
        });
    });

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
    if (cards.length > 0) {
        simulateLoading();
    }

    console.log('Funcionalidades inicializadas correctamente');
});

// Funcionalidad para cargar datos simulados
function loadMockData() {
    // Datos de ejemplo para pacientes
    const mockPatients = [
        { id: 1, name: 'María González', email: 'maria@example.com', phone: '555-1234' },
        { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '555-5678' },
        { id: 3, name: 'Ana Martínez', email: 'ana@example.com', phone: '555-9012' }
    ];

    // Datos de ejemplo para citas
    const mockAppointments = [
        { id: 1, patient: 'María González', date: '2023-11-01', time: '10:00', type: 'Terapia' },
        { id: 2, patient: 'Carlos Rodríguez', date: '2023-11-02', time: '11:30', type: 'Evaluación' }
    ];

    // Guardar en localStorage si no existen
    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', JSON.stringify(mockPatients));
    }
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify(mockAppointments));
    }
}

// Cargar datos al iniciar
loadMockData(); 