import heapq

def heuristic(state, goal):
    """Manhattan Distance Heuristic"""
    distance = 0
    for i in range(3):
        for j in range(3):
            value = state[i][j]
            if value == 0:
                continue
            x, y = [(ix, iy) for ix, row in enumerate(goal) for iy, v in enumerate(row) if v == value][0]
            distance += abs(x - i) + abs(y - j)
    return distance

def get_neighbors(state):
    neighbors = []
    x, y = [(ix, iy) for ix, row in enumerate(state) for iy, i in enumerate(row) if i == 0][0]

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    for dx, dy in directions:
        new_x, new_y = x + dx, y + dy
        if 0 <= new_x < 3 and 0 <= new_y < 3:
            new_state = [row[:] for row in state]
            new_state[x][y], new_state[new_x][new_y] = new_state[new_x][new_y], new_state[x][y]
            neighbors.append(new_state)
    return neighbors

def astar(start, goal):
    pq = []
    heapq.heappush(pq, (heuristic(start, goal), 0, start, []))
    visited = set()

    while pq:
        est_total_cost, cost_so_far, current_state, path = heapq.heappop(pq)
        state_tuple = tuple(tuple(row) for row in current_state)

        if current_state == goal:
            return path + [current_state]

        if state_tuple in visited:
            continue
        visited.add(state_tuple)

        for neighbor in get_neighbors(current_state):
            heapq.heappush(pq, (
                cost_so_far + 1 + heuristic(neighbor, goal),
                cost_so_far + 1,
                neighbor,
                path + [current_state]
            ))

    return None