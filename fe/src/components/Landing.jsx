import { Link } from "react-router-dom";

export function Landing() {
    return (
        <div className="relative isolate px-6 pt-10 pb-6 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
            >
                <div className="relative left-0 top-0 h-[600px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
            </div>
            <main className="relative isolate mx-auto max-w-7xl min-h-[calc(100vh-160px)] flex flex-col justify-center">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        AI / ML Experiments
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Dive into classic AI problems implemented in Python with visuals
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center z-10">
                    {[
                        { to: "/tsp", title: "DFS and BFS for Travelling Saleman Problem" },
                        { to: "/tic-tac-toe", title: "Tic Tac Toe Program" },
                        { to: "/water-jug-hill", title: "Water Jug problem using Hill climbing" },
                        { to: "/eight-puzzle-gbfs", title: "8 Puzzle problem using Greedy Best first Search" },
                        { to: "/astar-eight-puzzle", title: "A* Algorithm for Water jug and 8 Puzzle" },
                        { to: "/marcus-resolver", title: "Resolution of Marcus Problem of Predicate logic" },
                    ].map(({ to, title }) => (
                        <Link
                            key={to}
                            to={to}
                            className="relative group w-full max-w-sm h-full min-h-[100px] flex flex-col justify-center items-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl transition-transform hover:scale-[1.03] text-center p-6 overflow-hidden"
                        >
                            <div className="absolute inset-0 rounded-2xl z-[-1] bg-gradient-to-r from-pink-400 via-indigo-400 to-blue-300 opacity-0 group-hover:opacity-100 blur-md animate-spin-slow"></div>
                            <div className="absolute inset-0 m-[2px] rounded-[16px] z-[-1] bg-white/30 backdrop-blur-xl" />
                            <h2 className="text-lg font-semibold text-black z-10">{title}</h2>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}