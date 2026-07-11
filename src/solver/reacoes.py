"""
Solver de reações de apoio para vigas isostáticas (incl. Gerber).

Pipeline: incógnitas → validação (g e estabilidade) → resultantes das
distribuídas → equações de equilíbrio → resolução SEQUENCIAL (como o
professor ensina: uma equação, uma incógnita, sempre que possível) →
verificação final. Tudo registrado no Rastro.
"""
from __future__ import annotations
import sympy as sp
from .modelo import Estrutura, CargaConcentrada, MomentoConcentrado, CargaDistribuida
from .rastro import Rastro, Resultado

_NOME_APOIO = {
    "primeiro_genero": "1º gênero (móvel)",
    "segundo_genero": "2º gênero (fixo)",
    "terceiro_genero": "3º gênero (engaste)",
}


def _fmt(v: float) -> str:
    """Formata número para LaTeX com vírgula decimal brasileira."""
    return f"{v:g}".replace(".", "{,}")


class ResultadoReacoes:
    def __init__(self, reacoes: dict[str, float], rastro: Rastro):
        self.reacoes = reacoes
        self.rastro = rastro


def resolver_reacoes(est: Estrutura) -> ResultadoReacoes:
    rastro = Rastro()

    # ---------- 1. Incógnitas ----------------------------------------------
    incognitas: list[sp.Symbol] = []
    info: dict[sp.Symbol, dict] = {}  # symbol -> {no, x, tipo:'fx'|'fy'|'m'}
    descr = []
    for ap in est.apoios:
        no = est.no_por_id(ap.no)
        if ap.tipo in ("segundo_genero", "terceiro_genero"):
            s = sp.Symbol(f"R_{{{ap.no},x}}")
            incognitas.append(s); info[s] = {"no": ap.no, "x": no.x, "tipo": "fx"}
        s = sp.Symbol(f"R_{{{ap.no},y}}")
        incognitas.append(s); info[s] = {"no": ap.no, "x": no.x, "tipo": "fy"}
        if ap.tipo == "terceiro_genero":
            s = sp.Symbol(f"M_{{{ap.no}}}")
            incognitas.append(s); info[s] = {"no": ap.no, "x": no.x, "tipo": "m"}
        descr.append(f"{ap.no} ({_NOME_APOIO[ap.tipo]})")

    rastro.adicionar(
        fase="identificacao",
        titulo="Identificação dos apoios e incógnitas",
        justificativa=(
            f"Apoios: {'; '.join(descr)}. Cada gênero de apoio libera/impede "
            f"movimentos diferentes, gerando {len(incognitas)} reações incógnitas: "
            + ", ".join(sp.latex(s) for s in incognitas) + "."
        ),
        tags=["apoios", "incognitas"],
    )

    # ---------- 2. Validação: isostaticidade e estabilidade ------------------
    r = len(incognitas)
    n_eq = 3 + len(est.rotulas)
    g = r - n_eq
    if g > 0:
        rastro.adicionar(
            fase="validacao", titulo="Estrutura hiperestática",
            equacao_latex=f"g = r - e = {r} - {n_eq} = {g}",
            justificativa=(
                f"Há {r} reações e apenas {n_eq} equações disponíveis "
                f"(3 de equilíbrio + {len(est.rotulas)} de condição). "
                "Equilíbrio não basta: é preciso análise hiperestática (Fase 3 do produto)."
            ),
            tags=["isostaticidade", "erro"],
        )
        raise ValueError(f"Estrutura HIPERESTÁTICA (grau {g}).")
    if g < 0:
        raise ValueError(f"Estrutura HIPOSTÁTICA (grau {g}): mecanismo, não resiste às cargas.")

    rastro.adicionar(
        fase="validacao", titulo="Verificação de isostaticidade",
        equacao_latex=f"g = r - e = {r} - {n_eq} = 0",
        justificativa=(
            "O número de reações é igual ao de equações (3 de equilíbrio"
            + (f" + {len(est.rotulas)} de condição das rótulas" if est.rotulas else "")
            + "), portanto a estrutura é isostática: dá para resolver só com estática."
        ),
        tags=["isostaticidade"],
    )

    # ---------- 3. Resultantes das cargas distribuídas ----------------------
    # Representamos cada distribuída por resultante + posição (pedagógico) e
    # guardamos a função q(x) para as integrais parciais (equações de rótula).
    xs = sp.Symbol("x")
    distribuidas = []  # (carga, q_expr, R, x_bar)
    for c in est.cargas:
        if isinstance(c, CargaDistribuida):
            L = c.x_fim - c.x_ini
            q_expr = c.q_ini + (c.q_fim - c.q_ini) * (xs - c.x_ini) / L
            R = float(sp.integrate(q_expr, (xs, c.x_ini, c.x_fim)))
            if abs(R) > 1e-12:
                x_bar = float(sp.integrate(q_expr * xs, (xs, c.x_ini, c.x_fim)) / R)
            else:
                x_bar = (c.x_ini + c.x_fim) / 2
            distribuidas.append((c, q_expr, R, x_bar))
            forma = "uniforme" if c.q_ini == c.q_fim else (
                "triangular" if c.q_ini == 0 or c.q_fim == 0 else "trapezoidal")
            rastro.adicionar(
                fase="cargas",
                titulo=f"Resultante da carga distribuída {forma} em [{_fmt(c.x_ini)}; {_fmt(c.x_fim)}] m",
                equacao_latex=(
                    f"R_q = \\int q(x)\\,dx = {_fmt(R)}\\;kN"
                    f" \\quad\\text{{em}}\\quad \\bar{{x}} = {_fmt(x_bar)}\\;m"
                ),
                resultado=Resultado(simbolo="R_q", valor=R, unidade="kN",
                                    sentido="para baixo (↓)" if R < 0 else "para cima (↑)"),
                justificativa=(
                    "Para o equilíbrio global, a carga distribuída pode ser substituída "
                    "por sua resultante (área do diagrama de carga) aplicada no centroide."
                ),
                tags=["carga_distribuida", "resultante"],
            )

    # ---------- 4. Montagem das equações de equilíbrio -----------------------
    def soma_fx():
        expr = sum((s for s in incognitas if info[s]["tipo"] == "fx"), sp.Integer(0))
        expr += sum(c.fx for c in est.cargas if isinstance(c, CargaConcentrada))
        return expr

    def soma_fy():
        expr = sum((s for s in incognitas if info[s]["tipo"] == "fy"), sp.Integer(0))
        expr += sum(c.fy for c in est.cargas if isinstance(c, CargaConcentrada))
        expr += sum(R for (_, _, R, _) in distribuidas)
        return expr

    def soma_momentos(x_polo: float, apenas_esquerda_de: float | None = None):
        """ΣM em torno de x_polo (anti-horário +). Se apenas_esquerda_de for
        dado, considera só o trecho x < x_r (equação de condição da rótula)."""
        expr = sp.Integer(0)
        for s in incognitas:
            xi, tp = info[s]["x"], info[s]["tipo"]
            if apenas_esquerda_de is not None and xi >= apenas_esquerda_de:
                continue
            if tp == "fy":
                expr += s * (xi - x_polo)
            elif tp == "m":
                expr += s  # binário: momento livre, independe do polo
            # tp == 'fx': força no eixo da viga (y=0) não gera momento no MVP
        for c in est.cargas:
            if isinstance(c, CargaConcentrada):
                if apenas_esquerda_de is not None and c.x >= apenas_esquerda_de:
                    continue
                expr += c.fy * (c.x - x_polo)
            elif isinstance(c, MomentoConcentrado):
                if apenas_esquerda_de is not None and c.x >= apenas_esquerda_de:
                    continue
                expr += c.m
        for (c, q_expr, R, x_bar) in distribuidas:
            lim = c.x_fim if apenas_esquerda_de is None else min(c.x_fim, apenas_esquerda_de)
            if lim <= c.x_ini:
                continue
            if apenas_esquerda_de is None:
                expr += R * (x_bar - x_polo)  # forma pedagógica: resultante × braço
            else:  # trecho parcial: integra diretamente
                expr += sp.integrate(q_expr * (xs - x_polo), (xs, c.x_ini, lim))
        return sp.expand(expr)

    # Polo pedagógico: primeiro apoio (elimina as reações dele da equação)
    apoio_polo = est.apoios[0]
    x_polo = est.no_por_id(apoio_polo.no).x

    equacoes: list[tuple[str, sp.Expr, str, list[str]]] = [
        (
            "\\sum F_x = 0", soma_fx(),
            "Equilíbrio de forças horizontais.", ["equilibrio", "fx"],
        ),
        (
            f"\\sum M_{{{apoio_polo.no}}} = 0", soma_momentos(x_polo),
            f"Somatório de momentos com polo em {apoio_polo.no}: escolhemos este ponto "
            f"porque as reações de {apoio_polo.no} passam por ele e somem da equação.",
            ["equilibrio", "momento", "escolha_de_polo"],
        ),
        (
            "\\sum F_y = 0", soma_fy(),
            "Equilíbrio de forças verticais.", ["equilibrio", "fy"],
        ),
    ]
    for x_r in est.rotulas:
        equacoes.append((
            f"\\sum M_{{rot({_fmt(x_r)})}}^{{esq}} = 0",
            soma_momentos(x_r, apenas_esquerda_de=x_r),
            f"Equação de condição: a rótula em x={_fmt(x_r)} m não transmite momento, "
            "então o somatório de momentos do trecho à esquerda dela é nulo.",
            ["equilibrio", "rotula", "gerber"],
        ))

    # ---------- 5. Resolução sequencial (didática) ---------------------------
    conhecidos: dict[sp.Symbol, float] = {}
    pendentes = list(equacoes)
    while pendentes:
        progrediu = False
        for item in list(pendentes):
            nome, expr, just, tags = item
            expr_sub = expr.subs(conhecidos)
            livres = sorted(expr_sub.free_symbols, key=lambda s: s.name)
            if len(livres) == 0:
                pendentes.remove(item)  # equação trivial (ex.: ΣFx sem cargas horizontais)
                progrediu = True
            elif len(livres) == 1:
                s = livres[0]
                val = float(sp.solve(sp.Eq(expr_sub, 0), s)[0])
                conhecidos[s] = val
                rastro.adicionar(
                    fase="equilibrio",
                    titulo=f"Aplicando ${nome}$",
                    equacao_latex=f"{nome}:\\;\\; {sp.latex(sp.Eq(expr_sub, 0))}"
                                  f" \\;\\Rightarrow\\; {sp.latex(s)} = {_fmt(val)}",
                    resultado=_resultado(s, val, info),
                    justificativa=just + " Após substituir os valores já conhecidos, "
                                         "resta uma única incógnita — resolvemos direto.",
                    tags=tags,
                )
                pendentes.remove(item)
                progrediu = True
        if not progrediu:
            # Nenhuma equação com 1 incógnita: resolve o sistema restante junto.
            exprs = [e.subs(conhecidos) for (_, e, _, _) in pendentes]
            livres = sorted(set().union(*[e.free_symbols for e in exprs]), key=lambda s: s.name)
            sol = sp.solve([sp.Eq(e, 0) for e in exprs], livres, dict=True)
            if not sol:
                raise ValueError("Estrutura instável: o sistema de equilíbrio não tem solução única.")
            nomes = ",\\;".join(n for (n, _, _, _) in pendentes)
            sistema = "\\;;\\;".join(sp.latex(sp.Eq(e, 0)) for e in exprs)
            for s, v in sol[0].items():
                conhecidos[s] = float(v)
            rastro.adicionar(
                fase="equilibrio",
                titulo="Resolvendo o sistema de equações restante",
                equacao_latex=f"\\{{{sistema}\\}}",
                justificativa=(
                    f"As equações ${nomes}$ têm incógnitas acopladas — nenhuma pode ser "
                    "resolvida isolada. Resolvemos o sistema linear em conjunto: "
                    + ", ".join(f"{sp.latex(s)} = {_fmt(float(v))}" for s, v in sol[0].items()) + "."
                ),
                tags=["equilibrio", "sistema"],
            )
            for s, v in sol[0].items():
                rastro.adicionar(
                    fase="equilibrio", titulo=f"Resultado: ${sp.latex(s)}$",
                    equacao_latex=f"{sp.latex(s)} = {_fmt(float(v))}",
                    resultado=_resultado(s, float(v), info),
                    justificativa="Valor obtido na solução do sistema acima.",
                    tags=["resultado"],
                )
            pendentes = []

    # ---------- 6. Verificação final -----------------------------------------
    residuo = float(soma_fy().subs(conhecidos))
    rastro.adicionar(
        fase="verificacao", titulo="Conferência: equilíbrio vertical",
        equacao_latex=f"\\sum F_y = {_fmt(round(residuo, 9))} \\approx 0 \\;\\checkmark",
        justificativa="Boa prática de prova: substituir tudo em ΣF_y e conferir que fecha em zero.",
        tags=["verificacao"],
    )
    if abs(residuo) > 1e-6:
        raise AssertionError(f"Verificação falhou: ΣFy = {residuo}")

    reacoes = {_chave(s, info): v for s, v in conhecidos.items()}
    return ResultadoReacoes(reacoes, rastro)


def _chave(s: sp.Symbol, info: dict) -> str:
    d = info[s]
    return f"M_{d['no']}" if d["tipo"] == "m" else f"R_{d['no']}_{'x' if d['tipo']=='fx' else 'y'}"


def _resultado(s: sp.Symbol, val: float, info: dict) -> Resultado:
    d = info[s]
    if d["tipo"] == "m":
        sentido = "anti-horário (↺)" if val > 0 else ("horário (↻)" if val < 0 else "nulo")
        return Resultado(simbolo=sp.latex(s), valor=val, unidade="kN·m", sentido=sentido)
    if d["tipo"] == "fx":
        sentido = "para a direita (→)" if val > 0 else ("para a esquerda (←)" if val < 0 else "nula")
    else:
        sentido = "para cima (↑)" if val > 0 else ("para baixo (↓)" if val < 0 else "nula")
    return Resultado(simbolo=sp.latex(s), valor=val, unidade="kN", sentido=sentido)
