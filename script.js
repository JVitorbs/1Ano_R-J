/******************************
 *       CONFIGURAÇÕES        *
 ******************************/
const SENHA_CORRETA = "Stitch"; // Senha de acesso (pode ser alterada)
const VOLUME_MUSICA = 0.3;      // Volume padrão da música (0 a 1)
let secaoAtual = 'inicio';      // Seção inicial do site
let musicStarted = false;       // Controle de música iniciada
let currentImageIndex = 0;      // Índice da imagem atual na lightbox
const images = [];              // Array para armazenar as imagens da galeria

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

  // Fecha o lightbox se estiver aberto
  if (!document.getElementById('lightbox').classList.contains('hidden')) {
    closeLightbox();
  }

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
    
    // Força redesenho da galeria para evitar bugs visuais
    if (secaoNova === 'galeria') {
      document.querySelectorAll('.galeria img').forEach(img => {
        img.style.display = 'block';
      });
    }
  }, 500);
}

/******************************
 *         SURPRESA           *
 ******************************/
function mostrarSurpresa() {
  const msg = document.getElementById('mensagem-surpresa');
  msg.classList.remove('hidden'); // Revela mensagem
}

/******************************
 *       GALERIA/LIGHTBOX     *
 ******************************/
function initGallery() {
  // Preenche o array com as imagens da galeria
  const galleryImages = document.querySelectorAll('.galeria img');
  galleryImages.forEach(img => images.push(img));
  
  // Adiciona eventos de clique para cada imagem
  images.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });
  
  // Configura eventos dos controles
  document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
  document.getElementById('prev-btn').addEventListener('click', showPrevImage);
  document.getElementById('next-btn').addEventListener('click', showNextImage);
  
  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'Escape') closeLightbox();
    }
  });
}

function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.src = images[index].src;
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById('lightbox-img').src = images[currentImageIndex].src;
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById('lightbox-img').src = images[currentImageIndex].src;
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
  
  // Inicializa a galeria
  initGallery();
});

/******************************
 *  EXPOSIÇÃO DE FUNÇÕES GLOBAIS *
 ******************************/
// Torna funções acessíveis no HTML
window.verificarSenha = verificarSenha;
window.toggleMusic = toggleMusic;
window.trocarSecao = trocarSecao;
window.mostrarSurpresa = mostrarSurpresa;