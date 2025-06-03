let secaoAtual = 'inicio';

document.addEventListener('DOMContentLoaded', function() {
  // Elementos de música
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  
  // Verifica se há uma preferência salva
  const musicPreference = localStorage.getItem('musicPreference');
  
  // Configuração inicial
  if (musicPreference === 'on') {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Autoplay bloqueado:", e));
  }
  
  // Atualiza o ícone
  updateMusicIcon();
  
  // Listener para interação do usuário
  document.body.addEventListener('click', function firstInteraction() {
    if (bgMusic.paused && musicPreference !== 'off') {
      bgMusic.play().catch(e => console.log("Reprodução bloqueada:", e));
    }
    document.body.removeEventListener('click', firstInteraction);
  }, { once: true });
});

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

function mostrarSurpresa() {
  const msg = document.getElementById('mensagem-surpresa');
  msg.classList.remove('hidden');
}