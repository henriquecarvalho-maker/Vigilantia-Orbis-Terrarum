// ------------------------ Dashboard 1 --------------------------//

// Função para alternar entre as abas
function openTab(tabName) {
    // Esconde todas as abas
    var tabContents = document.getElementsByClassName("tab_2-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Remove a classe ativa de todas as abas
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    // Mostra a aba selecionada
    document.getElementById(tabName).classList.add("active");
    
    // Adiciona a classe ativa para a aba clicada
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].textContent.toLowerCase().includes(tabName.toLowerCase()) || 
            (tabName === "overview" && tabs[i].textContent.includes("Visão Geral"))) {
            tabs[i].classList.add("active");
            break;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Dados para os gráficos
    const civilianTimelineData = {
        labels: ['2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
        datasets: [{
            label: 'Mortes Confirmadas',
            data: [1500, 3200, 5100, 6700, 7600, 8400, 9100, 9600, 10200, 10700, 11000, 11300, 11582],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'Feridos Confirmados',
            data: [2200, 4800, 7300, 9800, 11400, 13100, 14500, 15800, 17300, 18500, 19600, 20700, 21400],
            borderColor: '#f39c12',
            backgroundColor: 'rgba(243, 156, 18, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const militaryComparisonData = {
        labels: ['Estimativa Mínima', 'Estimativa Média', 'Estimativa Alta'],
        datasets: [{
            label: 'Ucrânia',
            data: [20000, 31000, 40000],
            backgroundColor: 'rgba(52, 152, 219, 0.7)'
        }, {
            label: 'Rússia',
            data: [45000, 55000, 70000],
            backgroundColor: 'rgba(230, 126, 34, 0.7)'
        }]
    };

    const civilianByRegionData = {
        labels: ['Donetsk', 'Kharkiv', 'Luhansk', 'Zaporizhzhia', 'Kherson', 'Kyiv', 'Mykolaiv', 'Outros'],
        datasets: [{
            label: 'Baixas Civis Confirmadas',
            data: [3800, 2100, 1500, 1200, 900, 800, 600, 682],
            backgroundColor: [
                'rgba(231, 76, 60, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(155, 89, 182, 0.7)',
                'rgba(230, 126, 34, 0.7)',
                'rgba(149, 165, 166, 0.7)',
                'rgba(52, 73, 94, 0.7)'
            ]
        }]
    };

    const civilianByIncidentData = {
        labels: ['Bombardeios', 'Artilharia', 'Minas/Explosivos', 'Armas Pequenas', 'Ataques Aéreos', 'Outros'],
        datasets: [{
            label: 'Baixas por Tipo de Incidente',
            data: [4800, 3200, 1400, 850, 720, 612],
            backgroundColor: [
                'rgba(231, 76, 60, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(155, 89, 182, 0.7)',
                'rgba(230, 126, 34, 0.7)'
            ]
        }]
    };

    const militaryEstimatesData = {
        labels: ['2022', '2023', '2024', '2025 (Q1)'],
        datasets: [{
            label: 'Ucrânia (estimativa oficial)',
            data: [13000, 23000, 29000, 31000],
            backgroundColor: 'rgba(52, 152, 219, 0.7)'
        }, {
            label: 'Rússia (estimativa ucraniana)',
            data: [20000, 38000, 50000, 55000],
            backgroundColor: 'rgba(230, 126, 34, 0.7)'
        }, {
            label: 'Rússia (estimativa ocidental)',
            data: [18000, 33000, 45000, 48000],
            backgroundColor: 'rgba(155, 89, 182, 0.7)'
        }]
    };

    const equipmentLossesData = {
        labels: ['Tanques', 'Veículos Blindados', 'Artilharia', 'MLRS', 'Sistemas Antiaéreos', 'Aeronaves', 'Helicópteros', 'Drones', 'Navios/Barcos'],
        datasets: [{
            label: 'Ucrânia (confirmado)',
            data: [450, 890, 320, 110, 70, 60, 30, 280, 15],
            backgroundColor: 'rgba(52, 152, 219, 0.7)'
        }, {
            label: 'Rússia (confirmado)',
            data: [1850, 4300, 950, 240, 120, 330, 310, 1800, 25],
            backgroundColor: 'rgba(230, 126, 34, 0.7)'
        }]
    };

    const foreignByCountryData = {
        labels: ['EUA', 'Reino Unido', 'Geórgia', 'Bielorrússia', 'Canadá', 'Polônia', 'França', 'Outros'],
        datasets: [{
            label: 'Baixas Estimadas',
            data: [320, 240, 160, 120, 110, 95, 85, 110],
            backgroundColor: [
                'rgba(231, 76, 60, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(155, 89, 182, 0.7)',
                'rgba(230, 126, 34, 0.7)',
                'rgba(149, 165, 166, 0.7)',
                'rgba(52, 73, 94, 0.7)'
            ]
        }]
    };

    const foreignTimelineData = {
        labels: ['2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1'],
        datasets: [{
            label: 'Baixas em Legiões Estrangeiras',
            data: [80, 180, 300, 420, 520, 620, 710, 830, 940, 1050, 1120, 1190, 1240],
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    // Configurações comuns para os gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,  // Importante para permitir tamanho fixo
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                enabled: true
            }
        }
    };

    // Inicializar todos os gráficos
    // Visão Geral
    new Chart(document.getElementById('civilianTimeline'), {
        type: 'line',
        data: civilianTimelineData,
        options: commonOptions
    });

    new Chart(document.getElementById('militaryComparison'), {
        type: 'bar',
        data: militaryComparisonData,
        options: commonOptions
    });

    // Baixas Civis
    new Chart(document.getElementById('civilianByRegion'), {
        type: 'pie',
        data: civilianByRegionData,
        options: commonOptions
    });

    new Chart(document.getElementById('civilianByIncident'), {
        type: 'doughnut',
        data: civilianByIncidentData,
        options: commonOptions
    });

    // Baixas Militares
    new Chart(document.getElementById('militaryEstimates'), {
        type: 'bar',
        data: militaryEstimatesData,
        options: commonOptions
    });

    new Chart(document.getElementById('equipmentLosses'), {
        type: 'bar',
        data: equipmentLossesData,
        options: {
            ...commonOptions,
            indexAxis: 'y',  // Tornar o gráfico horizontal para melhor visualização com muitos rótulos
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });

    // Legiões Estrangeiras
    new Chart(document.getElementById('foreignByCountry'), {
        type: 'pie',
        data: foreignByCountryData,
        options: commonOptions
    });

    new Chart(document.getElementById('foreignTimeline'), {
        type: 'line',
        data: foreignTimelineData,
        options: commonOptions
    });
});


// ------------------------ Dashboard 2 --------------------------//

// Configurações e variáveis globais
let allData = null;
const apiUrl = '/api/data';

// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para carregar os dados da API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API. Status: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 'Erro ao carregar dados: ' + error.message;
        return null;
    }
}

// Função para preencher a tabela com dados
function populateTable(tableId, data) {
    if (!data || data.length === 0) return;
    
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    // Limpar tabelas existentes
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    // Criar cabeçalhos da tabela
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.replace('_', ' ').toUpperCase();
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    
    // Preencher dados da tabela
    data.forEach(row => {
        const tr = document.createElement('tr');
        
        headers.forEach(header => {
            const td = document.createElement('td');
            if (header.toLowerCase().includes('date')) {
                td.textContent = formatDate(row[header]);
            } else {
                td.textContent = row[header];
            }
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// Função para calcular mudança diária
function calculateDailyChange(data, field) {
    if (!data || data.length < 2) return null;
    
    const latestIndex = data.length - 1;
    const latestValue = parseInt(data[latestIndex][field]) || 0;
    const previousValue = parseInt(data[latestIndex - 1][field]) || 0;
    
    return latestValue - previousValue;
}

// Função para criar os cards de estatísticas
function createStatCards(data) {
    const statsContainer = document.getElementById('stats-cards');
    statsContainer.innerHTML = '';
    
    // Obter a entrada mais recente para pessoal
    const latestPersonnel = data.personnel[data.personnel.length - 1];
    const previousPersonnel = data.personnel.length > 1 ? data.personnel[data.personnel.length - 2] : null;
    
    // Obter a entrada mais recente para equipamentos
    const latestEquipment = data.equipment[data.equipment.length - 1];
    
    // Card de perda total de pessoal
    if (latestPersonnel) {
        const totalPersonnelCard = document.createElement('div');
        totalPersonnelCard.className = 'stat-card';
        
        // Calcular mudança diária
        const dailyChange = previousPersonnel ? latestPersonnel.personnel - previousPersonnel.personnel : null;
        const dailyChangeHTML = dailyChange !== null ? 
            `<span class="daily-change ${dailyChange >= 0 ? 'positive' : 'negative'}">
                ${dailyChange >= 0 ? '+' : ''}${dailyChange}
            </span>` : '';
        
        totalPersonnelCard.innerHTML = `
            <h3>Total de Baixas de Pessoal</h3>
            <div class="stat-value">${latestPersonnel.personnel || 'N/A'} ${dailyChangeHTML}</div>
            <p>Última atualização: ${formatDate(latestPersonnel.date)}</p>
        `;
        statsContainer.appendChild(totalPersonnelCard);
    }
    
    // Card para perdas diárias de pessoal
    if (latestPersonnel && previousPersonnel) {
        const dailyPersonnelCard = document.createElement('div');
        dailyPersonnelCard.className = 'stat-card';
        
        const dailyChange = latestPersonnel.personnel - previousPersonnel.personnel;
        
        dailyPersonnelCard.innerHTML = `
            <h3>Baixas de Pessoal (Diário)</h3>
            <div class="stat-value">${dailyChange}</div>
            <p>Data: ${formatDate(latestPersonnel.date)}</p>
        `;
        statsContainer.appendChild(dailyPersonnelCard);
    }
    
    // Equipamentos principais
    const equipmentTypes = ['aircraft', 'helicopter', 'tank', 'field artillery'];
    equipmentTypes.forEach(type => {
        if (latestEquipment && latestEquipment[type] !== undefined) {
            const equipmentCard = document.createElement('div');
            equipmentCard.className = 'stat-card';
            
            // Calcular mudança diária para o equipamento
            const dailyChange = calculateDailyChange(data.equipment, type);
            const dailyChangeHTML = dailyChange !== null ? 
                `<span class="daily-change ${dailyChange >= 0 ? 'positive' : 'negative'}">
                    ${dailyChange >= 0 ? '+' : ''}${dailyChange}
                </span>` : '';
            
            // Calcular o total acumulado para o equipamento
            const cumulativeTotal = data.equipment.reduce((total, record) => 
                total + (parseInt(record[type]) || 0), 0);
            
            equipmentCard.innerHTML = `
                <h3>${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</h3>
                <div class="stat-value">${latestEquipment[type]} ${dailyChangeHTML}</div>
                <p>Última atualização: ${formatDate(latestEquipment.date)}</p>
                
                <div class="stat-secondary">
                    <div class="stat-label">Total acumulado</div>
                    <div class="stat-value">${cumulativeTotal}</div>
                </div>
            `;
            statsContainer.appendChild(equipmentCard);
        }
    });
}

// Função para criar os gráficos
function createCharts(data) {
    // Preparar dados para o gráfico de equipamentos
    const equipmentData = data.equipment;
    const equipmentDates = equipmentData.map(item => formatDate(item.date));
    
    // Selecionar alguns tipos de equipamentos para o gráfico
    const equipmentTypes = ['tank', 'apc', 'field artillery', 'mrl', 'drone'];
    const equipmentDatasets = equipmentTypes.map((type, index) => {
        const colors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
        ];
        
        return {
            label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
            data: equipmentData.map(item => item[type]),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace('0.7', '0.2'),
            tension: 0.1
        };
    });
    
    // Criar gráfico de equipamentos
    new Chart(
        document.getElementById('equipmentChart'),
        {
            type: 'line',
            data: {
                labels: equipmentDates,
                datasets: equipmentDatasets
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
    
    // Preparar dados para o gráfico de pessoal
    const personnelData = data.personnel;
    const personnelDates = personnelData.map(item => formatDate(item.date));
    const personnelLosses = personnelData.map(item => item.personnel);
    
    // Calcular perdas diárias para o gráfico
    const dailyPersonnelLosses = [];
    for (let i = 1; i < personnelData.length; i++) {
        const dailyLoss = personnelData[i].personnel - personnelData[i-1].personnel;
        dailyPersonnelLosses.push(dailyLoss);
    }
    // Adicionar 0 para o primeiro dia (não temos dados anteriores)
    dailyPersonnelLosses.unshift(0);
    
    // Criar gráfico de pessoal
    new Chart(
        document.getElementById('personnelChart'),
        {
            type: 'line',
            data: {
                labels: personnelDates,
                datasets: [
                    {
                        label: 'Total de Baixas',
                        data: personnelLosses,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Baixas Diárias',
                        data: dailyPersonnelLosses,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Total de Baixas'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Baixas Diárias'
                        }
                    }
                }
            }
        }
    );
}

// Inicializar abas
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe ativa de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            // Adicionar classe ativa à aba clicada
            tab.classList.add('active');
            
            // Ocultar todos os conteúdos de abas
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // Mostrar o conteúdo da aba selecionada
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(tabName + '-content').classList.add('active');
        });
    });
}

// Função principal para inicializar o dashboard
async function initDashboard() {
    initTabs();
    
    const data = await fetchData();
    if (!data) return;
    
    // Ordena os arrays com base na data para garantir que o último elemento seja o mais recente
    data.personnel.sort((a, b) => new Date(a.date) - new Date(b.date));
    data.equipment.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    allData = data;
    
    // Atualizar última data de atualização
    const lastUpdatedElement = document.getElementById('last-updated');
    let lastUpdateDate;
    
    if (data.personnel && data.personnel.length > 0) {
        lastUpdateDate = data.personnel[data.personnel.length - 1].date;
    } else if (data.equipment && data.equipment.length > 0) {
        lastUpdateDate = data.equipment[data.equipment.length - 1].date;
    }
    
    if (lastUpdateDate) {
        lastUpdatedElement.textContent = `Última atualização: ${formatDate(lastUpdateDate)}`;
    }
    
    // Preencher tabelas
    populateTable('personnel-table', data.personnel);
    populateTable('equipment-table', data.equipment);
    populateTable('equipment_correction-table', data.equipment_correction);
    
    // Criar cards de estatísticas
    createStatCards(data);
    
    // Criar gráficos
    createCharts(data);
    
    // Ocultar o loader e mostrar o conteúdo
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
}

// Iniciar o dashboard quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', initDashboard);