# PROGRESS.md — bastão de revezamento entre sessões/ferramentas

> Atualize este arquivo ao FIM de toda sessão de trabalho (humano ou IA).

## Estado atual
- Solver de REAÇÕES de vigas isostáticas funcionando (incl. balanço, Gerber, cargas
  concentradas/distribuídas/momentos). 30 casos golden, 31/31 testes passando.
- Detecção pedagógica de hiperestática/hipostática implementada.
- Rastro de passos completo (identificação → validação → cargas → equilíbrio → verificação).

## Feito na última sessão
- Golden ampliado de 6 → 30 casos (07–30): balanços à esquerda/direita/duplo, Gerber
  com 1 e 2 rótulas, trapezoidais/triangulares, momentos puros e múltiplos, cargas
  horizontais, engaste à direita, casos com uplift (reação negativa).
- Gabaritos calculados à mão (conta documentada no campo "conferencia_manual" de cada
  JSON) e conferidos por um verificador independente (numpy, fora do src/solver) antes
  do pytest — tripla concordância em todos.

## Próxima tarefa (em ordem)
1. Iniciar `src/solver/esforcos.py`: funções N(x), V(x), M(x) por trecho com sympy.Piecewise,
   registrando cada trecho no rastro. Testar contra valores notáveis dos livros.
   (Definir junto o formato do passo de "seccionamento" no rastro — decisão pendente.)

## Bugs conhecidos
- Nenhum.

## Decisões pendentes
- Nome do produto.
- Formato exato do passo de "seccionamento" no rastro (definir junto com esforcos.py).
