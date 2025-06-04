
(function () {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();
// Inicialização do socket.io
const socket = io.connect('http://localhost:3000'); // Altere para o URL do seu servidor
const botStatus = {
    'main': false,
    'appointment': false,
    'reschedule': false
};


// Mapeamento de IDs de bot para elementos modais e cards
const botMap = {
    'main': {
        qrcodeElement: 'qrcodeBot1',
        statusElement: 'statusBot1',
        modalId: 'whatsappQrModalBot1',
        indicator: 'indicator-main',
        statusText: 'status-text-main',
        scanAnimation: 'scan-main',
        dashboardStatus: 'status-main',
        cardIndicator: 'card-indicator-main' // Indicador no card
    },
    'appointment': {
        qrcodeElement: 'qrcodeBot2',
        statusElement: 'statusBot2',
        modalId: 'whatsappQrModalBot2',
        indicator: 'indicator-appointment',
        statusText: 'status-text-appointment',
        scanAnimation: 'scan-appointment',
        dashboardStatus: 'status-appointment',
        cardIndicator: 'card-indicator-appointment' // Indicador no card
    },
    'reschedule': {
        qrcodeElement: 'qrcodeBot3',
        statusElement: 'statusBot3',
        modalId: 'whatsappQrModalBot3',
        indicator: 'indicator-reschedule',
        statusText: 'status-text-reschedule',
        scanAnimation: 'scan-reschedule',
        dashboardStatus: 'status-reschedule',
        cardIndicator: 'card-indicator-reschedule' // Indicador no card
    }
};

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
        <line x1="19.78" y1="4.22" x2="18.36" y2="5.64"></line>
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

// Função para verificar o status de um bot
const checkStatus = (botId) => {
    // Simular uma chamada de API para verificar o status
    setTimeout(() => {
        // Simulando uma resposta aleatória (50% de chance de estar online)
        botStatus[botId] = Math.random() > 0.5;
        updateBotStatus(botId);
    }, 1000);
};

// Função para atualizar o status do bot na interface
const updateBotStatus = (botId) => {
    const statusElement = document.getElementById(`status-${botId}`);
    if (statusElement) {
        if (botStatus[botId]) {
            statusElement.textContent = "Conectado";
            statusElement.className = "status connected";
        } else {
            statusElement.textContent = "Desconectado";
            statusElement.className = "status disconnected";
        }
    }
};

// Função para sincronizar o status entre modal, card e dashboard
function syncBotStatus(botId) {
    const botKey = botId.replace('bot', '').toLowerCase();
    const botConfig = botMap[botKey] || botMap[botId];

    if (!botConfig) return;

    const indicator = document.getElementById(botConfig.indicator);
    const cardIndicator = document.getElementById(botConfig.cardIndicator);
    const dashboardStatus = document.getElementById(botConfig.dashboardStatus);

    if (indicator && cardIndicator) {
        // Verifica se o indicador no modal tem a classe 'connected'
        const isConnected = indicator.classList.contains('connected');

        // Atualiza o status no card
        if (isConnected) {
            cardIndicator.classList.add('connected');
            cardIndicator.classList.remove('disconnected');
        } else {
            cardIndicator.classList.add('disconnected');
            cardIndicator.classList.remove('connected');
        }
    }

    if (indicator && dashboardStatus) {
        // Verifica se o indicador no modal tem a classe 'connected'
        const isConnected = indicator.classList.contains('connected');

        // Atualiza o status na dashboard de acordo com o status do modal
        if (isConnected) {
            dashboardStatus.textContent = "Conectado";
            dashboardStatus.className = "status connected";
        } else {
            dashboardStatus.textContent = "Desconectado";
            dashboardStatus.className = "status disconnected";
        }
    }
}

// Funções para abrir e fechar modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede rolagem da página
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaura rolagem da página
    }
}

