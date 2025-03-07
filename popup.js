document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle');
    const statusText = document.getElementById('status');
    const statusDot = document.getElementById('status-dot');
    
    // Verifica o estado atual da extensão
    chrome.storage.local.get(['isActive'], function(result) {
      const isActive = result.isActive || false;
      updateUI(isActive);
    });
    
    // Alterna o estado ao clicar no botão
    toggleButton.addEventListener('click', function() {
      chrome.storage.local.get(['isActive'], function(result) {
        const isActive = result.isActive || false;
        const newState = !isActive;
        
        chrome.storage.local.set({isActive: newState});
        updateUI(newState);
        
        // Notifica o content script sobre a mudança
        chrome.tabs.query({url: 'https://web.whatsapp.com/*'}, function(tabs) {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleMonitor', isActive: newState});
          }
        });
      });
    });
    
    // Atualiza a interface do usuário com base no estado
    function updateUI(isActive) {
      statusText.textContent = isActive ? 'Ativado' : 'Desativado';
      toggleButton.textContent = isActive ? 'Desativar' : 'Ativar';
      
      if (isActive) {
        statusDot.classList.remove('inactive');
        statusDot.classList.add('active');
      } else {
        statusDot.classList.remove('active');
        statusDot.classList.add('inactive');
      }
    }
  });