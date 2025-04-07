from sympy import symbols
from sympy.logic.boolalg import Implies, And, Not, satisfiable

def resolve_marcus():
    man, pompeian, roman, loyalto, ruler = symbols('man pompeian roman loyalto ruler')
    facts = And(
        Implies(pompeian, roman),
        Implies(roman, man),
        Implies(And(man, loyalto), Not(ruler)),
        pompeian,
        loyalto
    )
    conclusion = Not(ruler)
    kb = And(facts, Not(conclusion))
    return not satisfiable(kb)