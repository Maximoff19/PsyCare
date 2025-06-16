import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorDiv = document.getElementById('registerError');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.textContent = '';

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        if (!fullName || !email || !password || !userType) {
            errorDiv.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        try {
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Actualizar el perfil con el nombre
            await updateProfile(user, { displayName: fullName });

            // Guardar datos en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                email,
                role: userType,
                createdAt: new Date().toISOString()
            });

            // Redirigir según el tipo de usuario
            if (userType === 'psicologo') {
                window.location.href = 'psicologo.html';
            } else {
                window.location.href = 'paciente.html';
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                errorDiv.textContent = 'El correo ya está registrado.';
            } else if (error.code === 'auth/weak-password') {
                errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            } else {
                errorDiv.textContent = 'Error al registrar: ' + error.message;
            }
        }
    });
}); 