let isActive = false;

// Criar a barra de navegação
function createNavBar() {
  const navbar = document.createElement("div");
  navbar.className = "wam-navbar";
  navbar.innerHTML = `
    <button id="wam-unread" class="wam-button">Não lidas</button>
    <button id="wam-schedule" class="wam-button">Programar mensagem</button>
  `;

  document.body.appendChild(navbar);

  // Adicionar event listeners aos botões
  document
    .getElementById("wam-unread")
    .addEventListener("click", handleUnreadMessages);
  document
    .getElementById("wam-schedule")
    .addEventListener("click", handleScheduleMessage);

  return navbar;
}

// Manipuladores para os botões
function handleUnreadMessages() {
  console.log("Verificando mensagens não lidas...");
  // Implementação futura: Destacar conversas não lidas
  showUnreadModal();
}

function handleScheduleMessage() {
  console.log("Programar mensagem...");
  showScheduleModal();
}

// Criar e mostrar o modal de mensagens não lidas
function showUnreadModal() {
  // Remover modal existente, se houver
  const existingModal = document.getElementById("wam-unread-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Criar o modal
  const modal = document.createElement("div");
  modal.id = "wam-unread-modal";
  modal.className = "wam-modal";

  // Conteúdo do modal
  modal.innerHTML = `
    <div class="wam-modal-content">
      <div class="wam-modal-header">
        <h2>Mensagens não lidas</h2>
        <span class="wam-modal-close">&times;</span>
      </div>
      <div class="wam-modal-body">
        <!-- Conteúdo em branco conforme solicitado -->
      </div>
    </div>
  `;

  // Adicionar modal ao body
  document.body.appendChild(modal);

  // Adicionar event listeners
  document
    .querySelector("#wam-unread-modal .wam-modal-close")
    .addEventListener("click", () => {
      modal.style.display = "none";
    });

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Mostrar o modal
  modal.style.display = "block";
}

// Criar e mostrar o modal de programação de mensagens
function showScheduleModal() {
  // Remover modal existente, se houver
  const existingModal = document.getElementById("wam-schedule-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Criar o modal
  const modal = document.createElement("div");
  modal.id = "wam-schedule-modal";
  modal.className = "wam-modal";

  // Conteúdo do modal
  modal.innerHTML = `
    <div class="wam-modal-content">
      <div class="wam-modal-header">
        <h2>Programar Mensagem</h2>
        <span class="wam-modal-close">&times;</span>
      </div>
      <div class="wam-modal-body">
        <div class="wam-form-group">
          <label for="wam-contact">Contato:</label>
          <input type="text" id="wam-contact" placeholder="Nome ou número do contato">
        </div>
        <div class="wam-form-group">
          <label for="wam-message">Mensagem:</label>
          <textarea id="wam-message" placeholder="Digite sua mensagem"></textarea>
        </div>
        <div class="wam-form-row">
          <div class="wam-form-group">
            <label for="wam-date">Data:</label>
            <input type="date" id="wam-date">
          </div>
          <div class="wam-form-group">
            <label for="wam-time">Hora:</label>
            <input type="time" id="wam-time">
          </div>
        </div>
      </div>
      <div class="wam-modal-footer">
        <button id="wam-schedule-btn" class="wam-button wam-schedule-btn">Programar</button>
      </div>
    </div>
  `;

  // Adicionar modal ao body
  document.body.appendChild(modal);

  // Adicionar event listeners
  document.querySelector(".wam-modal-close").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document
    .getElementById("wam-schedule-btn")
    .addEventListener("click", scheduleMessage);

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Mostrar o modal
  modal.style.display = "block";
}

// Função para processar o agendamento da mensagem
function scheduleMessage() {
  const contact = document.getElementById("wam-contact").value;
  const message = document.getElementById("wam-message").value;
  const date = document.getElementById("wam-date").value;
  const time = document.getElementById("wam-time").value;

  if (!contact || !message || !date || !time) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Criar objeto com os dados da mensagem agendada
  const scheduledMessage = {
    contact,
    message,
    scheduledTime: `${date}T${time}`,
    created: new Date().toISOString(),
  };

  // Salvar no storage do Chrome
  chrome.storage.local.get(["scheduledMessages"], function (result) {
    const messages = result.scheduledMessages || [];
    messages.push(scheduledMessage);

    chrome.storage.local.set({ scheduledMessages: messages }, function () {
      console.log("Mensagem agendada com sucesso!");
      document.getElementById("wam-schedule-modal").style.display = "none";
    });
  });
}

// Controla a visibilidade da barra de navegação
function toggleNavBar(show) {
  const navbar = document.querySelector(".wam-navbar");

  if (show) {
    if (!navbar) {
      createNavBar();
    } else {
      navbar.style.display = "flex";
    }
  } else if (navbar) {
    navbar.style.display = "none";
  }
}

// Inicializa a extensão
function initialize() {
  // Verifica se a extensão está ativa
  chrome.storage.local.get(["isActive"], function (result) {
    isActive = result.isActive || false;
    toggleNavBar(isActive);
  });

  // Observer para verificar quando o WhatsApp Web carrega completamente
  const observer = new MutationObserver(function (mutations) {
    if (document.querySelector(".app") && isActive) {
      toggleNavBar(true);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Adicionar estilos CSS
  addStyles();
}

// Adicionar estilos CSS
function addStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .wam-navbar {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      padding: 10px;
      background: #075e54;
      border-radius: 0 0 0 10px;
    }
    
    /* Estilos do Modal */
    .wam-modal {
      display: none;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    .wam-modal-content {
      background-color: #f8f9fa;
      margin: 10% auto;
      width: 100%;
      max-width: 700px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      animation: modalFade 0.3s ease-in-out;
    }
    
    @keyframes modalFade {
      from {opacity: 0; transform: translateY(-20px);}
      to {opacity: 1; transform: translateY(0);}
    }
    
    .wam-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #e2e8f0;
      background-color: #128c7e;
      color: white;
      border-radius: 8px 8px 0 0;
    }
    
    .wam-modal-header h2 {
      margin: 0;
      font-size: 18px;
    }
    
    .wam-modal-close {
      color: white;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }
    
    .wam-modal-body {
      padding: 20px;
      margin-right: 20px;
    }
    
    .wam-form-group {
      margin-bottom: 15px;
    }
    
    .wam-form-row {
      display: flex;
      gap: 15px;
    }
    
    .wam-form-row .wam-form-group {
      width: 80%;
    }

    .wam-form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #4a5568;
    }
    
    .wam-form-group input,
    .wam-form-group textarea {
      width: 90%;
      padding: 10px;
      border: 1px solid #cbd5e0;
      border-radius: 5px;
      font-size: 14px;
    }
    
    .wam-form-group textarea {
      height: 100px;
      resize: vertical;
    }
    
    .wam-modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #e2e8f0;
      text-align: right;
    }
    
    .wam-schedule-btn {
      background-color: #128c7e;
      font-weight: bold;
      color: white;
    }
    
    .wam-schedule-btn:hover {
      background-color: #0f6e63;
    }
  `;

  document.head.appendChild(style);
}

// Listener para mensagens do popup ou background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleMonitor") {
    isActive = request.isActive;
    toggleNavBar(isActive);
  }
});

// Inicializa quando a página carrega
window.addEventListener("load", initialize);
