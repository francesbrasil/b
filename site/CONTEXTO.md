# Contexto do site da Inbre — para retomar em outra conversa

Cole este arquivo inteiro no começo de uma conversa nova. Ele tem o que foi decidido, por que
foi decidido, e o que ainda falta. O `index.html` é a entrega; este arquivo é a memória.

---

## 1. O que é

A Inbre é um **estúdio individual de edição de Reels para nutricionistas e personal trainers**.
Uma pessoa só — eu. A marca nasceu em **junho de 2026**; o ofício é de **2022**, editando vídeo
para clientes de diversos segmentos, dentro e fora do nicho.

O site vive em `site/`, dentro do repositório `francesbrasil/b`. **O resto do repositório é um
solver de estruturas em Python e não tem nenhuma relação com o site** — `AGENTS.md` e
`PROGRESS.md` na raiz descrevem aquele projeto, não este. Não misture os dois.

Branch de trabalho: `claude/inbre-studio-website-nv34up`.

## 2. Quem visita e por quê — isto decide tudo

Praticamente todo o tráfego vem de **prospecção fria por WhatsApp**. A pessoa já recebeu a
mensagem e abre o link **no celular** para checar se aquilo existe e é sério. Não é landing page
de tráfego pago: é uma **checagem de credibilidade de trinta segundos**.

Sucesso = a pessoa voltar para o WhatsApp e responder.

Duas consequências que organizam o site inteiro:

- **A prova vem antes do argumento.** O vídeo antes/depois fica logo abaixo do hero, porque é a
  única coisa que prova competência em cinco segundos.
- **O link chega pelo WhatsApp.** O cartão de preview (og:title, og:description, og:image) é a
  primeira coisa que a pessoa vê, antes do site. Faz parte da entrega.

## 3. Posicionamento — a regra que mais se quebra sozinha

O argumento **nunca** é "seu vídeo é ruim". É sempre **"seu conteúdo é bom e a entrega técnica
está abaixo dele"**. Já corrigi o texto duas vezes por ele ter escorregado para crítica ao
cliente; é o erro mais fácil de cometer aqui.

Junto disso vem o argumento das horas: montar um Reels toma tempo do atendimento, da gravação e
do descanso, e esse tempo volta.

"A Inbre é nova, eu não sou." O diagnóstico gratuito é **demonstração de confiança, não pedido
de chance**.

**Detalhe que já foi corrigido e não pode voltar:** no diagnóstico **o cliente não envia nada**.
A Inbre olha o perfil público, grava um vídeo com o diagnóstico e edita um trecho de um Reels
que a pessoa **já publicou**. Não pedir arquivo é a parte mais forte da oferta.

## 4. Tom de voz

- **Terceira pessoa, sem exceção**: "a Inbre edita", nunca "eu edito" nem "nós". É uma pessoa só,
  então "vocês" está errado; e quem aparece na página é a empresa, então nenhuma seção é assinada.
- Profissional-acessível, direto, cordial.
- **Sem exclamação. Sem gíria. Sem vocabulário de agência** — nada de "alavancar", "escalar",
  "engajamento orgânico", "soluções", "parceria estratégica".
- **Sem promessa de número e sem estatística solta.** Regra literal: *se eu não te der o dado,
  ele não entra no texto.* Nada de depoimento, métrica, logo de cliente ou porcentagem
  inventada — nem como exemplo, nem como placeholder que pareça real.
- **Sem travessão** (—) no texto de leitura. Ordem de preferência ao remover: ponto final >
  dois-pontos > parênteses > reescrever a frase. **Vírgula é a última opção.** Hífen de palavra
  composta, nome de classe CSS e comentário de código continuam normais.
- Títulos em dois tons: a primeira frase afirma, a segunda vira em itálico.

## 5. Identidade visual

Tema escuro: quase-preto, carvão, texto branco. **O vermelho é exclusivo dos CTAs de WhatsApp.**
Nenhum título, ícone, borda, número ou elemento de fundo pode usar a cor do botão — no momento em
que o vermelho significa duas coisas, ele para de significar "clique aqui".

