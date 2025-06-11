/******************************
 *       CONFIGURAÇÕES        *
 ******************************/
const SENHA_CORRETA = "Escolho";
const VOLUME_MUSICA = 0.3;
let secaoAtual = 'inicio';
let musicStarted = false;
let currentImageIndex = 0;
const images = [];
let touchStartX = 0;
let touchEndX = 0;
let mouseDownX = 0;
let mouseUpX = 0;

/******************************
 *         LOGIN SYSTEM       *
 ******************************/
function verificarSenha() {
  const senhaInserida = document.getElementById('password-input').value;
  const loginError = document.getElementById('login-error');
  const loginScreen = document.getElementById('login-screen');
  
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
  
  bgMusic.volume = VOLUME_MUSICA;
  bgMusic.play()
    .catch(e => console.log("Erro ao reproduzir:", e));
  
  localStorage.setItem('musicPreference', 'on');
  updateMusicIcon();
}

function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  
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

/******************************
 *     NAVEGAÇÃO ENTRE SEÇÕES *
 ******************************/
const ordemSecoes = ['inicio', 'galeria', 'linha-do-tempo', 'carta', 'surpresa'];

function trocarSecao(secaoNova) {
  if (secaoNova === secaoAtual) return;

  const atual = document.getElementById(secaoAtual);
  const nova = document.getElementById(secaoNova);

  if (!document.getElementById('lightbox').classList.contains('hidden')) {
    closeLightbox();
  }

  const secoes = document.querySelectorAll('section');
  secoes.forEach(s => {
    s.classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
  });

  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => link.classList.remove('active'));

  const linkAtivo = document.querySelector(`.navbar a[href="#${secaoNova}"]`);
  linkAtivo.classList.add('active');

  const indiceAtual = ordemSecoes.indexOf(secaoAtual);
  const indiceNovo = ordemSecoes.indexOf(secaoNova);
  const vaiParaDireita = indiceNovo > indiceAtual;

  if (vaiParaDireita) {
    atual.classList.add('slide-out-left');
    nova.classList.add('slide-in-right');
  } else {
    atual.classList.add('slide-out-right');
    nova.classList.add('slide-in-left');
  }

  nova.style.display = 'block';
  nova.classList.add('active');

  setTimeout(() => {
    atual.style.display = 'none';
    secaoAtual = secaoNova;
    
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
    const surpresaContent = document.getElementById('surpresa-content');
    surpresaContent.classList.remove('hidden');
    
    // Rola suavemente até a surpresa
    setTimeout(() => {
        surpresaContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Remove o botão depois de clicado (opcional)
    document.querySelector('.btn-surpresa').style.display = 'none';
}

function mostrarPlayer() {
  const cover = document.getElementById('playlist-cover');
  const player = document.getElementById('youtube-player');
  
  cover.classList.add('hidden');
  player.classList.remove('hidden');
  
  // Opcional: Forçar recarregamento do iframe se necessário
  const iframe = player.querySelector('iframe');
  iframe.src = iframe.src; // Isso reinicia o player
}

/******************************
 *       GALERIA/LIGHTBOX     *
 ******************************/
function initGallery() {
  const galleryImages = document.querySelectorAll('.galeria img');
  galleryImages.forEach(img => images.push(img));
  
  images.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });
  
  document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
  document.getElementById('prev-btn').addEventListener('click', showPrevImage);
  document.getElementById('next-btn').addEventListener('click', showNextImage);
  
  const lightboxImg = document.getElementById('lightbox-img');
  
  // Touch events
  lightboxImg.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  lightboxImg.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  // Mouse events
  lightboxImg.addEventListener('mousedown', (e) => {
    mouseDownX = e.clientX;
  });
  
  lightboxImg.addEventListener('mouseup', (e) => {
    mouseUpX = e.clientX;
    handleMouseSwipe();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('show')) {
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'Escape') closeLightbox();
    }
  });
}

function handleSwipe() {
  const threshold = 50;
  if (touchStartX - touchEndX > threshold) {
    showNextImage();
  } else if (touchEndX - touchStartX > threshold) {
    showPrevImage();
  }
}

function handleMouseSwipe() {
  const threshold = 50;
  if (mouseDownX - mouseUpX > threshold) {
    showNextImage();
  } else if (mouseUpX - mouseDownX > threshold) {
    showPrevImage();
  }
}

function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.src = images[index].src;
  lightbox.classList.add('show');
  lightboxImg.classList.add('zoom-in');
  
  setTimeout(() => {
    lightboxImg.classList.remove('zoom-in');
  }, 300);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  lightboxImg.classList.add('zoom-out');
  
  setTimeout(() => {
    lightbox.classList.remove('show');
    lightboxImg.classList.remove('zoom-out');
  }, 300);
}

function showNextImage() {
  const lightboxImg = document.getElementById('lightbox-img');
  currentImageIndex = (currentImageIndex + 1) % images.length;
  
  lightboxImg.classList.add('slide-left');
  
  setTimeout(() => {
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.classList.remove('slide-left');
  }, 300);
}

function showPrevImage() {
  const lightboxImg = document.getElementById('lightbox-img');
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  
  lightboxImg.classList.add('slide-right');
  
  setTimeout(() => {
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.classList.remove('slide-right');
  }, 300);
}

/******************************
 *     INICIALIZAÇÃO DO SITE   *
 ******************************/
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
    section.classList.add('hidden');
  });
  
  document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verificarSenha();
  });
  
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0;
  setTimeout(() => { bgMusic.volume = VOLUME_MUSICA; }, 1000);
  updateMusicIcon();
  
  initGallery();
});

/******************************
 *  EXPOSIÇÃO DE FUNÇÕES GLOBAIS *
 ******************************/
window.verificarSenha = verificarSenha;
window.toggleMusic = toggleMusic;
window.trocarSecao = trocarSecao;
window.mostrarSurpresa = mostrarSurpresa;