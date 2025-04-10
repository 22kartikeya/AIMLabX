from itertools import permutations

def dfs_tsp(graph, start):
    min_cost = float('inf')
    best_path = []

    def dfs(current, visited, path, cost):
        nonlocal min_cost, best_path
        if len(visited) == len(graph):
            total_cost = cost + graph[current][start]
            if total_cost < min_cost:
                min_cost = total_cost
                best_path = path + [start]
            return

        for neighbor in graph[current]:
            if neighbor not in visited:
                dfs(neighbor, visited | {neighbor}, path + [neighbor], cost + graph[current][neighbor])

    dfs(start, {start}, [start], 0)
    return best_path, min_cost


def bfs_tsp(graph, start):
    min_path = []
    min_cost = float('inf')
    for perm in permutations(graph.keys()):
        if perm[0] == start:
            cost = 0
            for i in range(len(perm) - 1):
                cost += graph[perm[i]][perm[i + 1]]
            cost += graph[perm[-1]][start]
            if cost < min_cost:
                min_cost = cost
                min_path = list(perm) + [start]
    return min_path, min_cost