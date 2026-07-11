# AGENTS.md — Fonte única de convenções (leia antes de qualquer tarefa)

## O projeto em 3 linhas
Plataforma que resolve e EXPLICA exercícios de estruturas para estudantes de engenharia.
Arquitetura "sanduíche": IA interpreta o enunciado → solver determinístico calcula → IA narra.
**Regra de ouro: LLM NUNCA calcula. Todo número vem do solver, registrado no rastro de passos.**

## Estado e fluxo de trabalho
1. No INÍCIO de toda sessão: leia `PROGRESS.md` (estado atual e próxima tarefa).
2. No FIM de toda sessão: atualize `PROGRESS.md` e faça commit pequeno com mensagem clara.
3. Nada entra no código se algum teste do golden dataset quebrar (`pytest`).
4. Novo caso no golden = gabarito conferido À MÃO antes (nunca gerado pelo próprio solver).

## Arquitetura de pastas
- `src/solver/` — motor determinístico (modelo.py, rastro.py, reacoes.py; futuro: esforcos.py, trelicas.py)
- `src/ia/` — camadas 1 e 3 (criar na semana 3; prompts em arquivos .md versionados)
- `dados/golden/` — exercícios com gabarito = suíte de testes = fonte de verdade
- `tests/` — pytest parametrizado sobre o golden
- `scripts/` — utilitários de linha de comando
- `docs/` — convenções de engenharia e decisões

## Convenções de engenharia (resumo — detalhes em docs/convencoes.md)
- Viga no eixo x; y para cima; cargas para baixo são NEGATIVAS (fy=-20).
- Momentos anti-horários POSITIVOS nas equações de equilíbrio.
- Diagrama de momento fletor: traçado do LADO TRACIONADO (convenção brasileira/Süssekind).
- Unidades internas fixas: kN, m, kN·m. Conversões acontecem na borda (camada 1/UI).
- Nomes de reações: `R_{no}_{x|y}` e `M_{no}` (ex.: R_A_y, M_A).

## Convenções de código
- Python 3.12, pydantic v2, sympy. Nomes de domínio em PORTUGUÊS (No, Apoio, Carga, Rastro).
- Arquivos com no máximo ~300 linhas; se passar, dividir módulo.
- Toda função do solver que decide algo ADICIONA um passo ao rastro com `justificativa` (o porquê).
- Erros de engenharia (hiperestática, instável) = mensagens pedagógicas, nunca stacktrace cru.
- Type hints em tudo; docstring curta em toda função pública.

## Economia de tokens (obrigatório para os agentes de código)
- NÃO leia `dados/golden/*.json` em massa; abra só o caso citado na tarefa.
- NÃO reescreva arquivos inteiros; faça edições pontuais (diffs).
- Rode `pytest -q` para verificar em vez de reler código extenso.
- Uma tarefa por sessão. Terminou = atualize PROGRESS.md e pare.
- Planeje em texto ANTES de editar (plano curto → aprovação → implementação).

## Roadmap imediato (detalhe em PROGRESS.md)
Semana 1: reações ✅ → ampliar golden p/ 30+ casos de vigas
Semana 2: esforcos.py — N(x), V(x), M(x) por trechos + pontos notáveis + diagramas
Semana 3: trelicas.py (método dos nós) + src/ia/ (camada 3 com auditoria de números)
Semana 4: app Streamlit + camada 1 (texto→JSON) + beta com colegas
