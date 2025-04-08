import heapq

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


def greedy_best_first_search(start, goal):
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