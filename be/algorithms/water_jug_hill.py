class WaterJugHillClimbing:
    def __init__(self, start, capacity_x, capacity_y, goal):
        self.capacity_x = capacity_x
        self.capacity_y = capacity_y
        self.goal = goal
        self.path = [start]

    def get_next_states(self, state):
        x, y = state
        possible_states = set()
        possible_states.add((self.capacity_x, y))  # Fill X
        possible_states.add((x, self.capacity_y))  # Fill Y
        possible_states.add((0, y))                # Empty X
        possible_states.add((x, 0))                # Empty Y
        pour_x_to_y = min(x, self.capacity_y - y)
        possible_states.add((x - pour_x_to_y, y + pour_x_to_y))
        pour_y_to_x = min(y, self.capacity_x - x)
        possible_states.add((x + pour_y_to_x, y - pour_y_to_x))
        return list(possible_states)

    def heuristic(self, state):
        return -abs(self.goal[0] - state[0]) - abs(self.goal[1] - state[1])

    def solve(self, start):
        current_state = start
        visited = set([current_state])

        while True:
            next_states = [s for s in self.get_next_states(current_state) if s not in visited]
            if not next_states:
                return self.path
            next_states.sort(key=self.heuristic, reverse=True)
            best_next = next_states[0]

            if self.heuristic(best_next) <= self.heuristic(current_state):
                return self.path

            visited.add(best_next)
            current_state = best_next
            self.path.append(current_state)

            if current_state == self.goal:
                return self.path