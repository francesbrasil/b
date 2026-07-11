"""
Modelo estrutural — o CONTRATO central do projeto.

Toda estrutura entra no sistema neste formato (via editor, texto→IA ou teste).
MVP: viga reta no eixo x. Convenções (ver docs/convencoes.md):
  - Eixo y para cima; forças para baixo são NEGATIVAS (ex.: fy=-20).
  - Momentos anti-horários são POSITIVOS.
  - Unidades padrão: kN e m.
"""
from __future__ import annotations
from typing import Literal, Union
from pydantic import BaseModel, Field, model_validator


class No(BaseModel):
    id: str
    x: float
    y: float = 0.0  # MVP: viga no eixo x → y sempre 0


class Apoio(BaseModel):
    no: str
    tipo: Literal["primeiro_genero", "segundo_genero", "terceiro_genero"]
    # primeiro_genero : 1 reação (vertical no MVP)      → R_y
    # segundo_genero  : 2 reações                        → R_x, R_y
    # terceiro_genero : engaste, 3 reações               → R_x, R_y, M


class CargaConcentrada(BaseModel):
    tipo: Literal["concentrada"] = "concentrada"
    x: float
    fx: float = 0.0  # MVP: cargas horizontais atuam no eixo da viga
    fy: float = 0.0


class MomentoConcentrado(BaseModel):
    tipo: Literal["momento"] = "momento"
    x: float
    m: float  # kN·m, anti-horário positivo


class CargaDistribuida(BaseModel):
    tipo: Literal["distribuida"] = "distribuida"
    x_ini: float
    x_fim: float
    q_ini: float  # kN/m (negativo = para baixo)
    q_fim: float  # permite uniforme (q_ini==q_fim), triangular e trapezoidal

    @model_validator(mode="after")
    def _valida_intervalo(self):
        if self.x_fim <= self.x_ini:
            raise ValueError("Carga distribuída: x_fim deve ser maior que x_ini.")
        return self


Carga = Union[CargaConcentrada, MomentoConcentrado, CargaDistribuida]


class Estrutura(BaseModel):
    tipo_estrutura: Literal["viga"] = "viga"
    unidades: dict = Field(default={"forca": "kN", "comprimento": "m"})
    nos: list[No]
    apoios: list[Apoio]
    rotulas: list[float] = Field(default=[], description="posições x das rótulas (Gerber)")
    cargas: list[Carga]

    def no_por_id(self, id_: str) -> No:
        for n in self.nos:
            if n.id == id_:
                return n
        raise ValueError(f"Nó '{id_}' não encontrado.")

    @model_validator(mode="after")
    def _valida_referencias(self):
        ids = {n.id for n in self.nos}
        for a in self.apoios:
            if a.no not in ids:
                raise ValueError(f"Apoio referencia nó inexistente: '{a.no}'.")
        if len(ids) != len(self.nos):
            raise ValueError("Há nós com id duplicado.")
        return self
