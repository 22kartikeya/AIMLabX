from app import app, db
from flask import request, jsonify
from models import User

# ========== USER ROUTES ==========

@app.route("/api/user", methods=["GET"])
def get_user():
    user = User.query.all()
    result = [i.to_json() for i in user]
    return jsonify(result)

@app.route("/api/user", methods=["POST"])
def create_user():
    try:
        data = request.json
        required_fields = ["name", "role", "description", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f'Missing required field: {field}'}), 400

        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")

        if gender == "male":
            image_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            image_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else:
            image_url = None
        
        new_user = User(name=name, role=role, description=description, gender=gender, image_url=image_url)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User Deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<int:id>", methods=["PATCH"])
def update_friend(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        data = request.json
        user.name = data.get("name", user.name)
        user.role = data.get("role", user.role)
        user.description = data.get("description", user.description)
        user.gender = data.get("gender", user.gender)
        db.session.commit()
        return jsonify(user.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ========== ALGORITHM ROUTES ==========

# DFS/BFS for TSP
from algorithms.tsp_dfs_bfs import dfs_tsp, bfs_tsp
@app.route("/api/tsp", methods=["POST"])
def tsp_route():
    try:
        data = request.json
        graph = data.get("graph")
        start = data.get("start")
        method = data.get("method", "dfs")  # default to dfs

        if not graph or not start:
            return jsonify({"error": "Missing 'graph' or 'start' parameter"}), 400

        if method == "dfs":
            path, cost = dfs_tsp(graph, start)
        elif method == "bfs":
            path, cost = bfs_tsp(graph, start)
        else:
            return jsonify({"error": "Invalid method. Choose 'dfs' or 'bfs'."}), 400

        return jsonify({"path": path, "cost": cost}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Tic Tac Toe
# from algorithms.tic_tac_toe import best_move
# @app.route("/api/tic-tac-toe", methods=["POST"])
# def tic_tac_toe():
#     data = request.json
#     board = data.get("board")
#     player = data.get("player")
#     move = best_move(board, player)
#     return jsonify({"move": move})

# Water Jug with Hill Climbing
# from algorithms.water_jug_hill import hill_climb
# @app.route("/api/water-jug-hill", methods=["POST"])
# def water_jug_hill():
#     data = request.json
#     goal = data.get("goal")
#     steps = hill_climb(goal)
#     return jsonify({"steps": steps})

# 8 Puzzle with Greedy Best First Search
# from algorithms.eight_puzzle_greedy import greedy_bfs
# @app.route("/api/eight-puzzle-greedy", methods=["POST"])
# def eight_puzzle_greedy():
#     data = request.json
#     start = tuple(data.get("start"))
#     goal = tuple(data.get("goal"))
#     result = greedy_bfs(start, goal)
#     return jsonify(result)

# A* for Water Jug
# from algorithms.astar_water_jug import a_star_water_jug
# @app.route("/api/astar-water-jug", methods=["POST"])
# def astar_water_jug():
#     data = request.json
#     start = tuple(data.get("start"))
#     goal = tuple(data.get("goal"))
#     result = a_star_water_jug(start, goal)
#     return jsonify(result)

# A* for 8 Puzzle
# from algorithms.astar_eight_puzzle import a_star_8_puzzle
# @app.route("/api/astar-eight-puzzle", methods=["POST"])
# def astar_eight_puzzle():
#     data = request.json
#     start = tuple(data.get("start"))
#     goal = tuple(data.get("goal"))
#     result = a_star_8_puzzle(start, goal)
#     return jsonify(result)

# Marcus Resolution (Predicate Logic)
# from algorithms.predicate_resolution import resolve_marcus
# @app.route("/api/predicate-resolution", methods=["GET"])
# def predicate_resolution():
#     result = resolve_marcus()
#     return jsonify({"result": result})