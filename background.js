// Escuta quando a extensão é instalada pela primeira vez
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({isActive: false});
  console.log('Extensão WhatsApp Web Monitor instalada!');
});

// Monitora quando o WhatsApp Web é aberto
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('web.whatsapp.com')) {
    chrome.storage.local.get(['isActive'], function(result) {
      if (result.isActive) {
        chrome.tabs.sendMessage(tabId, {action: 'toggleMonitor', isActive: true});
      }
    });
  }
});