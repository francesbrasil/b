# site/ — página da Inbre

Esta pasta é o site institucional da Inbre (estúdio de edição de Reels). **Não tem relação com
o solver de estruturas** que ocupa o resto do repositório — `AGENTS.md` e `PROGRESS.md`
descrevem aquele projeto, não este.

## Arquivos

```
index.html   a página inteira: HTML + CSS + JS inline, sem framework e sem build
COPY.md      o texto como fonte de edição — mudou aqui, reflita no index.html
_headers     regras de cache do Cloudflare Pages
assets/      vídeos, capas, logo, favicon, imagem de preview
```

## Rodar localmente

```bash
python3 -m http.server 8000 --directory site
# abrir http://localhost:8000
```

## Publicar (Cloudflare Pages)

Conecte o repositório e configure:

- **Build command:** vazio
- **Build output directory:** `site`
- **Framework preset:** None

## Antes de publicar — o que ainda falta preencher

Tudo que falta está marcado com `TODO:` no `index.html`. Para listar:

```bash
grep -n "TODO:" site/index.html
```

Trava a publicação:

- `55DDDNUMERO` → número de WhatsApp comercial (55 + DDD + número, só dígitos)
- `[MÊS/ANO]` → quando a Inbre nasceu
- `--vermelho` no CSS → hex amostrado da logo (leia a seção abaixo antes de trocar)
- `assets/antes-depois.mp4` e `assets/antes-depois.jpg` → o vídeo comparativo e sua capa
- `https://inbre.com.br` nas metatags → domínio real

## Ao trocar o vermelho pelo da logo

Existem três vermelhos no arquivo, declarados juntos no `:root`. A relação entre eles é o
que faz o botão continuar significando "clique aqui":

| token | onde vive | como é |
|---|---|---|
| `--vermelho` | só o botão de WhatsApp | nítido, saturado, chapado |
| `--brasa-rgb` | atmosfera do fundo | alfa baixo, difuso, dessaturado |
| `--vinho-rgb` | queda da brasa na beirada | mais escuro ainda |

Depois de colar o hex da logo em `--vermelho`, faça este teste: abra a página no celular,
role até o fim e olhe o botão e o fundo ao mesmo tempo. **Se der para dizer que são a mesma
cor, está errado.** O caso perigoso é a logo ter um vermelho escuro ou acinzentado — aí
escureça `--brasa-rgb` e `--vinho-rgb` na mesma medida, senão o botão para de saltar.

O fundo nunca deve virar borda, texto, ícone ou divisória. Vermelho fora de `.cta` é bug.

## Contraste

Medido sobre a atmosfera quente, no ponto mais claro da página: pior caso **4,69:1**, acima
do mínimo de 4,5 do WCAG AA. Quem segura esse número é o `--cinza-fraco`, que foi clareado de
`#7A7A80` para `#8A8A90` justamente por causa da atmosfera — o valor antigo dava 4,64:1 já
sobre preto puro, sem folga nenhuma.

Se você escurecer o texto secundário ou aumentar a intensidade da brasa, refaça a conta antes
de publicar.

Trava seções específicas, não o site inteiro:

- entregas exatas de cada plano
- prints de depoimentos, com primeiro nome, @ e segmento
- segmentos anteriores à Inbre, na seção Sobre
- a grade de contato do fim: `[NÚMERO VISÍVEL]`, `@[INSTAGRAM]`, `[EMAIL]` e `[CNPJ]`
  (o CNPJ é opcional, mas é o item que mais pesa em quem veio checar se a Inbre é real;
  se não houver, apague a linha inteira em vez de deixar vazia)

## Como adicionar depoimentos

O `index.html` traz, dentro de cada seção, um bloco em comentário com o markup pronto de um
card preenchido. Copie o comentário, cole no lugar de um espaço vazio e troque os valores.

## Vídeos

Formato: MP4 (H.264 + AAC), vertical 1080×1920. Alvo abaixo de 4 MB no antes/depois.

```bash
ffmpeg -i entrada.mov -vf "scale=1080:1920" -c:v libx264 -crf 26 -preset slow \
       -c:a aac -b:a 96k -movflags +faststart site/assets/antes-depois.mp4

# capa a partir do primeiro segundo
ffmpeg -i site/assets/antes-depois.mp4 -ss 1 -frames:v 1 -q:v 4 site/assets/antes-depois.jpg
```

Nenhum byte de vídeo é baixado no carregamento da página: o `<video>` nasce sem `src` e só
recebe o arquivo no primeiro toque no play.
