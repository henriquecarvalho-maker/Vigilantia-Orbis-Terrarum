// ------------------------ Relogio de contagem regressiva --------------------------//

document.addEventListener('DOMContentLoaded', () => {
    const dataDestaqueElem = document.getElementById('dataDestaque');
    if (!dataDestaqueElem) return;
    
    const launchDateIso = dataDestaqueElem.getAttribute('data-iso');
    const launchDate = new Date(launchDateIso.trim());
    
    // Verifica se a data é válida
    if (isNaN(launchDate.getTime())) {
      console.error('Data de lançamento inválida:', launchDateIso);
      return;
    }

    function updateCountdown() {
      const now = new Date();
      const diff = launchDate - now;

      if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('mins').textContent = '00';
        document.getElementById('secs').textContent = '00';
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      
      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('mins').textContent = String(mins).padStart(2, '0');
      document.getElementById('secs').textContent = String(secs).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });

// ------------------------ logica dos sliders --------------------------//

document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slider .slides');
    const indicators = document.querySelectorAll('.slider .indicator');
    const totalSlides = indicators.length;
    const intervalTime = 5000; // 5 segundos

    // Atualiza a posição dos slides com base na largura do slider
    function updateSlider() {
      const sliderWidth = slider.clientWidth;
      slides.style.transform = `translateX(-${currentSlide * sliderWidth}px)`;
    }

    // Vai para o slide indicado e atualiza os indicadores
    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === index);
      });
    }

    // Avança para o próximo slide
    function nextSlide() {
      let next = (currentSlide + 1) % totalSlides;
      goToSlide(next);
    }

    // Eventos de clique nos indicadores
    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', () => {
        goToSlide(idx);
      });
    });

    // Atualiza a posição caso a janela seja redimensionada
    window.addEventListener('resize', updateSlider);

    // Inicia o carrossel após 5 segundos, garantindo que a primeira imagem seja exibida o tempo necessário
    setTimeout(() => {
      setInterval(nextSlide, intervalTime);
    }, intervalTime);
  });

// ------------------------ Função de formatação para datas --------------------------//

function formatCustomDateTime(isoString) {
    const date = new Date(isoString);
    const dtf = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      weekday: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: false
    });
    
    const parts = dtf.formatToParts(date);
    let month = '', weekday = '', day = '', hour = '', minute = '', tz = '';
    
    parts.forEach(part => {
      switch (part.type) {
        case 'month':
          month = part.value;
          break;
        case 'weekday':
          weekday = part.value;
          break;
        case 'day':
          day = part.value;
          break;
        case 'hour':
          hour = part.value;
          break;
        case 'minute':
          minute = part.value;
          break;
        case 'timeZoneName':
          tz = part.value;
          break;
        default:
          break;
      }
    });
    
    // Capitaliza o mês
    month = month.charAt(0).toUpperCase() + month.slice(1);
    
    // Mapeamento dos dias da semana para a abreviação desejada
    const weekdayMap = {
      'segunda-feira': 'Seg',
      'terça-feira': 'Terça',
      'quarta-feira': 'Qua',
      'quinta-feira': 'Qui',
      'sexta-feira': 'Sex',
      'sábado': 'Sáb',
      'domingo': 'Dom'
    };
    
    weekday = weekdayMap[weekday.toLowerCase()] || weekday;
    
    // Retorna no formato desejado: Exemplo "Fev Terça 18 20:15 BRT"
    return `${month} ${weekday} ${day} ${hour}:${minute} ${tz}`;
  }
  
  // Atualiza as datas na página após o carregamento
  document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a data do destaque
    const destaqueElem = document.getElementById('dataDestaque');
    if (destaqueElem) {
      const iso = destaqueElem.getAttribute('data-iso');
      destaqueElem.textContent = formatCustomDateTime(destaqueElem.textContent.trim());
    }
    
    // Atualiza as datas de cada notícia
    const isoDates = document.querySelectorAll('.iso-date');
    isoDates.forEach(elem => {
      elem.textContent = formatCustomDateTime(elem.textContent.trim());
    });
  });

  // ------------------------ Logica da rolagem/abertura da descrição da missão no card --------------------------//

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.missao-toggle').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.currentTarget.closest('.noticia');
        const descricao = card.querySelector('.missao-descricao-container');

        // Fecha os outros cards
        document.querySelectorAll('.noticia').forEach(otherCard => {
          if (otherCard !== card) {
            const otherDescricao = otherCard.querySelector('.missao-descricao-container');
            const otherButton = otherCard.querySelector('.missao-toggle');
            otherDescricao.classList.remove('expanded');
            otherButton.classList.remove('active');
            otherCard.classList.remove('expanded');
          }
        });

        // Alterna o estado no card clicado
        descricao.classList.toggle('expanded');
        button.classList.toggle('active');
        card.classList.toggle('expanded');
      });
    });

    // Fecha os cards ao clicar fora deles
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.noticia')) {
        document.querySelectorAll('.noticia').forEach(card => {
          const descricao = card.querySelector('.missao-descricao-container');
          const button = card.querySelector('.missao-toggle');
          descricao.classList.remove('expanded');
          button.classList.remove('active');
          card.classList.remove('expanded');
        });
      }
    });
  });

// ------------------------ Logica do scroll e Menu Mobile --------------------------//

//--- Scroll Header ---//
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.style.padding = '10px 30px';
    } else {
      header.style.padding = '15px 30px';
    }
  });

//--- Menu ---//
document.addEventListener('DOMContentLoaded', function() {
    // Script para controlar o efeito de scroll no header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Script para controlar o menu mobile
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    header.appendChild(mobileMenuBtn);
    
    const navBar = document.querySelector('.nav-bar');
    mobileMenuBtn.addEventListener('click', function() {
        navBar.classList.toggle('active');
        if (navBar.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-bar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navBar.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
});