# site/ — Inbre

Site da Inbre, estúdio de edição de Reels para nutricionistas e personal trainers.
Exportado do Hostinger Horizons e adaptado para rodar fora dele.

**Não tem relação com o solver de estruturas** que ocupa o resto do repositório — o
`AGENTS.md` e o `PROGRESS.md` da raiz descrevem aquele projeto, não este.

> Substituiu a versão anterior desta pasta, que era um único `index.html` estático
> publicado no Cloudflare Pages. Aquela página não tinha preço, formulário nem
> pagamento; esta tem os três, e por isso precisa de servidor. O histórico dela está
> no commit `f35b4e1`.

## Três aplicações

```
apps/web          React 18 + Vite 7 + Tailwind + shadcn/ui. A página em si.      :3000
apps/api          Express 5. Uma rota: cria a preferência de checkout do
                  Mercado Pago. O token nunca chega ao navegador.                :3001
apps/pocketbase   PocketBase 0.39.8. Guarda os pedidos de diagnóstico do
                  formulário, na coleção `diagnosticos`.                         :8090
```

O conteúdo da página vive quase todo em `apps/web/src/pages/HomePage.jsx` — textos,
os três planos e os preços estão em constantes no topo do arquivo.

## Rodar

```bash
cd site
cp apps/api/.env.example apps/api/.env     # e preencha o token
npm install
npm run dev                                # sobe as três de uma vez
```

Antes do primeiro `npm run dev` faltam duas coisas que **não estão no repositório**:

**1. O binário do PocketBase** (31 MB, ignorado pelo git). Baixe a versão `0.39.8`
para o seu sistema em <https://github.com/pocketbase/pocketbase/releases> e ponha o
executável em `apps/pocketbase/pocketbase`, com permissão de execução.

**2. O superusuário do PocketBase.** No primeiro boot uma migração cria a conta de
administrador e falha se estas duas variáveis não estiverem no ambiente — o erro que
aparece é `email: cannot be blank`, que não diz o que fazer:

```bash
export PB_SUPERUSER_EMAIL="voce@exemplo.com"
export PB_SUPERUSER_PASSWORD="uma-senha-longa"
```

Painel do PocketBase: <http://127.0.0.1:8090/_/> — é lá que os pedidos de diagnóstico
aparecem.

## O proxy `/hcgi`

O frontend chama `/hcgi/api` (a API) e `/hcgi/platform` (o PocketBase). Esses caminhos
não são inventados aqui: na hospedagem do Horizons existe um proxy de borda que os
mapeia. **Fora do Horizons eles não existem**, e sem alguém fazendo esse papel o
formulário e o botão "Contratar plano" respondem 404 — a página mostra só "tente
novamente em alguns instantes", que não ajuda ninguém a descobrir o motivo.

Em desenvolvimento, quem resolve é o `server.proxy` do `apps/web/vite.config.js`, que
foi acrescentado aqui. **Em produção você precisa reproduzir o mesmo mapeamento** no
servidor da frente:

```
/hcgi/api/*        →  http://127.0.0.1:3001/*     (remover o prefixo /hcgi/api)
/hcgi/platform/*   →  http://127.0.0.1:8090/*     (remover o prefixo /hcgi/platform)
```

Sem isso o site sobe, aparece bonito e não recebe um único lead.

## Pagamentos — leia antes de cobrar de verdade

O token em `apps/api/.env` hoje começa com `TEST-`. Um token de teste só abre o
checkout de sandbox: **nenhum pagamento real é cobrado**.

Trocar o token não basta. Em `apps/api/src/routes/mercadopago-checkout.js` a URL de
checkout é escolhida assim:

```js
const checkoutUrl = data.sandbox_init_point || data.init_point;
```

O Mercado Pago devolve os **dois** campos, inclusive com credenciais de produção. Como
`sandbox_init_point` vem primeiro, com um token de produção o comprador continuaria
sendo mandado para o sandbox, e a venda não acontece — sem erro nenhum na tela. Ao ir
para produção, inverta a ordem ou escolha pelo tipo do token.

Os preços vivem em dois lugares e precisam bater: nos cards em `HomePage.jsx` (o que a
pessoa lê) e no catálogo `PLANS` do `mercadopago-checkout.js` (o que é cobrado). O
frontend manda só o id do plano, nunca o valor, então ninguém consegue adulterar o
preço pelo navegador — mas se os dois arquivos divergirem, a página mostra um valor e a
cobrança sai outro.

## Produção

```bash
npm run build     # gera site/dist/apps/web
npm start         # sobe a API e o PocketBase
```

Sirva `dist/apps/web` como estático, com o proxy `/hcgi` da seção acima na frente.
É um SPA de rota única: aponte qualquer 404 de volta para o `index.html`.

**Defina `NODE_ENV=production`.** Nem o script `start` nem o `.env.example` fazem isso
por você, e sem essa variável o middleware de erro da API devolve o stack trace e o
caminho absoluto dos arquivos no corpo da resposta HTTP.

## O que fica de fora do repositório

O `.gitignore` cobre, e cada um tem um motivo:

- `apps/api/.env` — tem o token do Mercado Pago
- `apps/pocketbase/pocketbase` — binário de 31 MB, baixado por versão
- `apps/pocketbase/pb_data/` — o banco, com os leads do formulário e o superusuário
- `node_modules/`, `dist/`

O `pb_data` que veio no zip do Horizons **não está aqui e não está no git**. Se ele tem
leads reais, guarde uma cópia antes que o zip suma: é a única.

## Pendências

- **Imagens em CDN de terceiro.** A logo e as três fotos são URLs em
  `horizons-cdn.hostinger.com` e `images.hostinger.com`, fixas no `HomePage.jsx`. Se a
  conta do Horizons for encerrada, o site fica sem logo e sem foto. Baixe os arquivos
  para `apps/web/public/` e troque os caminhos.
- **Sem `og:image`.** O `<Seo>` é chamado sem `image` no `HomePage.jsx`, então o cartão
  de link do WhatsApp sai sem imagem — e ele é a primeira coisa que a pessoa vê, antes
  do site.
- **Sem favicon.** A referência apontava para `/vite.svg`, que não existe em `public/`;
  foi removida. Falta exportar um ícone da logo.
- **Voz mista na seção Sobre.** O texto alterna entre primeira pessoa ("Comecei em
  2022", "passei a editar") e a empresa ("acompanhamos", "a Inbre é a resposta"). O
  resto da página fala sempre como empresa.
