from app import app, db
from flask import request, jsonify
from models import User

# get all users
@app.route("/api/user", methods=["GET"])
def get_user():
    user = User.query.all()
    result = [i.to_json() for i in user]
    return jsonify(result) # default status code is 200

# create a user
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
        return jsonify({"msg": "User created successfully"}),201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# delete a user
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
    
# update user
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