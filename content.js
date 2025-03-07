(function () {
  console.log("BC Extension ativado!");
  // Verifica se a barra já existe para evitar duplicação
  if (document.getElementById("wh-helper-nav")) return;
  // Criar a barra de navegação
  const navBar = document.createElement("div");
  navBar.id = "wh-helper-nav";
  navBar.innerHTML = `
      <button id="btn-unread">📩 Não lidas</button>
      <button id="btn-schedule">📅 Programar mensagem</button>
    `;
  // Adicionar a barra no topo do WhatsApp Web
  document.body.appendChild(navBar);
  // Lógica para botão "Não lidas"
  document.getElementById("btn-unread").addEventListener("click", () => {
    alert("Exibir mensagens não lidas (Em desenvolvimento)...");
  });
  // Lógica para botão "Programar mensagem"
  document.getElementById("btn-schedule").addEventListener("click", () => {
    alert("Funcionalidade de agendamento (Em breve)...");
  });
})();
