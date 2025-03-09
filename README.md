# Portfólio Pessoal

Este é um portfólio pessoal desenvolvido com HTML, CSS e JavaScript, com integração à API do GitHub para exibir automaticamente os repositórios.

## Estrutura do Projeto

```
portfolio/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── main.js         # JavaScript para funcionalidades
├── images/
│   └── profile.jpg     # Sua foto e outras imagens
└── README.md           # Documentação
```

## Funcionalidades

- Design responsivo para todos os dispositivos
- Menu de navegação com rolagem suave
- Integração com a API do GitHub para exibir repositórios
- Seções organizadas para informações pessoais, habilidades, educação, certificados e projetos
- Links para redes sociais e contato

## Como Usar

1. Clone este repositório: `git clone https://github.com/plajiw/portfolio.git`
2. Substitua a imagem `profile.jpg` na pasta `images` pela sua foto
3. Edite o arquivo `index.html` para atualizar suas informações pessoais
4. Personalize o estilo no arquivo `style.css` conforme necessário
5. Ajuste as configurações de integração do GitHub no arquivo `main.js`
6. Publique seu site usando GitHub Pages ou qualquer outro serviço de hospedagem

## Personalização

### Para adicionar novos certificados:

Adicione novos blocos de certificado na seção de certificados do arquivo `index.html`:

```html
<div class="certificate-item">
    <div class="certificate-icon">
        <i class="fas fa-certificate"></i>
    </div>
    <div class="certificate-info">
        <h3>Nome do Certificado</h3>
        <p class="institution">Instituição</p>
        <p class="date">Data</p>
    </div>
</div>
```

### Para modificar suas habilidades:

Edite as barras de habilidades na seção de habilidades do arquivo `index.html`:

```html
<div class="skill-item">
    <div class="skill-name">Nome da Habilidade</div>
    <div class="skill-bar">
        <div class="skill-level" style="width: 75%"></div>
    </div>
</div>
```

## Recursos Utilizados

- [Font Awesome](https://fontawesome.com/) - Para ícones
- [Google Fonts](https://fonts.google.com/) - Fontes Roboto e Poppins
- [GitHub API](https://docs.github.com/en/rest) - Para integração de