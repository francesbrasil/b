# site/ — página da Inbre

Esta pasta é o site institucional da Inbre (estúdio de edição de Reels). **Não tem relação com
o solver de estruturas** que ocupa o resto do repositório — `AGENTS.md` e `PROGRESS.md`
descrevem aquele projeto, não este.

## Arquivos

```
index.html      a página inteira: HTML + CSS + JS inline, sem framework e sem build
COPY.md         o texto como fonte de edição — mudou aqui, reflita no index.html
contraste.py    refaz a conta de contraste lendo as cores do próprio index.html
_headers        regras de cache do Cloudflare Pages
CONTEXTO.md     (ainda não existe) o porquê de cada decisão, para retomar o projeto
                em outra conversa
assets/         (ainda não existe) vídeos, capas, logo, favicon, imagem de preview
assets/fontes/  (ainda não existe) Instrument Serif (só o subconjunto latino) + a
                licença OFL
```

O que está marcado como "ainda não existe" é o que falta chegar na pasta. Sem
`assets/` a página abre e se lê inteira — a fonte cai para Georgia, o favicon e a capa
do vídeo não aparecem — mas não é isso que vai ao ar.

## Fonte

Os títulos usam **Instrument Serif**, hospedada aqui mesmo em `assets/fontes/`: duas
requisições, 41 KB somando romana e itálica, só o subconjunto latino (que já cobre todo o
português). `font-display: swap` garante que o texto apareça na hora, na fonte do sistema, e
troque quando a outra chegar — o título nunca fica invisível esperando. Georgia continua como
reserva, então se o arquivo não chegar a página não muda de forma, só de fonte.

Licença SIL Open Font 1.1, copiada em `assets/fontes/OFL.txt`. Se trocar de fonte, troque a
licença junto.

O corpo do texto segue na pilha do sistema, sem download. Trocar também o corpo dobraria o
peso para ganhar bem menos: quem lê num celular na rua repara no título, não no parágrafo.

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
- `--vermelho` no CSS → hex amostrado da logo (leia a seção abaixo antes de trocar)
- `assets/antes-depois.mp4` e `assets/antes-depois.jpg` → o vídeo comparativo e sua capa
- `https://inbre.com.br` nas metatags → domínio real
- `assets/og.jpg` e `assets/favicon.svg` → o cartão de preview e o ícone, exportados da logo

Trava seções específicas, não o site inteiro:

- entregas exatas de cada plano
- prints de depoimentos, com primeiro nome, @ e segmento
- segmentos anteriores à Inbre, na seção Sobre
- a grade de contato do fim: `[NÚMERO VISÍVEL]`, `@[INSTAGRAM]`, `[EMAIL]` e `[CNPJ]`
  (o CNPJ é opcional, mas é o item que mais pesa em quem veio checar se a Inbre é real;
  se não houver, apague a linha inteira em vez de deixar vazia). O markup está pronto,
  em comentário, no fim da seção de contato do `index.html` — é só descomentar e
  preencher.

## Ao trocar o vermelho pelo da logo

Existem quatro vermelhos no arquivo, declarados juntos no `:root`. A relação entre eles é o
que faz o botão continuar significando "clique aqui":

| token | onde vive | como é |
|---|---|---|
| `--vermelho` | só o botão de WhatsApp | nítido, saturado, chapado |
| `--vermelho-alto` | o mesmo botão, sob o ponteiro | o `--vermelho` **escurecido** |
| `--brasa-rgb` | atmosfera do fundo | alfa baixo, difuso, dessaturado |
| `--vinho-rgb` | queda da brasa na beirada | mais escuro ainda |

O hover escurece em vez de clarear, e isso não é gosto: o texto do botão é branco, então
clarear o fundo derruba o contraste justamente enquanto o ponteiro está em cima dele.
Derive `--vermelho-alto` do `--vermelho` escurecendo, nunca clareando.

Depois de colar o hex da logo em `--vermelho`, faça este teste: abra a página no celular,
role até o fim e olhe o botão e o fundo ao mesmo tempo. **Se der para dizer que são a mesma
cor, está errado.** O caso perigoso é a logo ter um vermelho escuro ou acinzentado — aí
escureça `--brasa-rgb` e `--vinho-rgb` na mesma medida, senão o botão para de saltar.

O fundo nunca deve virar borda, texto, ícone ou divisória. Vermelho fora de `.cta` é bug.

Um vermelho de logo que for escuro ou acinzentado também pode derrubar o contraste do
texto branco dentro do botão. Por isso o `contraste.py` confere o par: rode-o depois de
colar o hex e antes de publicar.

## Contraste

```bash
python3 site/contraste.py
```

O script lê as cores do próprio `index.html`, refaz a conta e sai com erro se alguma
combinação cair abaixo de 4,5:1. É ele que responde "ainda dá para publicar?" depois de
qualquer mexida em cor.

Pior caso hoje: **4,60:1**, acima do mínimo de 4,5 do WCAG AA. É o `--cinza-fraco` no
pico da aura, com as **duas** camadas do fundo somadas — a quente e a neutra que fica por
cima dela. Uma versão anterior desta conta só considerava a camada quente e por isso
publicava um número folgado demais (4,95:1); a folga real é de 2%, não de 10%.

Quem segura o número é o `--cinza-fraco`, que foi clareado de `#7A7A80` para `#8A8A90`
justamente por causa da atmosfera — o valor antigo dava 4,64:1 já sobre preto puro, sem
folga nenhuma.

Se você escurecer o texto secundário ou aumentar a intensidade da brasa, rode o script
antes de publicar. Com 2% de folga, quase nada aí é seguro no olho.

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
