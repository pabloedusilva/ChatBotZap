// Função para alternar entre temas claro e escuro
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const themeIcon = document.querySelector('.theme-icon');
    if (newTheme === 'dark') {
        themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
    } else {
        themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                `;
    }
};

// Função para definir o tema inicial com base nas preferências do usuário
const setInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);

    const themeIcon = document.querySelector('.theme-icon');
    if (theme === 'dark') {
        themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
    } else {
        themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                `;
    }
};

// Função de validação para o nome de usuário
const validateUsername = (username) => {
    return username.length > 0;
};

// Função de validação para a senha
const validatePassword = (password) => {
    return password.length >= 6;
};

// Valida o formulário
const validateForm = () => {
    const usernameInput = document.getElementById('username');
    const usernameGroup = document.getElementById('username-group');
    const passwordInput = document.getElementById('password');
    const passwordGroup = passwordInput.parentElement;

    if (validateUsername(usernameInput.value)) {
        usernameGroup.classList.add('valid');
        usernameGroup.classList.remove('invalid');
    } else {
        usernameGroup.classList.add('invalid');
        usernameGroup.classList.remove('valid');
    }

    if (validatePassword(passwordInput.value)) {
        passwordGroup.classList.add('valid');
        passwordGroup.classList.remove('invalid');
    } else {
        passwordGroup.classList.add('invalid');
        passwordGroup.classList.remove('valid');
    }
};

// Verifica se há mensagens de erro na URL
const checkErrorMessages = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorMessage = document.getElementById('errorMessage');

    if (error === 'missing') {
        errorMessage.innerText = 'Preencha todos os campos.';
        errorMessage.style.display = 'block';
        errorMessage.classList.add('error-message');
        errorMessage.classList.add('active');
    } else if (error === 'invalid') {
        errorMessage.innerText = 'Usuário ou senha inválidos.';
        errorMessage.style.display = 'block';
        errorMessage.classList.add('error-message');
        errorMessage.classList.add('active');
    } else if (error === 'server') {
        errorMessage.innerText = 'Erro no servidor. Tente novamente.';
        errorMessage.style.display = 'block';
        errorMessage.classList.add('error-message');
        errorMessage.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    checkErrorMessages();

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Alternância de visibilidade da senha
    document.getElementById('togglePassword').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const toggle = document.getElementById('togglePassword');
        if (type === 'password') {
            toggle.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    `;
        } else {
            toggle.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c-7 0-11 8-11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    `;
        }
    });

    // Eventos de validação de input
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    // Submissão do formulário
    document.getElementById('ownerLoginForm').addEventListener('submit', (e) => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!validateUsername(username) || !validatePassword(password)) {
            e.preventDefault();
            validateForm();

            const errorMessage = document.getElementById('errorMessage');
            errorMessage.innerText = 'Preencha os campos corretamente.';
            errorMessage.style.display = 'block';
            errorMessage.classList.add('error-message');
            errorMessage.classList.add('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Redireciona para o index ao clicar no ícone superior esquerdo
    const dashboardIcon = document.getElementById('dashboardIcon');
    if (dashboardIcon) {
        dashboardIcon.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
});