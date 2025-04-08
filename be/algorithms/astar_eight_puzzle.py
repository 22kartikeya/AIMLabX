import heapq

# A* Algorithm for Water Jug Problem
class WaterJug:
    def __init__(self, j1, j2, start, goal):
        self.j1_capacity = j1
        self.j2_capacity = j2
        self.start = start
        self.goal = goal

    def heuristic(self, state):
        return abs(state[0] - self.goal[0]) + abs(state[1] - self.goal[1])

    def get_neighbors(self, state):
        x, y = state
        neighbors = set()

        neighbors.add((self.j1_capacity, y))  # Fill jug1
        neighbors.add((x, self.j2_capacity))  # Fill jug2
        neighbors.add((0, y))  # Empty jug1
        neighbors.add((x, 0))  # Empty jug2

        # Pour jug1 → jug2
        pour_j1_j2 = min(x, self.j2_capacity - y)
        neighbors.add((x - pour_j1_j2, y + pour_j1_j2))

        # Pour jug2 → jug1
        pour_j2_j1 = min(y, self.j1_capacity - x)
        neighbors.add((x + pour_j2_j1, y - pour_j2_j1))

        return list(neighbors)

    def a_star_search(self):
        pq = [(self.heuristic(self.start), 0, self.start)]
        visited = set()
        parent = {self.start: None}  # Track how we got to each state

        while pq:
            _, cost, current = heapq.heappop(pq)

            if current in visited:
                continue

            visited.add(current)

            if current == self.goal:
                # Reconstruct the optimal path from goal to start
                path = []
                while current is not None:
                    path.append(current)
                    current = parent[current]
                path.reverse()
                return {"success": True, "path": path}

            for neighbor in self.get_neighbors(current):
                if neighbor not in visited:
                    heapq.heappush(pq, (self.heuristic(neighbor) + cost + 1, cost + 1, neighbor))
                    if neighbor not in parent:  # store only first (shortest) path
                        parent[neighbor] = current

        return {"success": False, "path": []}

# A* Algorithm for 8 Puzzle Problem
class Puzzle:
    def __init__(self, board, goal, path=None):
        self.board = board
        self.goal = goal
        self.n = len(board)
        self.empty_tile = self.find_empty()
        self.path = path or [board]

    def find_empty(self):
        for i in range(self.n):
            for j in range(self.n):
                if self.board[i][j] == 0:
                    return i, j
        return None

    def heuristic(self):
        dist = 0
        goal_positions = {self.goal[i][j]: (i, j) for i in range(self.n) for j in range(self.n)}
        for i in range(self.n):
            for j in range(self.n):
                if self.board[i][j] != 0:
                    x, y = goal_positions[self.board[i][j]]
                    dist += abs(x - i) + abs(y - j)
        return dist

    def get_neighbors(self):
        x, y = self.empty_tile
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        neighbors = []
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.n and 0 <= ny < self.n:
                new_board = [row[:] for row in self.board]
                new_board[x][y], new_board[nx][ny] = new_board[nx][ny], new_board[x][y]
                neighbors.append(Puzzle(new_board, self.goal, self.path + [new_board]))
        return neighbors

    def __lt__(self, other):
        return self.heuristic() < other.heuristic()

    def __eq__(self, other):
        return self.board == other.board

    def __hash__(self):
        return hash(tuple(map(tuple, self.board)))


def a_star_puzzle(start, goal):
    start_puzzle = Puzzle(start, goal)
    goal_state = goal

    open_list = []
    heapq.heappush(open_list, (start_puzzle.heuristic(), start_puzzle))
    visited = set()

    while open_list:
        _, current = heapq.heappop(open_list)
        if current.board == goal_state:
            return {"success": True, "path": current.path}

        visited.add(current)

        for neighbor in current.get_neighbors():
            if neighbor not in visited:
                heapq.heappush(open_list, (neighbor.heuristic(), neighbor))

    return {"success": False, "path": []}