import React from "react";

const About = () => {
    return (
        <div className="relative isolate px-6 pt-10 pb-6 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
            >
                <div className="relative left-0 top-0 h-[700px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
            </div>
            <div className="relative mx-auto max-w-4xl text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-500 to-black">AIMLabX</span>
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
                    AIMLabX is a revolutionary platform that transforms complex classical AI and machine learning concepts into tangible realities. Through interactive visualizations and an intuitive interface, you can actively explore foundational algorithms, experiment with their parameters, and truly understand how they work – all in an engaging and accessible environment.
                </p>
            </div>
            <div className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 z-10">
                {[
                    {
                        title: "Interactive Visualizations",
                        desc: "Visualize complex algorithms like A*, Greedy Best First Search, DFS, and BFS through dynamic interfaces. Understand each step in real-time with clear graphical feedback.",
                    },
                    {
                        title: "Classic AI Problems",
                        desc: "Dive into problems like the Water Jug challenge, Tic Tac Toe, 8 Puzzle Solver, and Marcus Logic Resolution — all brought to life with easy-to-follow animations.",
                    },
                    {
                        title: "Hands-on Learning",
                        desc: "Interact with the algorithms, tweak the inputs, and observe how outcomes vary. This hands-on approach helps you deeply grasp the logic and flow of AI processes.",
                    },
                    {
                        title: "Accessible & Open Source",
                        desc: "AIMLabX is fully open source and built for students, educators, and developers. Easily deploy it or contribute to extend the experiments further.",
                    },
                ].map(({ title, desc }) => (
                    <div
                        key={title}
                        className="p-6 rounded-2xl bg-white/35 backdrop-blur-xl border border-white/20 shadow-2xl transition hover:scale-[1.03] hover:shadow-purple-300/30"
                    >
                        <h3 className="text-xl font-semibold mb-3 text-black">{title}</h3>
                        <p className="text-gray-800 leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>
            <div className="relative mx-auto text-center mt-16 max-w-2xl">
                <p className="text-gray-600">
                    Whether you're a student exploring AI for the first time or a developer brushing up on fundamentals,
                    <span className="font-semibold text-gray-900"> AIMLabX </span>
                    makes learning intelligent systems approachable and exciting.
                </p>
            </div>
        </div>
    );
};

export default About;