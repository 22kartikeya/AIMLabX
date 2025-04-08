from nltk import logic
from nltk.inference import ResolutionProver

def prove_custom_logic(premises_list, goal_str):
    lp = logic.LogicParser()

    try:
        premises = [lp.parse(p) for p in premises_list]
        goal = lp.parse(goal_str)

        prover = ResolutionProver()
        success = prover.prove(goal, premises)

        return { "success": success }
    except Exception as e:
        return { "success": False, "error": str(e) }