Um acento de cor só na página: `--areia` (#E6D7C3), nos títulos em itálico. Uma tentativa de
pastéis verde e azul foi revertida a pedido.

**Fonte:** Instrument Serif nos títulos, antetítulos e números, auto-hospedada em
`assets/fontes/` (2 requisições, 42 KB, só o subconjunto latino, licença OFL copiada junto). O
corpo segue na pilha do sistema, sem download. `font-display: swap`.

Os antetítulos de seção são **antetítulo de revista**: serif itálico, caixa normal. Não podem
voltar a ser monoespaçado + caixa alta + entreletra aberta — essas três coisas juntas são o
antetítulo padrão de template e foi exatamente o que me incomodou.

**Atmosfera de fundo:** dois halos radiais quentes, faixa #4A0F0A–#8C1D12, alfa baixo e difuso,
esquentando conforme o conteúdo (topo quente, meio frio, fim o mais quente). Critério de
aceitação: *se alguém puder apontar para o fundo e para o botão e dizer "é o mesmo vermelho",
está errado.* Nunca tem contorno, borda, forma reconhecível nem anel visível — é luz, não objeto.
Nunca há halo quente diretamente atrás de um CTA. O resultado não pode parecer alerta ou erro de
sistema.

O piso de opacidade 0.28 da brasa **não é estética, é limite de 8 bits**: abaixo disso o gradiente
renderiza em degraus visíveis (medi platôs de 100–130px). O meio da página esfria **por matiz**,
subindo o halo frio, não apagando o quente. Se mexer nisso, meça o banding de novo.

## 6. Regras técnicas

- **HTML + CSS + JS num arquivo só.** Sem framework, sem build, sem dependência.
- **Zero biblioteca de movimento.** Sem GSAP, AOS, Lenis, particles, Framer. Só CSS e JS nativo.
  Nenhum byte a mais de download.
- **Só `transform` e `opacity`** nas animações — alvo é celular antigo. Sem `filter: blur()` em
  elemento grande, sem `backdrop-filter` novo, sem canvas, sem WebGL.
- `prefers-reduced-motion` respeitado em tudo.
- **Degradação sem JS:** nada nasce com `opacity: 0` no CSS. A classe que esconde é aplicada pelo
  JS, então sem JS a página aparece inteira.
- **O vídeo não trava a primeira renderização.** O `<video>` nasce **sem `src`** e só baixa no
  primeiro toque, com `preload="none"` como segunda linha. **Não mude isso.**
- Menu de atalhos horizontal no topo. **Nada de hambúrguer** — hambúrguer esconde tudo atrás de um
  toque e traz estado, foco preso e mais JS; custo alto demais para uma visita de 30 segundos.
- Área de toque de 44px, `:focus-visible` visível, FAQ em `<details>/<summary>` (abre sem JS),
  uma `<h1>` só, `lang="pt-BR"`, `alt` real em todo print.
- Contraste mínimo 4,5:1 medido **sobre a atmosfera**, no ponto mais claro. Pior caso hoje:
  **4,69:1**. Quem segura esse número é `--cinza-fraco` (#8A8A90). Se escurecer texto secundário
  ou intensificar a brasa, refaça a conta.
- Deploy: Cloudflare Pages, build command vazio, output directory `site`.

## 7. Como o trabalho é verificado

Nada aqui é aprovado no olho. Não há Playwright instalado; a verificação usa **CDP direto**, com
o `WebSocket` nativo do Node 22, contra um Chromium headless na porta 9222 e um
`python3 -m http.server 8321 --directory site`.

Armadilhas que já custaram tempo e vão custar de novo:

- `--window-size` do headless **não afeta o layout**. Use `Emulation.setDeviceMetricsOverride`.
- `captureBeyondViewport` devolve quadro preto, porque a camada de reveal mantém o conteúdo
  fora da tela em `opacity: 0`. Role de verdade.
- Rolagem suave falsifica medição de âncora. Force `scrollBehavior = 'auto'` antes de medir.
- `Runtime.evaluate` devolve `{}` para IIFE assíncrona sem `awaitPromise: true`.
- Ao amostrar cor de fundo, **exclua as caixas dos CTAs** (+6px): a borda antialiasada do botão
  vermelho já me deu uma temperatura falsa de 61,5 onde a real era 26,5.

A bateria que roda antes de cada commit: 360/390/820/1280 sem rolagem horizontal, nenhum elemento
preso em `opacity: 0` depois de rolar a página toda, uma `h1` só, zero vermelho fora de `.cta`,
atalhos do menu com todos os alvos existentes, alvos de toque de 44px e **zero byte de mp4 antes
do toque no play**. Mais duas passadas: `prefers-reduced-motion` e JS desligado.

Exceção conhecida e proposital: o link "pular para o conteúdo" tem 27px. Ele só existe para
teclado, aparece no foco e nunca é alvo de toque.

## 8. Estado atual

```
site/index.html   a página inteira, ~61 KB
site/COPY.md      o texto como fonte de edição — mudou lá, reflita aqui, e vice-versa
site/README.md    checklist de publicação, troca do vermelho, nota de contraste, fontes
site/CONTEXTO.md  este arquivo
site/_headers     cache do Cloudflare
site/assets/fontes/   Instrument Serif latino + OFL
site/assets/depoimentos/   vazio, esperando os prints
```

Seções, na ordem: hero → faixa de credibilidade → Demonstração (vídeo antes/depois) → A edição
(3 pilares, 10 pontos) → Depoimentos → Processo (4 passos) → O plano mensal → Sobre o estúdio →
Perguntas frequentes → Contato.

Decisões de conteúdo já tomadas, para não serem refeitas: o **portfólio foi removido**, ficaram só
os depoimentos. As **três faixas de plano saíram** — existe um plano só, montado no volume que o
cliente escolhe, e o orçamento é feito caso a caso por mim. A **grade de contato do fim**
(telefone, e-mail, Instagram, CNPJ) foi removida. Duas perguntas do FAQ sobre roteiro saíram,
porque **o serviço é editar o material que a pessoa já gravou** — roteiro, calendário e direção de
gravação não estão no escopo. O gancho fica na lista, porque é decidido no corte de abertura.

## 9. O que falta — e que ninguém deve inventar

**Trava a publicação:**

| item | onde |
|---|---|
| WhatsApp comercial (55 + DDD + número, só dígitos) | `55DDDNUMERO`, em 5 links `wa.me` |
| hex do vermelho amostrado da logo | `--vermelho` no `:root` |
| vídeo antes/depois + capa | `assets/antes-depois.mp4` e `.jpg` |
| domínio real | `https://inbre.com.br` nas metatags, 3 ocorrências |
| cartão de preview 1200×630 | `assets/og.jpg` |
| favicon | `assets/favicon.svg` |

**Trava seções específicas, não o site inteiro:** prints de depoimentos (com primeiro nome, @ e
segmento, e transcrição no `alt`); de quem é a peça do antes/depois; e se a pessoa pode publicar o
antes/depois que recebe no diagnóstico.

**Ao trocar o vermelho:** existem três vermelhos declarados juntos no `:root` — `--vermelho` (só o
botão, nítido e chapado), `--brasa-rgb` (atmosfera, alfa baixo e dessaturado) e `--vinho-rgb` (a
queda da brasa na beirada). Se a logo tiver um vermelho escuro ou acinzentado, escureça os dois
últimos na mesma medida, senão o botão para de saltar.

**Aberto, que eu ainda não respondi:** trocar "4 anos" por "desde 2022" na faixa e no Sobre, para
o texto não envelhecer sozinho; se os riscos de marcador das listas (`.pilar li::before`,
`.plano li::before`) também saem; e se vale baixar uma fonte para o corpo do texto.

## 10. Como trabalhar comigo neste projeto

Comece pela arquitetura e pelo texto, não pelo código. Se faltar informação para escrever alguma
seção, **pergunte antes de inventar** — principalmente qualquer coisa que pareça prova social.
Quando um pedido meu bater de frente com uma regra acima, **diga isso e proponha a alternativa
que cabe**, em vez de atropelar a regra em silêncio. E meça antes de afirmar que algo funciona.
