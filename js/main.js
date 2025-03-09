// Variáveis globais
const API_URL = 'https://api.github.com/users/plajiw/repos';
let allProjects = [];
let activeFilter = 'all';

// Função para inicializar o site quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os componentes da interface
    initNavigation();
    initThemeToggle();
    initProjectFilters();
    
    // Carrega projetos do GitHub
    fetchGitHubProjects();
});

// Funções de navegação e UI
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle menu mobile
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Destaca o link ativo durante a rolagem
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 200; // Ajuste de 200px para melhor detecção
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Verifica o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Alterna entre tema claro e escuro
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Funções para gerenciamento de projetos
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe ativa ao botão clicado
            button.classList.add('active');
            
            // Filtra os projetos
            activeFilter = button.getAttribute('data-filter');
            filterProjects(activeFilter);
        });
    });
}

// Função melhorada para buscar projetos do GitHub
async function fetchGitHubProjects() {
    const projectsContainer = document.getElementById('github-projects');
    
    try {
        // Exibe spinner de carregamento
        projectsContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando projetos...</p>
            </div>
        `;
        
        // Busca dados da API do GitHub com tratamento de erro e timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
        
        const response = await fetch(API_URL, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro na API do GitHub: ${response.status}`);
        }
        
        // Processa os dados dos projetos
        const data = await response.json();
        allProjects = await processProjectsData(data);
        
        // Exibe os projetos
        filterProjects(activeFilter);
        
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        
        projectsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Não foi possível carregar os projetos. ${error.message}</p>
                <button class="retry-btn">Tentar novamente</button>
            </div>
        `;
        
        // Adiciona evento para tentar novamente
        document.querySelector('.retry-btn')?.addEventListener('click', fetchGitHubProjects);
    }
}

// Função para processar e enriquecer os dados dos projetos
async function processProjectsData(repos) {
    // Filtra projetos que não são forks e tem descrição
    const filteredRepos = repos.filter(repo => !repo.fork && repo.description);
    
    // Mapeia os dados dos repositórios para o formato que precisamos
    return Promise.all(filteredRepos.map(async repo => {
        // Determina a linguagem principal e linguagens adicionais
        let languages = [];
        if (repo.language) {
            languages.push(repo.language);
        }
        
        // Tenta obter as cores das linguagens (opcional, pode ser removido se causar muitas requisições)
        try {
            const languagesResponse = await fetch(repo.languages_url);
            if (languagesResponse.ok) {
                const languagesData = await languagesResponse.json();
                languages = Object.keys(languagesData);
            }
        } catch (error) {
            console.warn(`Não foi possível buscar linguagens para ${repo.name}:`, error);
        }
        
        // Retorna objeto do projeto com dados formatados
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Sem descrição disponível',
            language: repo.language || 'Desconhecida',
            languages: languages,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            homepage: repo.homepage,
            updated_at: new Date(repo.updated_at).toLocaleDateString('pt-BR')
        };
    }));
}

// Função para filtrar e exibir projetos
function filterProjects(filter) {
    const projectsContainer = document.getElementById('github-projects');
    
    // Filtra os projetos com base no filtro selecionado
    const filteredProjects = filter === 'all' 
        ? allProjects 
        : allProjects.filter(project => 
            project.languages.includes(filter) || project.language === filter
        );
    
    // Limpa o container de projetos
    projectsContainer.innerHTML = '';
    
    // Verifica se existem projetos após a filtragem
    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="error-message">
                <p>Nenhum projeto encontrado com o filtro "${filter}".</p>
            </div>
        `;
        return;
    }
    
    // Adiciona cada projeto ao container
    filteredProjects.forEach(project => {
        projectsContainer.appendChild(createProjectCard(project));
    });
}

// Função para criar o card de um projeto
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Cria tags para as linguagens
    const techTags = project.languages.slice(0, 3).map(lang => 
        `<span>${lang}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="project-content">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-meta">
                <span><i class="fas fa-star"></i> ${project.stars}</span>
                <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                <span><i class="fas fa-calendar-alt"></i> Atualizado em ${project.updated_at}</span>
            </div>
            <div class="project-links">
                <a href="${project.url}" target="_blank" class="github">
                    <i class="fab fa-github"></i> Repositório
                </a>
                ${project.homepage ? 
                  `<a href="${project.homepage}" target="_blank" class="demo">
                       <i class="fas fa-external-link-alt"></i> Demo
                   </a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Função para adicionar animações de revelação ao rolar
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Inicializa as animações de rolagem quando o script carrega
window.addEventListener('load', initScrollAnimations);