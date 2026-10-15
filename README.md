# Jackion Systems

Landing page da Jackion Systems, com apresentação de serviços, exemplos de soluções e formulário para preparar um briefing de projeto.

**Site publicado:** https://jackion-profissional.hiagomrossi.chatgpt.site

## Executar localmente

O projeto usa HTML, CSS e JavaScript e dispensa instalação de dependências ou etapa de build.

```bash
git clone https://github.com/HiagoMRossi/jackion-systems.git
cd jackion-systems
python -m http.server 8000
```

Acesse http://localhost:8000. No Windows, também é possível usar `py -m http.server 8000`.

## Configurar o contato comercial

Edite `config.js` com o WhatsApp comercial no formato internacional, somente com números, e/ou o e-mail comercial confirmado. Os campos estão vazios na versão importada.

O formulário prepara um briefing no navegador e permite copiar ou baixar o texto. Quando há contato configurado, o compartilhamento abre o WhatsApp ou o aplicativo de e-mail para o visitante concluir o envio.

## Arquivos principais

- `index.html`: conteúdo e estrutura da página.
- `styles.css` e `business.css`: estilos e adaptações para diferentes telas.
- `app.js`: navegação, diálogos e preparação do briefing.
- `config.js`: configuração pública de contato.
- `assets/`: ícones, imagem social e fontes locais.

## Origem desta cópia

Os arquivos estáticos foram recuperados da versão pública do site em 15 de outubro de 2026. Foi removido do HTML apenas o script de infraestrutura injetado pela hospedagem. Esta cópia não depende desse script para funcionar.

## Fontes de terceiros

Manrope e Space Grotesk são distribuídas sob a SIL Open Font License 1.1. Os respectivos avisos de copyright e textos das licenças estão em `assets/licenses/`.
