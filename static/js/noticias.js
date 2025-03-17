      // Dados dos conflitos militares (com informações até outubro de 2024)
      const conflicts = [
          {
              name: "Guerra Rússia-Ucrânia",
              lat: 49.0139,
              lng: 31.2858,
              severity: "high",
              description: "Conflito de larga escala iniciado após a invasão russa em fevereiro de 2022. Envolve combates intensos, bombardeios e impacto humanitário significativo.",
              parties: "Rússia vs. Ucrânia (com apoio ocidental)"
          },
          {
              name: "Conflito Israel-Hamas",
              lat: 31.5,
              lng: 34.4667,
              severity: "high",
              description: "Escalada significativa após outubro de 2023, com operações militares israelenses em Gaza e tensões regionais elevadas.",
              parties: "Israel vs. Hamas (e outros grupos)"
          },
          {
              name: "Guerra Civil no Sudão",
              lat: 15.5007,
              lng: 32.5599,
              severity: "high",
              description: "Conflito entre o exército sudanês e as Forças de Apoio Rápido (RSF), causando uma grave crise humanitária com milhões de deslocados.",
              parties: "Exército Sudanês vs. Forças de Apoio Rápido"
          },
          {
              name: "Conflito em Myanmar (Birmânia)",
              lat: 19.7633,
              lng: 96.0785,
              severity: "medium",
              description: "Conflito entre a junta militar e diversos grupos étnicos armados e forças pró-democracia após o golpe militar de 2021.",
              parties: "Junta Militar vs. Grupos Étnicos Armados e Forças Pró-democracia"
          },
          {
              name: "Insurgência no Sahel",
              lat: 16.3700,
              lng: 2.6500,
              severity: "medium",
              description: "Conflito em curso no Mali, Burkina Faso e Níger envolvendo grupos jihadistas e forças governamentais, com desestabilização regional.",
              parties: "Governos do Sahel vs. Grupos Jihadistas"
          },
          {
              name: "Guerra Civil na Etiópia",
              lat: 9.1450,
              lng: 40.4897,
              severity: "medium",
              description: "Apesar do acordo de paz de 2022, persistem tensões e conflitos localizados em diversas regiões, principalmente em Tigré, Amhara e Oromia.",
              parties: "Governo Federal vs. Grupos Regionais"
          },
          {
              name: "Conflito no Leste da RD Congo",
              lat: -1.6501,
              lng: 29.2251,
              severity: "medium",
              description: "Conflito persistente envolvendo vários grupos armados, incluindo o M23, com intervenção de países vizinhos e grave crise humanitária.",
              parties: "Governo Congolês vs. Múltiplos Grupos Armados"
          },
          {
              name: "Guerra Civil no Iêmen",
              lat: 15.3694,
              lng: 44.1910,
              severity: "medium",
              description: "Conflito prolongado entre forças Houthi e governo reconhecido internacionalmente, com envolvimento regional e grave crise humanitária.",
              parties: "Houthis vs. Governo do Iêmen (com apoio de coalizão liderada pela Arábia Saudita)"
          },
          {
              name: "Insurgência em Cabo Delgado (Moçambique)",
              lat: -12.3335,
              lng: 40.5702,
              severity: "medium",
              description: "Conflito no norte de Moçambique envolvendo grupos extremistas islâmicos e forças governamentais, com intervenção regional.",
              parties: "Governo de Moçambique vs. Insurgentes Islâmicos"
          },
          {
              name: "Tensões na Península Coreana",
              lat: 38.0,
              lng: 127.0,
              severity: "low",
              description: "Tensões contínuas entre Coreia do Norte e Coreia do Sul, com testes de mísseis norte-coreanos e mobilizações militares periódicas.",
              parties: "Coreia do Norte vs. Coreia do Sul"
          },
          {
              name: "Conflito no Mar do Sul da China",
              lat: 15.1844,
              lng: 114.2500,
              severity: "low",
              description: "Disputas territoriais marítimas envolvendo China e vários países do sudeste asiático, com presença militar crescente na região.",
              parties: "China vs. Filipinas, Vietnã, Malásia, Taiwan e outros"
          },
          {
              name: "Insurgência no Sul da Tailândia",
              lat: 6.8691,
              lng: 101.2510,
              severity: "low",
              description: "Conflito de baixa intensidade nas províncias de maioria muçulmana no sul da Tailândia, com ataques esporádicos.",
              parties: "Governo Tailandês vs. Separatistas Muçulmanos"
          }
      ];

      // Função para inicializar o mapa
      function initMap() {
          // Criar mapa centrado em uma posição global
          const map = new google.maps.Map(document.getElementById("map"), {
              zoom: 2,
              center: { lat: 20, lng: 0 },
              mapTypeId: "terrain"
          });

          // Adicionar marcadores para cada conflito
          conflicts.forEach(conflict => {
              // Determinar a cor do marcador com base na severidade
              let iconColor;
              switch (conflict.severity) {
                  case "high":
                      iconColor = "#d32f2f"; // vermelho
                      break;
                  case "medium":
                      iconColor = "#f57c00"; // laranja
                      break;
                  case "low":
                      iconColor = "#fbc02d"; // amarelo
                      break;
                  default:
                      iconColor = "#2196f3"; // azul (padrão)
              }

              // Criar marcador
              const marker = new google.maps.Marker({
                  position: { lat: conflict.lat, lng: conflict.lng },
                  map: map,
                  title: conflict.name,
                  icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: iconColor,
                      fillOpacity: 0.8,
                      strokeWeight: 2,
                      strokeColor: "#ffffff",
                      scale: 10
                  }
              });

              // Adicionar evento de clique no marcador
              marker.addListener("click", () => {
                  showConflictInfo(conflict);
              });
          });
      }

      // Função para mostrar informações sobre o conflito selecionado
      function showConflictInfo(conflict) {
          const infoContainer = document.getElementById("conflict-info");
          
          // Determinar texto da severidade
          let severityText;
          switch (conflict.severity) {
              case "high":
                  severityText = "Alta Intensidade";
                  break;
              case "medium":
                  severityText = "Média Intensidade";
                  break;
              case "low":
                  severityText = "Baixa Intensidade";
                  break;
              default:
                  severityText = "Intensidade Desconhecida";
          }
          
          // Atualizar o conteúdo com as informações do conflito
          infoContainer.innerHTML = `
              <h3>${conflict.name}</h3>
              <p><strong>Severidade:</strong> ${severityText}</p>
              <p><strong>Partes envolvidas:</strong> ${conflict.parties}</p>
              <p><strong>Descrição:</strong> ${conflict.description}</p>
          `;
      }

      // Script para carregar a API do Google Maps
      function loadGoogleMapsScript() {
          const script = document.createElement("script");
          script.src = "https://maps.googleapis.com/maps/api/js?callback=initMap";
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
      }

      // Iniciar o carregamento quando a página estiver pronta
      window.onload = loadGoogleMapsScript;



