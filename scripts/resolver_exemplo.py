"""
Demonstração: resolve um caso do golden dataset e imprime o rastro completo.

Uso:
    python scripts/resolver_exemplo.py                          # usa o caso 05 (Gerber)
    python scripts/resolver_exemplo.py dados/golden/04_viga_com_balanco.json
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from src.solver.modelo import Estrutura
from src.solver.reacoes import resolver_reacoes

PADRAO = "dados/golden/05_viga_gerber.json"


def main():
    caminho = Path(sys.argv[1] if len(sys.argv) > 1 else PADRAO)
    caso = json.loads(caminho.read_text(encoding="utf-8"))

    print("=" * 70)
    print(f"EXERCÍCIO: {caso['descricao']}")
    print("=" * 70)

    est = Estrutura(**caso["estrutura"])
    res = resolver_reacoes(est)

    print("\n--- RASTRO DE PASSOS (o que a IA vai narrar) ---")
    res.rastro.imprimir()

    print("\n--- REAÇÕES FINAIS ---")
    for chave, valor in sorted(res.reacoes.items()):
        print(f"  {chave} = {valor:g}")

    if "gabarito" in caso:
        ok = all(abs(res.reacoes[k] - v) < 1e-6 for k, v in caso["gabarito"].items())
        print(f"\nConfere com o gabarito? {'SIM ✓' if ok else 'NÃO ✗ — investigar!'}")

    print("\n--- RASTRO EM JSON (o que vai para a API da Camada 3) ---")
    print(res.rastro.model_dump_json(indent=2)[:600] + "\n... (truncado)")


if __name__ == "__main__":
    main()
