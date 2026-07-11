# Otimização de tokens — desenvolvimento e produto

## Parte A — Durante o desenvolvimento (Claude Code / Codex)

O que consome seu plano é CONTEXTO (tudo que o agente lê) + SAÍDA (tudo que ele escreve).
As regras abaixo já estão resumidas no AGENTS.md; aqui está o porquê e o como.

1. **Uma tarefa por sessão.** Sessões longas acumulam contexto morto que é reenviado a
   cada mensagem. Terminou a tarefa → atualizou PROGRESS.md → commit → nova sessão limpa
   (`/clear` no Claude Code). Se a sessão crescer no meio de algo, use `/compact`.
2. **Arquivos pequenos = leituras baratas.** Módulos de até ~300 linhas. O agente lê o
   arquivo inteiro para editá-lo; um arquivo de 2.000 linhas custa 7x mais por edição.
3. **Testes como olhos.** "Rode `pytest -q` e me diga o que falhou" custa ~100 tokens.
   "Leia o solver inteiro e verifique se está certo" custa 10.000. O golden dataset
   existe exatamente para isso.
4. **Não despeje dados no chat.** O golden dataset vive em arquivos; referencie por
   caminho ("abra dados/golden/05...") em vez de colar JSON na conversa.
5. **Plano antes de código.** Peça um plano curto em texto, aprove, e só então mande
   implementar. Refazer implementação errada é o maior desperdício de tokens que existe.
6. **Edições pontuais, não reescritas.** Peça diffs/trechos. Proíba "reescreva o arquivo".
7. **AGENTS.md enxuto.** Ele é lido em toda sessão — cada linha ali custa para sempre.
   Detalhes longos moram em docs/ e são lidos sob demanda.
8. **Revezamento Claude Code ↔ Codex:** commit → PROGRESS.md → troca (ver protocolo no
   AGENTS.md). Handoff bem feito evita a re-explicação, que é puro token queimado.

## Parte B — No produto (API, a partir da semana 3)

Metas de custo por operação (modelo classe Haiku, preços de jul/2026: ~US$1/M entrada,
US$5/M saída — reverificar sempre):

| Operação | Alvo |
|---|---|
| Resolução completa (camadas 1+3) | ≤ US$ 0,015 |
| Pergunta de acompanhamento | ≤ US$ 0,006 |
| Usuário pesado/mês (40 res + 80 perguntas) | ≤ US$ 1,00 |

Alavancas obrigatórias de implementação:
1. **Instrumentação desde a 1ª chamada:** gravar `input_tokens`, `output_tokens`, modelo
   e custo estimado por requisição no banco. Sem medir, não há otimização.
2. **Prompt caching:** prompt de sistema + convenções marcados como cacheáveis
   (leitura de cache ≈ 10% do preço de entrada).
3. **Cache de explicações por hash do rastro:** mesmo modelo estrutural → mesmo rastro →
   mesma explicação. Chave: hash(JSON canônico do rastro). Exercícios de livro repetem
   MUITO entre alunos → custo marginal tende a zero com escala.
4. **Batch API (−50%)** para pré-gerar explicações da biblioteca (golden dataset) fora
   do horário de pico.
5. **Roteamento de modelo:** narração padrão em modelo leve; escalar para modelo médio
   apenas no chat de dúvidas se a avaliação mostrar ganho real de qualidade.
6. **Teto de perguntas por resolução** (10–15) + contexto do chat enxuto (enviar rastro
   + últimas N trocas, não a conversa inteira).
7. **Caminho sem IA é grátis:** entrada pelo editor gráfico pula a Camada 1; diagramas e
   valores renderizam direto do solver. IA só entra quando agrega.
