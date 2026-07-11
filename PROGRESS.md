# PROGRESS.md — bastão de revezamento entre sessões/ferramentas

> Atualize este arquivo ao FIM de toda sessão de trabalho (humano ou IA).

## Estado atual
- Solver de REAÇÕES de vigas isostáticas funcionando (incl. balanço, Gerber, cargas
  concentradas/distribuídas/momentos). 7/7 testes passando no golden dataset.
- Detecção pedagógica de hiperestática/hipostática implementada.
- Rastro de passos completo (identificação → validação → cargas → equilíbrio → verificação).

## Feito na última sessão
- Kit inicial criado: modelo.py, rastro.py, reacoes.py, 6 casos golden, testes, script demo.

## Próxima tarefa (em ordem)
1. Ampliar golden dataset para 30+ casos de REAÇÕES (variar: balanços dos dois lados,
   Gerber com 2 rótulas, trapezoidais, momentos múltiplos). Gabaritos conferidos à mão.
2. Iniciar `src/solver/esforcos.py`: funções N(x), V(x), M(x) por trecho com sympy.Piecewise,
   registrando cada trecho no rastro. Testar contra valores notáveis dos livros.

## Bugs conhecidos
- Nenhum.

## Decisões pendentes
- Nome do produto.
- Formato exato do passo de "seccionamento" no rastro (definir junto com esforcos.py).
