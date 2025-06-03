// Configurações de login
const SENHA_CORRETA = "Stitch"; // Você pode mudar essa senha
let secaoAtual = 'inicio';
let musicStarted = false;

// Verificar senha ao entrar
function verificarSenha() {
  const senhaInserida = document.getElementById('password-input').value;
  const loginError = document.getElementById('login-error');
  const loginScreen = document.getElementById('login-screen');
  
  if (senhaInserida === SENHA_CORRETA) {
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.display = 'none';
      document.getElementById('inicio').classList.remove('hidden');
      document.getElementById('inicio').classList.add('active');
      
      // Inicia a música após login
      if (!musicStarted) {
        startMusic();
        musicStarted = true;
      }
    }, 500);
  } else {
    loginError.classList.remove('hidden');
    setTimeout(() => {
      loginError.classList.add('hidden');
    }, 3000);
  }
}

// Iniciar música após login
function startMusic() {
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.3;
  bgMusic.play().catch(e => console.log("Reprodução bloqueada:", e));
  localStorage.setItem('musicPreference', 'on');
  updateMusicIcon();
}

// Controle de música
function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  
  if (bgMusic.paused) {
    bgMusic.play();
    localStorage.setItem('musicPreference', 'on');
  } else {
    bgMusic.pause();
    localStorage.setItem('musicPreference', 'off');
  }
  
  updateMusicIcon();
}

// Atualizar ícone do controle de música
function updateMusicIcon() {
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  
  if (bgMusic.paused) {
    musicToggle.textContent = '🔇';
    musicToggle.title = 'Ligar música';
  } else {
    musicToggle.textContent = '🔊';
    musicToggle.title = 'Desligar música';
  }
}

// Navegação entre seções
function trocarSecao(secaoNova) {
  if (secaoNova === secaoAtual) return;

  const atual = document.getElementById(secaoAtual);
  const nova = document.getElementById(secaoNova);

  // Remove classes ativas
  const secoes = document.querySelectorAll('section');
  secoes.forEach(s => {
    s.classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
  });

  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => link.classList.remove('active'));

  // Ativa o link correspondente
  const linkAtivo = document.querySelector(`.navbar a[href="#${secaoNova}"]`);
  linkAtivo.classList.add('active');

  // Determina a direção da animação
  const indiceAtual = ordemSecoes.indexOf(secaoAtual);
  const indiceNovo = ordemSecoes.indexOf(secaoNova);
  const vaiParaDireita = indiceNovo > indiceAtual;

  // Configura as animações
  if (vaiParaDireita) {
    atual.classList.add('slide-out-left');
    nova.classList.add('slide-in-right');
  } else {
    atual.classList.add('slide-out-right');
    nova.classList.add('slide-in-left');
  }

  // Mostra a nova seção
  nova.style.display = 'block';
  nova.classList.add('active');

  // Atualiza a seção atual após a animação
  setTimeout(() => {
    atual.style.display = 'none';
    secaoAtual = secaoNova;
  }, 500);
}

const ordemSecoes = ['inicio', 'galeria', 'linha-do-tempo', 'carta', 'surpresa'];

// Mostrar surpresa
function mostrarSurpresa() {
  const msg = document.getElementById('mensagem-surpresa');
  msg.classList.remove('hidden');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Configurações iniciais
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
    section.classList.add('hidden');
  });
  
  // Permite enviar com Enter
  document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      verificarSenha();
    }
  });
  
  // Configura música (sem iniciar)
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0;
  setTimeout(() => { bgMusic.volume = 0.3; }, 1000);
  updateMusicIcon();
});