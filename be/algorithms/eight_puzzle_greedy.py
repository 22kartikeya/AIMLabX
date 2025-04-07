import heapq

goal_state = [[1,2,3],[4,5,6],[7,8,0]]

def heuristic(state):
    distance = 0
    for i in range(3):
        for j in range(3):
            val = state[i][j]
            if val != 0:
                goal_i, goal_j = divmod(val-1, 3)
                distance += abs(i - goal_i) + abs(j - goal_j)
    return distance

def get_neighbors(state):
    i, j = next((i, j) for i in range(3) for j in range(3) if state[i][j] == 0)
    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    neighbors = []
    for dx, dy in directions:
        ni, nj = i + dx, j + dy
        if 0 <= ni < 3 and 0 <= nj < 3:
            new_state = [row[:] for row in state]
            new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
            neighbors.append(new_state)
    return neighbors

def greedy_bfs(start):
    heap = [(heuristic(start), start, [])]
    visited = set()
    while heap:
        h, current, path = heapq.heappop(heap)
        if current == goal_state:
            return path + [current]
        visited.add(str(current))
        for neighbor in get_neighbors(current):
            if str(neighbor) not in visited:
                heapq.heappush(heap, (heuristic(neighbor), neighbor, path + [current]))