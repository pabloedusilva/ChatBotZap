// Sample data - in a real app, this would come from a database
let users = [];
let currentUserId = null;
let isDarkMode = false;
let currentSection = 'users-section';

// Sample bot data with more detailed information
const bots = [{
    id: 1,
    name: "Bot WhatsApp 1",
    status: "Online",
    lastConnection: new Date(Date.now() - 3600000).toLocaleString(), // 1 hour ago
    lastDisconnection: new Date(Date.now() - 7200000).toLocaleString(), // 2 hours ago
    uptime: "98%",
    messagesSent: 1245,
    messagesReceived: 987,
    connectionHistory: [{
        time: new Date(Date.now() - 7200000).toLocaleString(),
        event: "Conexão estabelecida",
        status: "success"
    }, {
        time: new Date(Date.now() - 10800000).toLocaleString(),
        event: "Conexão perdida",
        status: "error"
    }, {
        time: new Date(Date.now() - 14400000).toLocaleString(),
        event: "Reconectado",
        status: "success"
    }, {
        time: new Date(Date.now() - 18000000).toLocaleString(),
        event: "Manutenção programada",
        status: "warning"
    }]
}, {
    id: 2,
    name: "Bot WhatsApp 2",
    status: "Offline",
    lastConnection: new Date(Date.now() - 86400000).toLocaleString(), // 1 day ago
    lastDisconnection: new Date(Date.now() - 43200000).toLocaleString(), // 12 hours ago
    uptime: "92%",
    messagesSent: 876,
    messagesReceived: 654,
    connectionHistory: [{
        time: new Date(Date.now() - 43200000).toLocaleString(),
        event: "Conexão perdida",
        status: "error"
    }, {
        time: new Date(Date.now() - 54000000).toLocaleString(),
        event: "Tentativa de reconexão falhou",
        status: "error"
    }, {
        time: new Date(Date.now() - 64800000).toLocaleString(),
        event: "Conexão estabelecida",
        status: "success"
    }, {
        time: new Date(Date.now() - 86400000).toLocaleString(),
        event: "Atualização de software",
        status: "info"
    }]
}, {
    id: 3,
    name: "Bot WhatsApp 3",
    status: "Online",
    lastConnection: new Date(Date.now() - 1800000).toLocaleString(), // 30 minutes ago
    lastDisconnection: "-",
    uptime: "99.5%",
    messagesSent: 2103,
    messagesReceived: 1876,
    connectionHistory: [{
        time: new Date(Date.now() - 1800000).toLocaleString(),
        event: "Reinicialização programada",
        status: "info"
    }, {
        time: new Date(Date.now() - 86400000).toLocaleString(),
        event: "Conexão estável",
        status: "success"
    }, {
        time: new Date(Date.now() - 172800000).toLocaleString(),
        event: "Pico de mensagens processadas",
        status: "success"
    }, {
        time: new Date(Date.now() - 259200000).toLocaleString(),
        event: "Atualização de configuração",
        status: "info"
    }]
}];

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const userCount = document.getElementById('userCount');
const usersList = document.getElementById('usersList');
const botsList = document.getElementById('botsList');
const addUserBtn = document.getElementById('addUserBtn');
const addUserBtnEmpty = document.getElementById('addUserBtnEmpty');
const searchInput = document.getElementById('searchInput');

// Modal elements
const userModal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// Confirmation modal elements
const confirmModal = document.getElementById('confirmModal');
const confirmCancel = document.getElementById('confirmCancel');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');

// User added modal elements
const userAddedModal = document.getElementById('userAddedModal');
const userAddedModalClose = document.getElementById('userAddedModalClose');
const userAddedModalOk = document.getElementById('userAddedModalOk');

// User deleted modal elements
const userDeletedModalClose = document.getElementById('userDeletedModalClose');
const userDeletedModalOk = document.getElementById('userDeletedModalOk');
const userDeletedModal = document.getElementById('userDeletedModal');

// Form inputs
const addUserName = document.getElementById('addUserName');
const userEmail = document.getElementById('userEmail');
const userWhatsApp = document.getElementById('userWhatsApp');
const userPassword = document.getElementById('userPassword');

