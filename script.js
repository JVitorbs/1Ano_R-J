/******************************
 *       CONFIGURAÇÕES        *
 ******************************/
const SENHA_CORRETA = "Stitch"; // Senha de acesso (pode ser alterada)
const VOLUME_MUSICA = 0.3;      // Volume padrão da música (0 a 1)
let secaoAtual = 'inicio';      // Seção inicial do site
let musicStarted = false;       // Controle de música iniciada

/******************************
 *         LOGIN SYSTEM       *
 ******************************/
function verificarSenha() {
  const senhaInserida = document.getElementById('password-input').value;
  const loginError = document.getElementById('login-error');
  const loginScreen = document.getElementById('login-screen');
  
  // Verificação case-insensitive
  if (senhaInserida.toLowerCase() === SENHA_CORRETA.toLowerCase()) {
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.display = 'none';
      document.getElementById('inicio').classList.remove('hidden');
      document.getElementById('inicio').classList.add('active');
      
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

/******************************
 *      MUSIC CONTROLLER      *
 ******************************/
function startMusic() {
  const bgMusic = document.getElementById('bg-music');
  
  // Configura e inicia música
  bgMusic.volume = VOLUME_MUSICA;
  bgMusic.play()
    .catch(e => console.log("Erro ao reproduzir:", e));
  
  // Salva preferência
  localStorage.setItem('musicPreference', 'on');
  updateMusicIcon();
}

function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  
  // Alterna entre play/pause
  if (bgMusic.paused) {
    bgMusic.play();
    localStorage.setItem('musicPreference', 'on');
  } else {
    bgMusic.pause();
    localStorage.setItem('musicPreference', 'off');
  }
  
  updateMusicIcon();
}

function updateMusicIcon() {
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  
  // Atualiza ícone visual
  if (bgMusic.paused) {
    musicToggle.textContent = '🔇';
    musicToggle.title = 'Ligar música';
  } else {
    musicToggle.textContent = '🔊';
    musicToggle.title = 'Desligar música';
  }
}

/******************************
 *     NAVEGAÇÃO ENTRE SEÇÕES *
 ******************************/
const ordemSecoes = ['inicio', 'galeria', 'linha-do-tempo', 'carta', 'surpresa'];

function trocarSecao(secaoNova) {
  if (secaoNova === secaoAtual) return;

  const atual = document.getElementById(secaoAtual);
  const nova = document.getElementById(secaoNova);

  // Prepara animação
  const indiceAtual = ordemSecoes.indexOf(secaoAtual);
  const indiceNovo = ordemSecoes.indexOf(secaoNova);
  const vaiParaDireita = indiceNovo > indiceAtual;

  // Configura direção da animação
  atual.classList.add(vaiParaDireita ? 'slide-out-left' : 'slide-out-right');
  nova.classList.add(vaiParaDireita ? 'slide-in-right' : 'slide-in-left');
  nova.style.display = 'block';

  // Atualiza estado após animação
  setTimeout(() => {
    atual.style.display = 'none';
    secaoAtual = secaoNova;
  }, 500); // Duração da animação
}

/******************************
 *         SURPRESA           *
 ******************************/
function mostrarSurpresa() {
  const msg = document.getElementById('mensagem-surpresa');
  msg.classList.remove('hidden'); // Revela mensagem
}

/******************************
 *     INICIALIZAÇÃO DO SITE   *
 ******************************/
document.addEventListener('DOMContentLoaded', function() {
  // Esconde todas as seções inicialmente
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
    section.classList.add('hidden');
  });
  
  // Configura evento de Enter no login
  document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verificarSenha();
  });
  
  // Pré-configura música (volume baixo inicial)
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0;
  setTimeout(() => { bgMusic.volume = VOLUME_MUSICA; }, 1000);
  updateMusicIcon();
});

/******************************
 *  EXPOSIÇÃO DE FUNÇÕES GLOBAIS *
 ******************************/
// Torna funções acessíveis no HTML
window.verificarSenha = verificarSenha;
window.toggleMusic = toggleMusic;
window.trocarSecao = trocarSecao;
window.mostrarSurpresa = mostrarSurpresa;