#!/usr/bin/env python3
"""Refaz a conta de contraste da página.

O README manda refazer esta conta antes de publicar sempre que o texto
secundário escurecer ou a brasa do fundo ficar mais forte. Isto é a conta.

    python3 site/contraste.py

As cores saem do próprio `index.html` — o script lê o bloco `:root`, então ele
não tem como divergir da página. O que fica escrito aqui são os DOIS números
que não moram no `:root`: o alfa do centro de cada gradiente da aura e a
fórmula de opacidade que o JS escreve durante a rolagem. Se você mexer em
qualquer um dos dois, atualize as constantes lá embaixo junto.

O pior caso da página não é o texto sobre o preto puro: é o texto sobre a aura
no pico, com as DUAS camadas somadas — a quente e a neutra que fica por cima
dela. Foi essa segunda camada que a conta antiga esquecia.
"""

import re
import sys
from pathlib import Path

PAGINA = Path(__file__).resolve().parent / "index.html"

MINIMO_AA = 4.5          # texto normal, WCAG 2.1 AA
MINIMO_AA_GRANDE = 3.0   # >= 24px, ou >= 18.66px em negrito


# --------------------------------------------------------------------- WCAG
def linear(canal):
    c = canal / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminancia(rgb):
    r, g, b = (linear(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(frente, fundo):
    a, b = luminancia(frente), luminancia(fundo)
    claro, escuro = max(a, b), min(a, b)
    return (claro + 0.05) / (escuro + 0.05)


def sobre(cor, alfa, fundo):
    """Compõe `cor` com opacidade `alfa` em cima de `fundo`, sem canal alfa."""
    return tuple(cor[i] * alfa + fundo[i] * (1 - alfa) for i in range(3))


def de_hex(s):
    s = s.strip().lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


# ------------------------------------------------- tokens lidos da página
def tokens():
    fonte = PAGINA.read_text(encoding="utf-8")
    raiz = re.search(r":root\s*\{(.*?)\n\}", fonte, re.S)
    if not raiz:
        sys.exit(f"não achei o bloco :root em {PAGINA}")
    achados = {}
    for nome, valor in re.findall(r"(--[\w-]+):\s*([^;]+);", raiz.group(1)):
        valor = valor.strip()
        if re.fullmatch(r"#[0-9A-Fa-f]{6}", valor):
            achados[nome] = de_hex(valor)
        elif re.fullmatch(r"\d+,\s*\d+,\s*\d+", valor):
            achados[nome] = tuple(int(v) for v in valor.split(","))
    return achados


T = tokens()

# ------------------------------------------------------- constantes da aura
# Parada de 0% de cada gradiente radial, em `.aura__brasa` e `.aura__fria`.
ALFA_BRASA = 0.32
ALFA_FRIA = 0.20
# Cor da camada neutra — é a única do fundo que não vive no :root.
FRIA = (152, 154, 172)
# Opacidade que o JS escreve em função do calor (0..1), em `aplicar()`.
def opacidade_brasa(calor):
    return 0.28 + 0.72 * calor


def opacidade_fria(calor):
    return 0.42 - 0.10 * calor


def fundo_da_aura(calor):
    """O preto da página com as duas camadas compostas por cima, no centro
    do gradiente, que é onde a aura é mais clara."""
    bg = T["--preto"]
    bg = sobre(T["--brasa-rgb"], ALFA_BRASA * opacidade_brasa(calor), bg)
    bg = sobre(FRIA, ALFA_FRIA * opacidade_fria(calor), bg)
    return bg


TEXTOS = ["--branco", "--cinza-claro", "--cinza", "--cinza-fraco"]


def rgb(c):
    return "rgb(%d,%d,%d)" % tuple(round(v) for v in c)


def main():
    problemas = []

    print("Texto sobre a aura, do miolo frio ao pico quente")
    print("  calor  fundo            " + "".join(f"{t:>15}" for t in TEXTOS))
    for calor in (0.05, 0.10, 0.52, 0.78, 1.00):
        linha = f"   {calor:.2f}  {rgb(fundo_da_aura(calor)):<16}"
        for token in TEXTOS:
            v = contraste(T[token], fundo_da_aura(calor))
            linha += f"{v:>13.2f}:1"
            if v < MINIMO_AA:
                problemas.append(f"{token} sobre a aura em calor {calor:.2f}: {v:.2f}:1")
        print(linha)

    print("\nPior caso da página (pico da aura, as duas camadas somadas)")
    pior = min(contraste(T["--cinza-fraco"], fundo_da_aura(c)) for c in (0.78, 1.0))
    print(f"  --cinza-fraco: {pior:.2f}:1   (mínimo AA: {MINIMO_AA})")

    print("\nTexto sobre superfícies opacas, onde a aura não passa")
    for nome in ("--preto", "--carvao", "--carvao-alto"):
        if nome not in T:
            continue
        linha = f"  {nome:<14}"
        for token in TEXTOS:
            v = contraste(T[token], T[nome])
            linha += f"{v:>13.2f}:1"
            if v < MINIMO_AA:
                problemas.append(f"{token} sobre {nome}: {v:.2f}:1")
        print(linha)

    print("\nBranco sobre o vermelho do CTA")
    for nome in ("--vermelho", "--vermelho-alto"):
        v = contraste((255, 255, 255), T[nome])
        rotulo = "parado" if nome == "--vermelho" else "hover "
        print(f"  {rotulo} {rgb(T[nome])}: {v:.2f}:1")
        if v < MINIMO_AA:
            problemas.append(f"branco sobre {nome} ({rgb(T[nome])}): {v:.2f}:1")

    if problemas:
        print(f"\nABAIXO DO MÍNIMO AA ({len(problemas)}):")
        for p in problemas:
            print("  -", p)
        return 1

    print("\nTudo acima de 4.5:1. Pode publicar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
