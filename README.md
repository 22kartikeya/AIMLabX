# 🧠 AI/ML Experiments Playground

An interactive visualizer for classic AI problems like **TSP**, **Tic Tac Toe**, **Water Jug**, **8 Puzzle**, and **Predicate Logic Resolution** — all in one platform built with **React + Flask**.

---

## 📚 Table of Contents

- ⚙️ Tech Stack
- 🚀 Features
- 🧪 AI/ML Problems Included
- 🛠️ Run Locally
- 🌐 Deployment
- 📸 Screenshots
- 🙌 Credits
- 📜 License

---

## ⚙️ Tech Stack

- **Frontend**: ReactJS, Tailwind CSS, Framer Motion
- **Backend**: Python Flask, NLTK, Custom AI algorithms
- **Others**: REST APIs, Axios, Glassmorphism UI

---

## 🚀 Features

- 🎯 Visualize AI algorithms in real-time
- 🧠 Understand core concepts like DFS, BFS, Minimax, A*, etc.
- 📊 Solve logic problems with a Predicate Resolver (NLTK)
- 🎨 Elegant and animated UI (with hover effects and glass blur)
- 📱 Fully responsive design

---

## 🧪 AI/ML Problems Included

- ✔️ **DFS and BFS** for Travelling Salesman Problem
- ✔️ **Tic Tac Toe** (PvP and Vs Computer with Minimax)
- ✔️ **Water Jug** Problem using Hill Climbing
- ✔️ **8 Puzzle** using Greedy Best First Search
- ✔️ **A\*** Algorithm for 8 Puzzle and Water Jug
- ✔️ **Marcus Logic Resolver** using NLTK's Predicate Logic

---

### Run the App Locally

1. Clone the repository:

```bash
git clone https://github.com/22kartikeya/AIMLabX.git
```

2. Navigate to the project directory:

```bash
cd AIMLabX
```

3. Navigate to the backend directory:

```bash
cd be
```

4. Create a virtual environment:

-   On macOS and Linux:

```bash
python3 -m venv venv
```

-   On Windows:

```bash
python -m venv venv
```

5. Activate the virtual environment:

-   On macOS and Linux:

```bash
source venv/bin/activate
```

-   On Windows:

```bash
venv\Scripts\activate
```

6. Install the dependencies:

-   On macOS and Linux:

```bash
pip3 install -r requirements.txt
```

-   On Windows:

```bash
pip install -r requirements.txt
```

7. Navigate to the frontend directory:

```bash
cd ../fe
```

8. Install the dependencies:

```bash
npm install
```

9. Configure API URL:


Create a `config.js` file inside the `frontend/src` folder to store the backend API URL.

```js
export const BACKEND_URL = " ";
```

10. Build the frontend:

```bash
npm run build
```

11. Navigate to the backend directory:

```bash
cd ../be
```

12. Run the Flask app:

```bash
flask run
```

13. Open your browser and go to `http://localhost:5173/` to view the app.