# Solver de Estruturas — Kit de Partida (Fase 1)

Motor determinístico que resolve estruturas isostáticas gerando um **rastro de passos**
pedagógico, que uma camada de IA narra para o aluno. Ver `AGENTS.md` (convenções) e
`PROGRESS.md` (estado atual).

**Status:** reações de vigas isostáticas funcionando (balanço, Gerber, cargas
concentradas/distribuídas/momentos) — 7/7 testes verdes no golden dataset.

## Dia 1 — setup (15 minutos)

```bash
# 1. Python 3.11+ e Git instalados? Então:
git init && git add . && git commit -m "kit de partida"

# 2. Ambiente virtual + dependências
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 3. Veja o motor funcionando
python scripts/resolver_exemplo.py
python scripts/resolver_exemplo.py dados/golden/04_viga_com_balanco.json

# 4. Rode a suíte de testes (deve dar 7 passed)
pytest -v
```

## Trabalhando com Claude Code

Abra o Claude Code na pasta do projeto. Ele lê `CLAUDE.md` → `AGENTS.md` → `PROGRESS.md`
automaticamente quando instruído. Primeiro prompt sugerido:

> Leia AGENTS.md e PROGRESS.md. Antes de codar, me proponha um plano curto para a
> tarefa 1 do PROGRESS.md (ampliar o golden dataset de reações para 30+ casos).
> Lembre: gabaritos são conferidos à mão, nunca gerados pelo próprio solver.

Protocolo de fim de sessão (sempre): rodar `pytest -q` → atualizar `PROGRESS.md` →
`git commit`. Trocando para outro agente (Codex etc.): mesmo protocolo — ele lê os
mesmos arquivos e continua de onde parou.

## Estrutura

```
src/solver/    modelo.py (schema) · rastro.py (passos) · reacoes.py (motor)
dados/golden/  exercícios com gabarito conferido à mão = fonte de verdade
tests/         pytest parametrizado sobre o golden (nada entra se quebrar)
scripts/       resolver_exemplo.py — demo de linha de comando
docs/          convencoes.md (leis de engenharia) · otimizacao-tokens.md
```

## Regras que não se negociam

1. **O LLM nunca calcula.** Todo número nasce no solver e viaja pelo rastro.
2. **Golden dataset é a verdade.** Gabarito conferido à mão; teste quebrou = não entra.
3. **Rastro completo.** Toda decisão do solver registra o quê + o porquê.