// Section elements
const usersSection = document.getElementById('users-section');
const reportsSection = document.getElementById('reports-section');
const menuItems = document.querySelectorAll('.menu-item');
const pageTitle = document.querySelector('.page-title');

// Toggle sidebar
const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
};

// Close sidebar
const closeSidebar = () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
};

// Switch between sections
const switchSection = (sectionId) => {
    // Update active menu item
    menuItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`.menu-item[data-section="${sectionId}"]`).classList.add('active');

    // Update current section
    currentSection = sectionId;

    // Hide all sections
    document.querySelectorAll('.users-section, .reports-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update page title
    if (sectionId === 'users-section') {
        pageTitle.textContent = 'Gerenciamento de Usuários';
    } else if (sectionId === 'reports-section') {
        pageTitle.textContent = 'Relatórios de Bots';
    }

    // Close sidebar on mobile
    if (window.innerWidth < 992) {
        closeSidebar();
    }
};

// Initialize the dashboard
const initDashboard = () => {
    // Sidebar toggle events
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    confirmCancelBtn.addEventListener('click', closeModals);

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : '');
        const icon = themeToggle.querySelector('.theme-icon i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';

        // Save preference to localStorage
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        isDarkMode = true;
        document.body.setAttribute('data-theme', 'dark');
        const icon = themeToggle.querySelector('.theme-icon i');
        icon.className = 'fas fa-sun';
    }

    // Switch between sections
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    // Open add user modal
    addUserBtn.addEventListener('click', openAddUserModal);
    addUserBtnEmpty.addEventListener('click', openAddUserModal);
    modalClose.addEventListener('click', closeModals);
    cancelBtn.addEventListener('click', closeModals);
    confirmCancel.addEventListener('click', closeModals);
    userAddedModalClose.addEventListener('click', closeModals);
    userAddedModalOk.addEventListener('click', closeModals);
    userDeletedModalClose.addEventListener('click', () => {
        userDeletedModal.classList.remove('active-user-deleted');
    });
    userDeletedModalOk.addEventListener('click', () => {
        userDeletedModal.classList.remove('active-user-deleted');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === userModal) closeModals();
        if (e.target === confirmModal) closeModals();
        if (e.target === userAddedModal) closeModals();
        if (e.target === userDeletedModal) closeModals();
    });

    // Save user
    saveBtn.addEventListener('click', saveUser);

    // Delete user
    confirmDelete.addEventListener('click', deleteUser);

    // Search users
    searchInput.addEventListener('input', filterUsers);

    // Initial render
    renderUsers();
    renderBots();

    // Set initial active section
    switchSection('users-section');
};

// Open add user modal
const openAddUserModal = () => {
    currentUserId = null;
    modalTitle.textContent = 'Adicionar Novo Usuário';
    addUserName.value = '';
    userEmail.value = '';
    userWhatsApp.value = '';
    userPassword.value = '';
    userModal.classList.add('active');
};

