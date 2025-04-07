def heuristic(state, goal):
    return abs(state[0] - goal[0]) + abs(state[1] - goal[1])

def get_neighbors(state, capacities):
    x, y = state
    a, b = capacities
    return list(set([
        (a, y), (x, b), (0, y), (x, 0),
        (min(x + y, a), max(0, y - (a - x))),
        (max(0, x - (b - y)), min(x + y, b))
    ]))

def hill_climb(start, goal, capacities):
    current = start
    path = [current]
    visited = set([current])
    while current != goal:
        neighbors = get_neighbors(current, capacities)
        neighbors = [n for n in neighbors if n not in visited]
        if not neighbors:
            break
        next_state = min(neighbors, key=lambda s: heuristic(s, goal))
        if heuristic(next_state, goal) >= heuristic(current, goal):
            break
        visited.add(next_state)
        current = next_state
        path.append(current)
    return path