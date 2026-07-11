"""
Testes de regressão: o solver DEVE bater 100% com o golden dataset.
Regra do projeto: nenhuma mudança entra se um gabarito quebrar.

Rodar:  pytest -v
"""
import json
from pathlib import Path
import pytest

from src.solver.modelo import Estrutura
from src.solver.reacoes import resolver_reacoes

PASTA_GOLDEN = Path(__file__).parent.parent / "dados" / "golden"
CASOS = sorted(PASTA_GOLDEN.glob("*.json"))
TOLERANCIA = 1e-6


@pytest.mark.parametrize("arquivo", CASOS, ids=[c.stem for c in CASOS])
def test_reacoes_batem_com_gabarito(arquivo):
    caso = json.loads(arquivo.read_text(encoding="utf-8"))
    est = Estrutura(**caso["estrutura"])
    res = resolver_reacoes(est)

    for chave, esperado in caso["gabarito"].items():
        assert chave in res.reacoes, f"{arquivo.name}: solver não retornou {chave}"
        obtido = res.reacoes[chave]
        assert abs(obtido - esperado) < TOLERANCIA, (
            f"{arquivo.name}: {chave} esperado={esperado}, obtido={obtido}"
        )

    # Nenhuma reação extra além do gabarito
    assert set(res.reacoes) == set(caso["gabarito"]), (
        f"{arquivo.name}: reações divergentes {set(res.reacoes)} vs {set(caso['gabarito'])}"
    )


def test_hiperestatica_e_detectada():
    """Viga com dois apoios de 2º gênero (r=4 > 3) deve falhar com mensagem clara."""
    est = Estrutura(
        nos=[{"id": "A", "x": 0}, {"id": "B", "x": 6}],
        apoios=[{"no": "A", "tipo": "segundo_genero"}, {"no": "B", "tipo": "segundo_genero"}],
        cargas=[{"tipo": "concentrada", "x": 3, "fy": -10}],
    )
    with pytest.raises(ValueError, match="HIPERESTÁTICA"):
        resolver_reacoes(est)