// ------------------------ requizição de sumarização --------------------------//

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".toggle-summary");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
        const container = this.parentNode;
        const summaryDiv = container.querySelector(".noticia-summary");
        const loadingDiv = container.querySelector(".loading");

        if (summaryDiv.style.display === "none" || summaryDiv.style.display === "") {
            loadingDiv.style.display = "block";
            this.disabled = true;
            this.textContent = "Resumindo...";
            
            const urlNoticia = this.getAttribute("data-url");
            fetch(`/resumo?url=${encodeURIComponent(urlNoticia)}`)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = "none";
                summaryDiv.innerHTML = `<p>${data.resumo}</p>`;
                summaryDiv.style.display = "block";
                this.disabled = false;
                this.textContent = "Ocultar Resumo";
            })
            .catch(error => {
                console.error("Erro ao obter o resumo:", error);
                loadingDiv.style.display = "none";
                summaryDiv.innerHTML = `<p>Erro ao carregar o resumo.</p>`;
                summaryDiv.style.display = "block";
                this.disabled = false;
                this.textContent = "Ocultar Resumo";
            });
        } else {
            summaryDiv.style.display = "none";
            this.textContent = "Resumo";
        }
        });
    });
    });


// ------------------------ logica dos sliders --------------------------//

document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slider .slides');
    const indicators = document.querySelectorAll('.slider .indicator');
    const totalSlides = indicators.length;
    const intervalTime = 3000; // 5 segundos

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


// ------------------------ Logica do scroll e Menu Mobile --------------------------//

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