document.addEventListener('DOMContentLoaded', function() {
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const viewType = this.dataset.type;
            
            if (viewType === 'paciente') {
                window.location.href = 'paciente.html';
            } else if (viewType === 'psicologo') {
                window.location.href = 'index.html';
            }
        });
    });
}); 