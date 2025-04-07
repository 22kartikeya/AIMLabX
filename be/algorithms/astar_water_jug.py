from collections import deque

def is_goal(state, goal):
    return goal in state

def get_successors(state, capacity):
    jug1, jug2 = state
    max1, max2 = capacity
    successors = []

    # Fill jug1
    successors.append((max1, jug2))
    # Fill jug2
    successors.append((jug1, max2))
    # Empty jug1
    successors.append((0, jug2))
    # Empty jug2
    successors.append((jug1, 0))
    # Pour jug1 into jug2
    pour = min(jug1, max2 - jug2)
    successors.append((jug1 - pour, jug2 + pour))
    # Pour jug2 into jug1
    pour = min(jug2, max1 - jug1)
    successors.append((jug1 + pour, jug2 - pour))

    return successors

def heuristic(state, goal):
    return abs(state[0] - goal) + abs(state[1] - goal)

def astar_water_jug(capacity, goal):
    visited = set()
    queue = []
    start = (0, 0)
    queue.append((heuristic(start, goal), 0, start, [start]))

    while queue:
        queue.sort()  # Priority queue
        _, cost, current, path = queue.pop(0)

        if current in visited:
            continue
        visited.add(current)

        if is_goal(current, goal):
            return path

        for neighbor in get_successors(current, capacity):
            if neighbor not in visited:
                h = heuristic(neighbor, goal)
                queue.append((cost + 1 + h, cost + 1, neighbor, path + [neighbor]))

    return None