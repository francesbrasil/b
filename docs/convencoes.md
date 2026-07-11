# Convenções de sinais e de resolução (documento normativo do produto)

> Este é o documento nº 1 da base de conhecimento (ver especificação da Fase 1).
> Tudo aqui é LEI para o solver e para os prompts das camadas de IA.
> Itens marcados [DECIDIR] devem ser fechados por você nas primeiras semanas.

## 1. Sistema de referência
- Viga reta ao longo do eixo **x**; eixo **y** para cima.
- Cargas verticais para baixo têm sinal **negativo** na entrada (ex.: `fy = -20`).
- Momentos aplicados: **anti-horário positivo** (regra da mão direita).

## 2. Reações (equilíbrio)
- Incógnitas sempre arbitradas no sentido positivo dos eixos (R_y para cima, M anti-horário).
- Resultado negativo NÃO é erro: significa sentido contrário ao arbitrado — a explicação
  deve sempre traduzir ("R_A_y = -3 kN → 3 kN para baixo").
- Polo do somatório de momentos: por padrão, o primeiro apoio (elimina as reações dele).
  A justificativa da escolha SEMPRE aparece no rastro.

## 3. Esforços internos (para a semana 2 — esforcos.py)
- **Normal N**: tração positiva.
- **Cortante V**: positivo quando o par de forças tende a girar o trecho no sentido horário.
- **Momento fletor M**: positivo quando traciona as fibras INFERIORES.
- **Diagrama de M: traçado do lado das fibras tracionadas** (convenção brasileira /
  Süssekind). Positivo desenhado PARA BAIXO do eixo. [Toggle "modo Hibbeler" fica para depois.]
- Relações diferenciais (com q positivo para cima): dV/dx = q(x) e dM/dx = V(x).
  Regras de traçado derivadas: carga uniforme → V reta inclinada → M parábola;
  carga concentrada → salto em V → bico em M; momento aplicado → salto em M.

## 4. Isostaticidade
- Vigas/quadros: g = r − (3 + nº de equações de condição). g=0 isostática;
  g>0 hiperestática; g<0 hipostática.
- Contar não basta: verificar estabilidade (sistema com solução única). Mensagens de erro
  são pedagógicas e sugerem o que mudar.

## 5. Formato numérico e unidades
- Internamente: kN, m, kN·m. Exibição: vírgula decimal brasileira, 2 casas ("12,50 kN").
- Tolerância de comparação com gabarito: 1e-6.

## 6. Metodologia canônica de resolução (esqueleto do rastro)
1. Identificar apoios e incógnitas.
2. Verificar isostaticidade (e estabilidade).
3. Substituir distribuídas por resultantes (área + centroide) para o equilíbrio global.
4. ΣFx, ΣM_polo, ΣFy (+ equações de rótula), resolvendo UMA incógnita por equação
   sempre que possível; sistema conjunto só quando acopladas (ex.: Gerber com engaste).
5. Conferência final (ΣFy com valores substituídos).
6. [Semana 2] Seccionamento por trechos → N(x), V(x), M(x) → pontos notáveis → diagramas.

## 7. [DECIDIR] Pendências
- Nomenclatura de trechos no seccionamento (ex.: "trecho AB", "0 ≤ x < 3").
- Como representar apoio de 1º gênero inclinado (fica fora do MVP?).
- Política de arredondamento em passos intermediários da explicação (recomendo: nunca
  arredondar no cálculo, só na exibição — documentar para a IA não "propagar" arredondamento).