// Funções específicas para modais de QR code
function openQrModal(botId) {
    const modalId = `whatsappQrModal${botId}`;
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeQrModal(botId) {
    const modalId = `whatsappQrModal${botId}`;
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há uma preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Atualizar o ícone do tema
        const themeIcon = document.querySelector('.theme-icon');
        if (savedTheme === 'dark') {
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
            <line x1="19.78" y1="4.22" x2="18.36" y2="5.64"></line>
        </svg>
    `;
        }
    }

    // Adicionar event listener para o botão de alternar tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Verificar o status inicial dos bots
    checkStatus('bot1');
    checkStatus('bot2');
    checkStatus('bot3');

    // Modal de informações
    const infoButton = document.getElementById('infoButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');

    if (infoButton) {
        infoButton.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }
    if (document.getElementById('closeQrModalBotAI')) {
        document.getElementById('closeQrModalBotAI').addEventListener('click', () => closeQrModal('BotAI'));
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Modal de Confirmação de Saída
    const exitButton = document.getElementById('exitButton');
    const exitModalOverlay = document.getElementById('exitModalOverlay');
    const closeExitModal = document.getElementById('closeExitModal');
    const cancelExitBtn = document.getElementById('cancelExitBtn');
    const confirmExitBtn = document.getElementById('confirmExitBtn');
    const exitSuccess = document.getElementById('exitSuccess');

    // Modificar o event listener do botão de sair
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            exitModalOverlay.classList.add('active');
            exitSuccess.style.display = 'none';
            document.querySelector('.exit-buttons').style.display = 'flex';
        });
    }

    // Fechar o modal
    if (closeExitModal) {
        closeExitModal.addEventListener('click', () => {
            exitModalOverlay.classList.remove('active');
        });
    }

    // Quando clicar fora do modal
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

    // Confirmar saída
    if (confirmExitBtn) {
        confirmExitBtn.addEventListener('click', async () => {
            document.querySelector('.exit-buttons').style.display = 'none';
            exitSuccess.style.display = 'flex';

            // Simular animação de saída
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Finalizar a sessão
            fetch('/auth/logout', {
                method: 'GET'
            })
                .then(() => {
                    window.location.href = '/login'; // Redirecionar para a página de login
                })
                .catch(err => console.error('Erro ao finalizar a sessão:', err));
        });
    }

    // Adicionar eventos para modais de QR code
    if (document.getElementById('closeQrModalBot1')) {
        document.getElementById('closeQrModalBot1').addEventListener('click', () => closeQrModal('Bot1'));
    }
    if (document.getElementById('closeQrModalBot2')) {
        document.getElementById('closeQrModalBot2').addEventListener('click', () => closeQrModal('Bot2'));
    }
    if (document.getElementById('closeQrModalBot3')) {
        document.getElementById('closeQrModalBot3').addEventListener('click', () => closeQrModal('Bot3'));
    }

    // Adicionar eventos para os botões de conectar bot - ADICIONADO AQUI
    const connectButtons = document.querySelectorAll('[id^="connect-bot"]');
    connectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const botId = button.id.replace('connect-bot', '');
            openQrModal(`Bot${botId}`);
        });
    });

    // Adicionar eventos para os botões na dashboard ou em cards - ADICIONADO AQUI
    const connectMainBtn = document.getElementById('connect-main-btn');
    const connectAppointmentBtn = document.getElementById('connect-appointment-btn');
    const connectRescheduleBtn = document.getElementById('connect-reschedule-btn');

    if (connectMainBtn) {
        connectMainBtn.addEventListener('click', () => openQrModal('Bot1'));
    }
    if (connectAppointmentBtn) {
        connectAppointmentBtn.addEventListener('click', () => openQrModal('Bot2'));
    }
    if (connectRescheduleBtn) {
        connectRescheduleBtn.addEventListener('click', () => openQrModal('Bot3'));
    }

    // Fechar modal ao clicar fora dele
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = ''; // Restaura a rolagem da página
            }
        });
    });

    // Inicializar o status dos indicadores nos cards
    Object.keys(botMap).forEach(botId => {
        const botConfig = botMap[botId];
        const cardIndicator = document.getElementById(botConfig.cardIndicator);
        const indicator = document.getElementById(botConfig.indicator);

        if (cardIndicator && indicator) {
            const isConnected = indicator.classList.contains('connected');
            if (isConnected) {
                cardIndicator.classList.add('connected');
                cardIndicator.classList.remove('disconnected');
            } else {
                cardIndicator.classList.add('disconnected');
                cardIndicator.classList.remove('connected');
            }
        }
    });

    // Configurando Socket.io se estiver disponível
    if (typeof io !== 'undefined') {
        const socket = io();

        // Atualizar QR code
        socket.on('qrcode', function (data) {
            const botConfig = botMap[data.bot];
            if (botConfig) {
                // Atualizar o QR code no modal
                const qrElement = document.getElementById(botConfig.qrcodeElement);
                if (qrElement) {
                    qrElement.src = data.qrcode;
                }

                // Atualizar o status
                const statusElement = document.getElementById(botConfig.statusElement);
                if (statusElement) {
                    statusElement.innerHTML = 'Escaneie o código QR para conectar';
                }

                // Mostrar a animação de scan
                const scanAnimation = document.getElementById(botConfig.scanAnimation);
                if (scanAnimation) {
                    scanAnimation.style.display = 'block';
                }

                // Atualizar o indicador no modal para offline
                const indicator = document.getElementById(botConfig.indicator);
                if (indicator) {
                    indicator.classList.remove('connected');
                    indicator.classList.add('offline');
                }

                // Atualizar o indicador no card
                const cardIndicator = document.getElementById(botConfig.cardIndicator);
                if (cardIndicator) {
                    cardIndicator.classList.remove('connected');
                    cardIndicator.classList.add('disconnected');
                }

                // Sincronizar dashboard com status do modal
                const dashboardStatus = document.getElementById(botConfig.dashboardStatus);
                if (dashboardStatus) {
                    dashboardStatus.textContent = "Desconectado";
                    dashboardStatus.className = "status disconnected";
                }
            }
        });

        socket.on('connection-status', function (data) {
            const botConfig = botMap[data.bot];
            if (botConfig) {
                const indicator = document.getElementById(botConfig.indicator);
                const statusText = document.getElementById(botConfig.statusText);
                const statusElement = document.getElementById(botConfig.statusElement);
                const scanAnimation = document.getElementById(botConfig.scanAnimation);
                const cardIndicator = document.getElementById(botConfig.cardIndicator);

                if (data.connected) {
                    // Atualizar status no modal
                    if (indicator) {
                        indicator.classList.add('connected');
                        indicator.classList.remove('offline');
                    }
                    if (statusText) statusText.textContent = "CONECTADO";
                    if (statusElement) statusElement.textContent = "WhatsApp conectado com sucesso!";
                    if (scanAnimation) scanAnimation.style.display = 'none';

                    // Atualizar status no card
                    if (cardIndicator) {
                        cardIndicator.classList.add('connected');
                        cardIndicator.classList.remove('disconnected');
                    }
                } else {
                    // Atualizar status no modal
                    if (indicator) {
                        indicator.classList.remove('connected');
                        indicator.classList.add('offline');
                    }
                    if (statusText) statusText.textContent = "NÃO CONECTADO";

                    // Atualizar status no card
                    if (cardIndicator) {
                        cardIndicator.classList.remove('connected');
                        cardIndicator.classList.add('disconnected');
                    }
                }
            }
        });

        // Atualizar status de todos os bots
        socket.on('all-connection-status', function (data) {
            Object.keys(data).forEach(bot => {
                const statusElement = document.getElementById(`status-${bot}`);
                const botConfig = botMap[bot];

                if (statusElement) {
                    if (data[bot]) {
                        statusElement.textContent = "Conectado";
                        statusElement.className = "status connected";
                    } else {
                        statusElement.textContent = "Desconectado";
                        statusElement.className = "status disconnected";
                    }
                }

                if (botConfig) {
                    // Atualizar indicador e texto de status no modal
                    const indicator = document.getElementById(botConfig.indicator);
                    const statusText = document.getElementById(botConfig.statusText);
                    const statusElement = document.getElementById(botConfig.statusElement);
                    const scanAnimation = document.getElementById(botConfig.scanAnimation);
                    const cardIndicator = document.getElementById(botConfig.cardIndicator);

                    if (indicator && statusText) {
                        if (data[bot]) {
                            indicator.classList.add('connected');
                            indicator.classList.remove('offline');
                            statusText.textContent = "CONECTADO";
                            if (statusElement) statusElement.textContent = "WhatsApp conectado com sucesso!";
                            if (scanAnimation) scanAnimation.style.display = 'none';
                            // Atualiza o status no card
                            if (cardIndicator) {
                                cardIndicator.classList.add('connected');
                                cardIndicator.classList.remove('disconnected');
                            }
                        } else {
                            indicator.classList.remove('connected');
                            indicator.classList.add('offline');
                            statusText.textContent = "NÃO CONECTADO";
                            // Atualiza o status no card
                            if (cardIndicator) {
                                cardIndicator.classList.remove('connected');
                                cardIndicator.classList.add('disconnected');
                            }
                        }
                    }

                    // Sincronizar o status na interface principal
                    syncBotStatus(bot);
                }
            });
        });

        // Verificar status de conexão ao carregar
        fetch('/all-connection-status')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(bot => {
                    const statusElement = document.getElementById(`status-${bot}`);
                    const botConfig = botMap[bot];

                    if (botConfig) {
                        // Atualizar indicador e texto de status no modal
                        const indicator = document.getElementById(botConfig.indicator);
                        const statusText = document.getElementById(botConfig.statusText);
                        const statusElement = document.getElementById(botConfig.statusElement);
                        const scanAnimation = document.getElementById(botConfig.scanAnimation);
                        const cardIndicator = document.getElementById(botConfig.cardIndicator);

                        if (indicator && statusText && data[bot]) {
                            indicator.classList.add('connected');
                            indicator.classList.remove('offline');
                            statusText.textContent = "CONECTADO";
                            if (statusElement) statusElement.textContent = "WhatsApp conectado com sucesso!";
                            if (scanAnimation) scanAnimation.style.display = 'none';
                            // Atualiza o status no card
                            if (cardIndicator) {
                                cardIndicator.classList.add('connected');
                                cardIndicator.classList.remove('disconnected');
                            }
                        }

                        // Sincronizar o status na interface principal
                        syncBotStatus(bot);
                    }
                });
            })
            .catch(error => console.error('Erro ao verificar status:', error));

        // Atualizar status de conexão ao carregar a página
        fetch('/all-connection-status')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(bot => {
                    const botConfig = botMap[bot];
                    if (botConfig) {
                        const indicator = document.getElementById(botConfig.indicator);
                        const statusText = document.getElementById(botConfig.statusText);
                        const cardIndicator = document.getElementById(botConfig.cardIndicator);

                        if (data[bot]) {
                            // Atualizar para conectado
                            if (indicator) {
                                indicator.classList.add('connected');
                                indicator.classList.remove('offline');
                            }
                            if (statusText) statusText.textContent = "CONECTADO";
                            if (cardIndicator) {
                                cardIndicator.classList.add('connected');
                                cardIndicator.classList.remove('disconnected');
                            }
                        } else {
                            // Atualizar para desconectado
                            if (indicator) {
                                indicator.classList.remove('connected');
                                indicator.classList.add('offline');
                            }
                            if (statusText) statusText.textContent = "NÃO CONECTADO";
                            if (cardIndicator) {
                                cardIndicator.classList.remove('connected');
                                cardIndicator.classList.add('disconnected');
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Erro ao verificar status:', error));
    }

    // Adicionar um MutationObserver para cada indicador de modal para detectar mudanças de estado
    Object.keys(botMap).forEach(botId => {
        const indicator = document.getElementById(botMap[botId].indicator);
        if (indicator) {
            const observer = new MutationObserver(() => {
                syncBotStatus(botId);
            });

            observer.observe(indicator, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    });
});

// Botão do WhatsApp agora apenas redireciona para o suporte
document.getElementById('whatsappBtn').addEventListener('click', function () {
    // Altere o número abaixo para o número de suporte desejado
    window.open('https://wa.me/5531985079718', '_blank');
});


document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const infoButton = document.getElementById('infoButton');
    const dashboardBtn = document.getElementById('dashboardBtn');

    let buttonsVisible = false;

    toggleBtn.addEventListener('click', () => {
        buttonsVisible = !buttonsVisible;

        if (buttonsVisible) {
            whatsappBtn.classList.remove('hidden');
            whatsappBtn.classList.add('visible');
            infoButton.classList.remove('hidden');
            infoButton.classList.add('visible');
            dashboardBtn.classList.remove('hidden');
            dashboardBtn.classList.add('visible');
        } else {
            whatsappBtn.classList.remove('visible');
            whatsappBtn.classList.add('hidden');
            infoButton.classList.remove('visible');
            infoButton.classList.add('hidden');
            dashboardBtn.classList.remove('visible');
            dashboardBtn.classList.add('hidden');
        }
    });

    // Esconder os botões inicialmente
    whatsappBtn.classList.add('hidden');
    infoButton.classList.add('hidden');
    dashboardBtn.classList.add('hidden');

    // Clique no botão dashboard
    dashboardBtn.addEventListener('click', () => {
        window.location.href = '/dashboard-login';
    });
});


function refreshBotStatus(botKey) {
    const botConfig = botMap[botKey];
    if (!botConfig) return;

    // Mostra "Verificando..." enquanto aguarda
    const statusText = document.getElementById(botConfig.statusText);
    if (statusText) statusText.textContent = "VERIFICANDO...";

    // Animação do botão
    const refreshButton = document.querySelector(`.refresh-status-btn[onclick="refreshBotStatus('${botKey}')"]`);
    if (refreshButton) {
        refreshButton.classList.add('spin');
        setTimeout(() => refreshButton.classList.remove('spin'), 500);
    }

    // Delay para garantir atualização real do backend
    setTimeout(() => {
        fetch(`/check-status/${botKey}`)
            .then(response => response.json())
            .then(data => {
                const isConnected = data.connected;

                // Atualizar indicador no card
                const cardIndicator = document.getElementById(botConfig.cardIndicator);
                if (cardIndicator) {
                    cardIndicator.classList.toggle('connected', isConnected);
                    cardIndicator.classList.toggle('disconnected', !isConnected);
                }

                // Atualizar indicador no modal
                const indicator = document.getElementById(botConfig.indicator);
                if (indicator) {
                    indicator.classList.toggle('connected', isConnected);
                    indicator.classList.toggle('offline', !isConnected);
                }

                // Atualizar texto de status no modal
                if (statusText) {
                    statusText.textContent = isConnected ? "CONECTADO" : "NÃO CONECTADO";
                }

                // Imprimir no console
                const botNumber = botKey === 'main' ? 1 : botKey === 'appointment' ? 2 : 3;
                console.log(`Verificado status do Bot ${botNumber}: ${isConnected ? 'Conectado' : 'Desconectado'}`);
            })
            .catch(() => {
                // Em caso de erro, marca como desconectado
                const cardIndicator = document.getElementById(botConfig.cardIndicator);
                const indicator = document.getElementById(botConfig.indicator);
                if (cardIndicator) {
                    cardIndicator.classList.add('disconnected');
                    cardIndicator.classList.remove('connected');
                }
                if (indicator) {
                    indicator.classList.add('offline');
                    indicator.classList.remove('connected');
                }
                if (statusText) {
                    statusText.textContent = "NÃO CONECTADO";
                }
                const botNumber = botKey === 'main' ? 1 : botKey === 'appointment' ? 2 : 3;
                console.log(`Verificado status do Bot ${botNumber}: Desconectado`);
            });
    }, 1200); // 1.2s de delay para garantir atualização real
}


// Modal de Confirmação de Saída
const exitButton = document.getElementById('exitButton');
const exitModalOverlay = document.getElementById('exitModalOverlay');
const closeExitModal = document.getElementById('closeExitModal');
const cancelExitBtn = document.getElementById('cancelExitBtn');
const confirmExitBtn = document.getElementById('confirmExitBtn');
const exitSuccess = document.getElementById('exitSuccess');

// Abrir o modal de saída ao clicar no botão do canto superior esquerdo
if (exitButton) {
    exitButton.addEventListener('click', () => {
        if (exitModalOverlay) {
            exitModalOverlay.classList.add('active');
            exitSuccess.style.display = 'none';
            document.querySelector('.exit-buttons').style.display = 'flex';
        }
    });
}

// Fechar o modal ao clicar no botão de fechar
if (closeExitModal) {
    closeExitModal.addEventListener('click', () => {
        if (exitModalOverlay) {
            exitModalOverlay.classList.remove('active');
        }
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
        if (exitModalOverlay) {
            exitModalOverlay.classList.remove('active');
        }
    });
}

// Confirmar saída com animação antes de finalizar a sessão
if (confirmExitBtn) {
    confirmExitBtn.addEventListener('click', async () => {
        document.querySelector('.exit-buttons').style.display = 'none';
        exitSuccess.style.display = 'flex';

        // Simular animação de saída
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Finalizar a sessão
        fetch('/auth/logout', {
            method: 'GET'
        })
            .then(() => {
                window.location.href = '/login'; // Redirecionar para a página de login
            })
            .catch(err => console.error('Erro ao finalizar a sessão:', err));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Função para verificar o status de todos os bots
    function checkAllBotsStatus() {
        fetch('/all-connection-status')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(botKey => {
                    const isConnected = data[botKey];
                    const botConfig = botMap[botKey];

                    if (botConfig) {
                        // Atualizar o indicador no card
                        const cardIndicator = document.getElementById(botConfig.cardIndicator);
                        if (cardIndicator) {
                            cardIndicator.classList.toggle('connected', isConnected);
                            cardIndicator.classList.toggle('disconnected', !isConnected);
                        }

                        // Atualizar o indicador no modal
                        const indicator = document.getElementById(botConfig.indicator);
                        if (indicator) {
                            indicator.classList.toggle('connected', isConnected);
                            indicator.classList.toggle('offline', !isConnected);
                        }

                        // Atualizar o texto de status no modal
                        const statusText = document.getElementById(botConfig.statusText);
                        if (statusText) {
                            statusText.textContent = isConnected ? "CONECTADO" : "NÃO CONECTADO";
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Erro ao verificar o status dos bots:', error);
            });
    }

    // Verificar o status de todos os bots ao carregar a página
    checkAllBotsStatus();
});

// Atualizar contador de atendimentos em tempo real
const statMain = document.getElementById('stat-main');
const statAppointment = document.getElementById('stat-appointment');
const statReschedule = document.getElementById('stat-reschedule');

// Recebe atualizações do backend
if (typeof io !== 'undefined') {
    const socket = io();

    socket.on('atendimento-update', data => {
        if (data.bot === 'main' && statMain) statMain.textContent = data.count;
        if (data.bot === 'appointment' && statAppointment) statAppointment.textContent = data.count;
        if (data.bot === 'reschedule' && statReschedule) statReschedule.textContent = data.count;
    });

    // Inicializa os contadores ao carregar a página
    fetch('/atendimentos')
        .then(res => res.json())
        .then(data => {
            if (statMain) statMain.textContent = data.main || 0;
            if (statAppointment) statAppointment.textContent = data.appointment || 0;
            if (statReschedule) statReschedule.textContent = data.reschedule || 0;
        });
}