// Open edit user modal
const openEditUserModal = async(userId) => {
    try {
        const response = await fetch(`/users/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const user = await response.json();

        document.getElementById('editUserName').value = user.username || '';
        document.getElementById('editUserEmail').value = user.email || '';
        document.getElementById('editUserWhatsApp').value = user.whatsapp || '';
        document.getElementById('editUserPassword').value = user.password || '';
        document.getElementById('editUserPassword').type = 'password';
        document.getElementById('editUserPasswordIcon').className = 'fa fa-eye';
        window.currentEditUserId = userId;

        document.getElementById('EditUserModal').classList.add('active');
    } catch (error) {
        alert('Erro ao buscar dados do usuário.');
        console.error(error);
    }
};

function closeEditUserModal() {
    document.getElementById('EditUserModal').classList.remove('active');
}

function saveEditUser() {
    const id = window.currentEditUserId;
    const username = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const whatsapp = document.getElementById('editUserWhatsApp').value.trim();
    const password = document.getElementById('editUserPassword').value;

    if (!username || !email || !whatsapp) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const updatedUser = {
        username,
        email,
        whatsapp
    };
    if (password && password.trim() !== '') {
        updatedUser.password = password;
    }

    fetch(`/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(async response => {
            if (response.ok) {
                await renderUsers();
                closeEditUserModal();
                showUserUpdatedModal();
            } else {
                const error = await response.json();
                alert(error.error || 'Erro ao atualizar usuário.');
            }
        })
        .catch(() => {
            alert('Erro ao atualizar usuário.');
        });
}

// Salvar usuário
const addUserError = document.getElementById('addUserError');

const saveUser = async() => {
    if (!addUserName.value || !userEmail.value || !userWhatsApp.value || !userPassword.value) {
        addUserError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Por favor, preencha todos os campos obrigatórios.`;
        addUserError.style.display = 'flex';
        return;
    }
    addUserError.style.display = 'none';

    const newUser = {
        username: addUserName.value,
        email: userEmail.value,
        whatsapp: userWhatsApp.value,
        password: userPassword.value,
        role: userRole.value
    };

    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            const result = await response.json();

            users.push({
                id: result.userId,
                username: newUser.username,
                email: newUser.email,
                whatsapp: newUser.whatsapp,
                role: newUser.role
            });

            renderUsers();
            closeModals();
            userAddedModal.classList.add('active');
        } else {
            const error = await response.json();
            addUserError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error.error || 'Erro ao salvar o usuário.'}`;
            addUserError.style.display = 'flex';
        }
    } catch (error) {
        addUserError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Erro ao salvar o usuário.`;
        addUserError.style.display = 'flex';
    }
};

// Close modals
const closeModals = () => {
    userModal.classList.remove('active');
    confirmModal.classList.remove('active');
    userAddedModal.classList.remove('active');
    userDeletedModal.classList.remove('active-user-deleted');
};

// Delete user
let userToDelete = null;

const openDeleteConfirm = (userId) => {
    userToDelete = userId;
    confirmModal.classList.add('active'); // Exibe o modal de confirmação
};

const deleteUser = async() => {
    if (!userToDelete) return;

    try {
        const response = await fetch(`/users/${userToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();

            // Atualizar a lista de usuários localmente
            users = users.filter(user => user.id !== userToDelete);
            renderUsers(); // Atualiza a lista de usuários na interface
            closeModals(); // Fecha o modal de confirmação

            // Exibir o modal de "Usuário Excluído com Sucesso"
            const userDeletedModal = document.getElementById('userDeletedModal');
            userDeletedModal.classList.add('active-user-deleted');
        } else {
            const error = await response.json();
            console.error('Erro ao excluir usuário:', error.error || 'Erro ao excluir o usuário.');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
};

// Filter users by name or phone
const filterUsers = async() => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length === 0) {
        renderUsers(); // Recarregar todos os usuários se o campo estiver vazio
        return;
    }

    try {
        // Fazer uma requisição ao backend para buscar usuários
        const response = await fetch(`/users/search?query=${encodeURIComponent(searchTerm)}`);
        const filteredUsers = await response.json();

        // Renderizar os usuários filtrados
        if (filteredUsers.length > 0) {
            // Separe os usuários por role
            const privileged = filteredUsers.filter(u => u.role === 'admin');
            const normal = filteredUsers.filter(u => u.role !== 'admin');

            let html = `
        <div class="table-header">
            <div>Usuário</div>
            <div>E-mail</div>
            <div>WhatsApp</div>
            <div>Ações</div>
        </div>
    `;

            if (privileged.length > 0) {
                html += `
            <div class="user-separator privileged-separator">
                <i class="fas fa-star"></i> Usuários Privilegiados
            </div>
        `;
                html += privileged.map(user => `
            <div class="table-row admin-row" data-id="${user.id}">
                <div class="user-info">
                    <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="user-name">
                        ${user.username}
                        <span class="badge-admin">Privilegiado</span>
                    </div>
                </div>
                <div class="user-email">${user.email}</div>
                <div class="user-phone">${user.whatsapp}</div>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="openEditUserModal('${user.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="openDeleteConfirm('${user.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
            }

            if (normal.length > 0) {
                html += `
            <div class="user-separator normal-separator">
                <i class="fas fa-user"></i> Usuários Comuns
            </div>
        `;
                html += normal.map(user => `
            <div class="table-row" data-id="${user.id}">
                <div class="user-info">
                    <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="user-name">${user.username}</div>
                </div>
                <div class="user-email">${user.email}</div>
                <div class="user-phone">${user.whatsapp}</div>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="openEditUserModal('${user.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="openDeleteConfirm('${user.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
            }

            usersList.innerHTML = html;
        } else {
            usersList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="empty-text">Nenhum usuário encontrado</div>
        </div>
    `;
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
};

// Render users list
const renderUsers = async() => {
    try {
        const response = await fetch('/users');
        users = await response.json();

        if (users.length === 0) {
            usersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="empty-text">Nenhum usuário cadastrado</div>
                </div>
            `;
        } else {
            // Separe os usuários por role
            const privileged = users.filter(u => u.role === 'admin');
            const normal = users.filter(u => u.role !== 'admin');

            let html = `
                <div class="table-header">
                    <div>Usuário</div>
                    <div>E-mail</div>
                    <div>WhatsApp</div>
                    <div>Ações</div>
                </div>
            `;

            // Adicione separador para privilegiados, se houver
            if (privileged.length > 0) {
                html += `
                    <div class="user-separator privileged-separator">
                        <i class="fas fa-star"></i> Usuários Privilegiados
                    </div>
                `;
                html += privileged.map(user => `
                    <div class="table-row admin-row" data-id="${user.id}">
                        <div class="user-info">
                            <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                            <div class="user-name">
                                ${user.username}
                                <span class="badge-admin">Privilegiado</span>
                            </div>
                        </div>
                        <div class="user-email">${user.email}</div>
                        <div class="user-phone">${user.whatsapp}</div>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="openEditUserModal('${user.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="delete-btn" onclick="openDeleteConfirm('${user.id}')">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Adicione separador para comuns, se houver
            if (normal.length > 0) {
                html += `
                    <div class="user-separator normal-separator">
                        <i class="fas fa-user"></i> Usuários Comuns
                    </div>
                `;
                html += normal.map(user => `
                    <div class="table-row" data-id="${user.id}">
                        <div class="user-info">
                            <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                            <div class="user-name">${user.username}</div>
                        </div>
                        <div class="user-email">${user.email}</div>
                        <div class="user-phone">${user.whatsapp}</div>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="openEditUserModal('${user.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="delete-btn" onclick="openDeleteConfirm('${user.id}')">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            usersList.innerHTML = html;
        }
    } catch (error) {
        console.error('Erro ao renderizar usuários:', error);
    }
};

// Render bots list as cards
const renderBots = () => {
        botsList.innerHTML = bots.map(bot => `
                <div class="bot-card">
                    <div class="bot-card-header">
                        <div class="bot-card-title">
                            <div class="bot-card-avatar">${bot.id}</div>
                            <div class="bot-card-name">${bot.name}</div>
                        </div>
                        <div class="bot-card-status ${bot.status.toLowerCase()}">
                            ${bot.status}
                        </div>
                    </div>
                    <div class="bot-card-body">
                        <div class="bot-card-metrics">
                            <div class="bot-metric">
                                <div class="bot-metric-title">Tempo de atividade</div>
                                <div class="bot-metric-value">${bot.uptime}</div>
                            </div>
                            <div class="bot-metric">
                                <div class="bot-metric-title">Mensagens enviadas</div>
                                <div class="bot-metric-value">${bot.messagesSent}</div>
                            </div>
                            <div class="bot-metric">
                                <div class="bot-metric-title">Última conexão</div>
                                <div class="bot-metric-value">${bot.lastConnection}</div>
                            </div>
                            <div class="bot-metric">
                                <div class="bot-metric-title">Última desconexão</div>
                                <div class="bot-metric-value">${bot.lastDisconnection}</div>
                            </div>
                        </div>
                        <div class="bot-card-timeline">
                            <div class="timeline-title">Histórico recente</div>
                            ${bot.connectionHistory.map(event => `
                                <div class="timeline-item">
                                    <div class="timeline-content">
                                        <div class="timeline-time">${event.time}</div>
                                        <div class="timeline-text">${event.event}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bot-card-footer">
                        <button class="bot-card-btn secondary">
                            <i class="fas fa-cog"></i> Configurar
                        </button>
                        <button class="bot-card-btn primary">
                            <i class="fas fa-sync-alt"></i> Reiniciar
                        </button>
                    </div>
                </div>
            `).join('');
        };

        // Make functions globally available
        window.openEditUserModal = openEditUserModal;
        window.openDeleteConfirm = openDeleteConfirm;
        window.deleteUser = deleteUser;

        // Initialize the dashboard when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            initDashboard();
            renderUsers(); // Chamar a função para carregar os usuários
        });

        document.addEventListener('DOMContentLoaded', () => {
            const passwordInput = document.getElementById('editUserPassword');
            const toggleBtn = document.getElementById('toggleEditUserPassword');
            const icon = document.getElementById('editUserPasswordIcon');

            if (toggleBtn && passwordInput && icon) {
                toggleBtn.addEventListener('click', () => {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.className = 'fa fa-eye-slash';
                    } else {
                        passwordInput.type = 'password';
                        icon.className = 'fa fa-eye';
                    }
                });
            }
        });

        // Referências do novo modal
const userUpdatedModal = document.getElementById('userUpdatedModal');
const userUpdatedModalClose = document.getElementById('userUpdatedModalClose');
const userUpdatedModalOk = document.getElementById('userUpdatedModalOk');

// Funções para abrir/fechar o modal de usuário atualizado
function showUserUpdatedModal() {
    userUpdatedModal.classList.add('active-user-updated');
}
function closeUserUpdatedModal() {
    userUpdatedModal.classList.remove('active-user-updated');
}
userUpdatedModalClose.addEventListener('click', closeUserUpdatedModal);
userUpdatedModalOk.addEventListener('click', closeUserUpdatedModal);
    
    
        document.addEventListener('DOMContentLoaded', async() => {
            try {
                // Fazer a requisição para obter o total de usuários
                const response = await fetch('/total-users');
                const data = await response.json();

                // Atualizar o elemento com o total de usuários
                const userCountElement = document.getElementById('userCount');
                if (userCountElement) {
                    userCountElement.textContent = data.total;
                }
            } catch (error) {
                console.error('Erro ao buscar o total de usuários:', error);
            }
        });
    
    
        async function checkServerStatus() {
            try {
                // Fazer a requisição para verificar o status do servidor
                const response = await fetch('/server-status');
                const data = await response.json();

                // Atualizar o elemento com o status do servidor
                const serverStatusElement = document.getElementById('serverStatus');
                // Corrigido: busca o ícone de wifi corretamente dentro do card
                let wifiIcon = null;
                if (serverStatusElement) {
                    const cardHeader = serverStatusElement.closest('.card-header');
                    if (cardHeader) {
                        wifiIcon = cardHeader.querySelector('.fa-wifi');
                    }
                }
                if (serverStatusElement) {
                    serverStatusElement.textContent = data.status;
                    if (data.status === 'online') {
                        serverStatusElement.style.color = 'green';
                        if (wifiIcon) wifiIcon.style.color = 'var(--primary)';
                    } else {
                        serverStatusElement.style.color = 'red';
                        if (wifiIcon) wifiIcon.style.color = 'red';
                    }
                }
            } catch (error) {
                // Caso ocorra um erro, definir o status como offline
                const serverStatusElement = document.getElementById('serverStatus');
                let wifiIcon = null;
                if (serverStatusElement) {
                    const cardHeader = serverStatusElement.closest('.card-header');
                    if (cardHeader) {
                        wifiIcon = cardHeader.querySelector('.fa-wifi');
                    }
                }
                if (serverStatusElement) {
                    serverStatusElement.textContent = 'offline';
                    serverStatusElement.style.color = 'red';
                    if (wifiIcon) wifiIcon.style.color = 'red';
                }
            }
        }

        // Verificar o status do servidor a cada 5 segundos
        setInterval(checkServerStatus, 5000);

        // Verificar o status do servidor ao carregar a página
        document.addEventListener('DOMContentLoaded', checkServerStatus);
    
    
        // Conectar ao servidor Socket.IO
        const socket = io();

        // Atualizar o contador de usuários quando um usuário for adicionado
        socket.on('user-added', (data) => {
            const userCountElement = document.getElementById('userCount');
            if (userCountElement) {
                userCountElement.textContent = data.totalUsers;
            }
        });

        // Atualizar o contador de usuários quando um usuário for removido
        socket.on('user-removed', (data) => {
            const userCountElement = document.getElementById('userCount');
            if (userCountElement) {
                userCountElement.textContent = data.totalUsers;
            }
        });
    
    
        // Função para atualizar o contador de usuários manualmente
        async function refreshUserCount() {
            const refreshIcon = document.getElementById('refreshIcon');

            // Adiciona a classe de animação
            refreshIcon.classList.add('rotate-once');

            try {
                const response = await fetch('/users/count'); // Rota para obter o total de usuários
                const data = await response.json();

                if (response.ok) {
                    const userCountElement = document.getElementById('userCount');
                    userCountElement.textContent = data.totalUsers;
                } else {
                    console.error('Erro ao atualizar o contador:', data.error);
                }
            } catch (error) {
                console.error('Erro ao buscar o total de usuários:', error);
            } finally {
                // Remove a classe de animação após a rotação
                setTimeout(() => {
                    refreshIcon.classList.remove('rotate-once');
                }, 1000); // Duração da animação (1 segundo)
            }
        }

        // Adiciona a animação de rotação
        const style = document.createElement('style');
        style.textContent = `
            .rotate-once {
                animation: spin-once 1s ease-in-out;
            }

            @keyframes spin-once {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);

        // Modal de Confirmação de Saída
        const exitButton = document.getElementById('exitButton');
        const exitModalOverlay = document.getElementById('exitModalOverlay');
        const closeExitModal = document.getElementById('closeExitModal');
        const cancelExitBtn = document.getElementById('cancelExitBtn');
        const confirmExitBtn = document.getElementById('confirmExitBtn');
        const exitSuccess = document.getElementById('exitSuccess');

        // Abrir o modal de saída ao clicar no botão de sair
        if (exitButton) {
            exitButton.addEventListener('click', () => {
                exitModalOverlay.classList.add('active');
                // Resetar estado do modal
                if (exitSuccess) exitSuccess.style.display = 'none';
                document.querySelector('.exit-buttons').style.display = 'flex';
            });
        }

        // Fechar o modal ao clicar no botão de fechar
        if (closeExitModal) {
            closeExitModal.addEventListener('click', () => {
                exitModalOverlay.classList.remove('active');
            });
        }

        // Fechar o modal ao clicar fora dele
        if (exitModalOverlay) {
            exitModalOverlay.addEventListener('click', (e) => {
                if (e.target === exitModalOverlay) {
                    exitModalOverlay.classList.remove('active');
                }
            });
        }

        // Cancelar saída
        if (cancelExitBtn) {
            cancelExitBtn.addEventListener('click', () => {
                exitModalOverlay.classList.remove('active');
            });
        }

        // Confirmar saída com animação antes de finalizar a sessão
        if (confirmExitBtn) {
            confirmExitBtn.addEventListener('click', async() => {
                document.querySelector('.exit-buttons').style.display = 'none';
                if (exitSuccess) exitSuccess.style.display = 'flex';
                // Aguarda animação e redireciona
                setTimeout(() => {
                    window.location.href = '/auth/dashboard-logout';
                }, 1200);
            });
        }

        document.addEventListener('DOMContentLoaded', async() => {
            try {
                const response = await fetch('/dashboard-user');
                if (response.ok) {
                    const data = await response.json();
                    if (data.username) {
                        document.getElementById('userName').textContent = data.username;
                        document.getElementById('userAvatar').textContent = data.username.charAt(0).toUpperCase();
                    }
                }
            } catch (error) {
                // Se der erro, mantém o padrão
            }
        });