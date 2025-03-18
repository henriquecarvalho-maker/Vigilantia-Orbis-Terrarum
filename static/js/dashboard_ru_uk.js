//-- JavaScript para a funcionalidade das abas de dados //

// Abas de dados
const tabs = document.querySelectorAll('.data-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(content => content.classList.remove('active'));

    const target = tab.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');
  });
});

//-- JavaScript para scroll suave nas nav-tabs //

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const targetId = this.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


//-- JavaScript para inicializar os gráficos com Chart.js //

document.addEventListener('DOMContentLoaded', function() {
    // Gráfico: Baixas Civis ao Longo do Tempo
    var ctxCivilian = document.getElementById('chart-civilian').getContext('2d');
    new Chart(ctxCivilian, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Baixas',
          data: [50, 75, 150, 100, 200, 250],
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Perdas de Equipamentos Militares
    var ctxMilitary = document.getElementById('chart-military').getContext('2d');
    new Chart(ctxMilitary, {
      type: 'bar',
      data: {
        labels: ['Tanques', 'Aeronaves', 'Veículos'],
        datasets: [{
          label: 'Perdas Ucranianas',
          data: [342, 89, 150],
          backgroundColor: 'rgba(52, 152, 219, 0.5)'
        }, {
          label: 'Perdas Russas',
          data: [1876, 315, 450],
          backgroundColor: 'rgba(230, 126, 34, 0.5)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Baixas por Região (Pizza)
    var ctxCasualtiesRegion = document.getElementById('chart-casualties-region').getContext('2d');
    new Chart(ctxCasualtiesRegion, {
      type: 'pie',
      data: {
        labels: ['Região 1', 'Região 2', 'Região 3', 'Região 4'],
        datasets: [{
          data: [3500, 2800, 1500, 600],
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',
            'rgba(230, 126, 34, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(46, 204, 113, 0.7)'
          ]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Baixas por Mês
    var ctxCasualtiesMonth = document.getElementById('chart-casualties-month').getContext('2d');
    new Chart(ctxCasualtiesMonth, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Baixas',
          data: [200, 180, 220, 240, 210, 230],
          backgroundColor: 'rgba(231, 76, 60, 0.5)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Comparação de Perdas de Equipamentos (Radar)
    var ctxEquipmentComparison = document.getElementById('chart-equipment-comparison').getContext('2d');
    new Chart(ctxEquipmentComparison, {
      type: 'radar',
      data: {
        labels: ['Tanques', 'Aeronaves', 'Veículos', 'Artilharia', 'Helicópteros'],
        datasets: [{
          label: 'Perdas Ucranianas',
          data: [342, 89, 150, 75, 30],
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          fill: true
        }, {
          label: 'Perdas Russas',
          data: [1876, 315, 450, 210, 60],
          backgroundColor: 'rgba(230, 126, 34, 0.2)',
          borderColor: 'rgba(230, 126, 34, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Tendência Diária de Perdas de Equipamentos
    var ctxDailyEquipment = document.getElementById('chart-daily-equipment').getContext('2d');
    new Chart(ctxDailyEquipment, {
      type: 'line',
      data: {
        labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6'],
        datasets: [{
          label: 'Perdas Diárias',
          data: [10, 12, 8, 15, 11, 9],
          backgroundColor: 'rgba(155, 89, 182, 0.2)',
          borderColor: 'rgba(155, 89, 182, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Mapa das Áreas Afetadas (Doughnut)
    var ctxMap = document.getElementById('chart-map').getContext('2d');
    new Chart(ctxMap, {
      type: 'doughnut',
      data: {
        labels: ['Área 1', 'Área 2', 'Área 3', 'Área 4'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',
            'rgba(230, 126, 34, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(241, 196, 15, 0.7)'
          ]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Deslocamento Regional (Barras horizontais)
    var ctxRegionalDisplacement = document.getElementById('chart-regional-displacement').getContext('2d');
    new Chart(ctxRegionalDisplacement, {
      type: 'bar',
      data: {
        labels: ['Donetsk', 'Luhansk', 'Kharkiv', 'Kyiv'],
        datasets: [{
          label: 'População Deslocada (em milhões)',
          data: [2.4, 1.8, 1.6, 0.9],
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',
            'rgba(230, 126, 34, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(155, 89, 182, 0.7)'
          ]
        }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
    });

    // Gráfico: Linha do Tempo do Conflito
    var ctxTimeline = document.getElementById('chart-timeline').getContext('2d');
    new Chart(ctxTimeline, {
      type: 'line',
      data: {
        labels: ['Fev 2022', 'Mar 2022', 'Abr 2022', 'Mai 2022', 'Set 2022', 'Nov 2022', 'Fev 2023', 'Mar 2025'],
        datasets: [{
          label: 'Eventos na Linha do Tempo',
          data: [0, 50, 100, 150, 200, 250, 300, 350],
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Gráficos ACLED:
    // Eventos Diários (ACLED)
    var ctxAcledEvents = document.getElementById('chart-acled-events').getContext('2d');
    new Chart(ctxAcledEvents, {
      type: 'line',
      data: {
        labels: ['01', '02', '03', '04', '05', '06', '07'],
        datasets: [{
          label: 'Eventos Diários',
          data: [30, 45, 25, 60, 50, 40, 55],
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Fatalidades Diárias (ACLED)
    var ctxAcledFatalities = document.getElementById('chart-acled-fatalities').getContext('2d');
    new Chart(ctxAcledFatalities, {
      type: 'line',
      data: {
        labels: ['01', '02', '03', '04', '05', '06', '07'],
        datasets: [{
          label: 'Fatalidades Diárias',
          data: [10, 15, 8, 20, 18, 12, 22],
          backgroundColor: 'rgba(230, 126, 34, 0.2)',
          borderColor: 'rgba(230, 126, 34, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  });
