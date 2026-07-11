"""
Rastro de passos — o coração pedagógico do produto.

REGRA DE OURO: todo número que a IA citar na explicação DEVE existir aqui.
O solver registra cada operação como um Passo estruturado; a Camada 3 (IA)
apenas NARRA estes passos, nunca calcula nada.
"""
from __future__ import annotations
from pydantic import BaseModel, Field


class Resultado(BaseModel):
    simbolo: str          # ex.: "R_{B,y}"
    valor: float          # valor com sinal, na convenção do projeto
    unidade: str          # "kN", "kN·m", "m"
    sentido: str | None = None  # "para cima (↑)", "anti-horário (↺)", etc.


class Passo(BaseModel):
    fase: str                       # "identificacao" | "validacao" | "cargas" | "equilibrio" | "verificacao"
    numero: int
    titulo: str
    equacao_latex: str | None = None
    resultado: Resultado | None = None
    justificativa: str              # o "porquê" — matéria-prima da explicação
    tags: list[str] = Field(default=[])


class Rastro(BaseModel):
    passos: list[Passo] = Field(default=[])

    def adicionar(self, fase: str, titulo: str, justificativa: str,
                  equacao_latex: str | None = None,
                  resultado: Resultado | None = None,
                  tags: list[str] | None = None) -> Passo:
        p = Passo(
            fase=fase,
            numero=len(self.passos) + 1,
            titulo=titulo,
            equacao_latex=equacao_latex,
            resultado=resultado,
            justificativa=justificativa,
            tags=tags or [],
        )
        self.passos.append(p)
        return p

    def imprimir(self) -> None:
        """Impressão amigável no terminal (para desenvolvimento)."""
        for p in self.passos:
            print(f"\n[{p.numero}] {p.titulo}  ({p.fase})")
            if p.equacao_latex:
                print(f"    {p.equacao_latex}")
            if p.resultado:
                r = p.resultado
                sentido = f"  [{r.sentido}]" if r.sentido else ""
                print(f"    => {r.simbolo} = {r.valor:g} {r.unidade}{sentido}")
            print(f"    Porquê: {p.justificativa}")
