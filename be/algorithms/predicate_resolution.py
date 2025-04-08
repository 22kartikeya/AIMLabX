from nltk import logic
from nltk.inference import ResolutionProver

def prove_custom_logic(premises_raw, goal_raw):
    lp = logic.LogicParser()
    
    try:
        premises = [lp.parse(p) for p in premises_raw]
        goal = lp.parse(goal_raw)
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to parse input: {str(e)}",
            "explanation": []
        }

    prover = ResolutionProver()
    proof = prover.prove(goal, premises, verbose=True)
    
    explanation = []
    for i, p in enumerate(premises_raw, start=1):
        explanation.append(f"{i}. {p}")
    explanation.append(f"{len(premises_raw) + 1}. GOAL: {goal_raw}")
    
    return {
        "success": proof,
        "explanation": explanation
    }