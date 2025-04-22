import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import { BACKEND_URL } from '../config';

export default function TSP() {
    const cities = ['A', 'B', 'C', 'D'];
    const [method, setMethod] = useState('dfs');
    const [start, setStart] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [resolving, setResolving] = useState(false);
    const [matrix, setMatrix] = useState(() =>
        cities.reduce((acc, from) => {
            acc[from] = {};
            cities.forEach(to => {
                if (from !== to) acc[from][to] = '';
            });
            return acc;
        }, {})
    );

    // Function to generate nodes and edges for the graph - showing only the final path
    const generateGraphData = (matrix, resultPath = []) => {
        const nodePositions = {
            A: { x: 100, y: 50 },
            B: { x: 300, y: 50 },
            C: { x: 100, y: 200 },
            D: { x: 300, y: 200 },
        };

        // All nodes should still be visible
        const nodes = Object.keys(matrix).map(city => ({
            id: city,
            data: { label: city },
            position: nodePositions[city],
            style: {
                background: resultPath.includes(city) ? '#a5b4fc' : '#fff',
                border: '2px solid #6366f1',
                padding: 10,
                borderRadius: 10,
                width: 50,
                height: 50,
            }
        }));

        const edges = [];

        // Only include edges that are part of the solution path
        for (let i = 0; i < resultPath.length - 1; i++) {
            const from = resultPath[i];
            const to = resultPath[i + 1];

            if (matrix[from] && matrix[from][to] !== '') {
                edges.push({
                    id: `${from}-${to}`,
                    source: from,
                    target: to,
                    label: matrix[from][to],
                    animated: true,
                    style: {
                        stroke: '#10b981',
                        strokeWidth: 2,
                    },
                    labelStyle: {
                        fill: '#374151',
                        fontWeight: 600,
                        fontSize: 12,
                    }
                });
            }
        }

        // Add the final edge to close the loop (if path is complete)
        if (resultPath.length > 2) {
            const from = resultPath[resultPath.length - 1];
            const to = resultPath[0];

            if (matrix[from] && matrix[from][to] !== '') {
                edges.push({
                    id: `${from}-${to}`,
                    source: from,
                    target: to,
                    label: matrix[from][to],
                    animated: true,
                    style: {
                        stroke: '#10b981',
                        strokeWidth: 2,
                        strokeDasharray: '5,5', // Dashed line for the return path
                    },
                    labelStyle: {
                        fill: '#374151',
                        fontWeight: 600,
                        fontSize: 12,
                    }
                });
            }
        }

        return { nodes, edges };
    };

    const handleInputChange = (from, to, value) => {
        setMatrix(prev => ({
            ...prev,
            [from]: {
                ...prev[from],
                [to]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setError('');
        setResolving(true);

        if (!cities.includes(start)) {
            setResolving(false);
            setError(`Start node must be one of: ${cities.join(', ')}`);
            return;
        }

        for (let from of cities) {
            for (let to of cities) {
                if (from !== to && matrix[from][to] === '') {
                    setResolving(false);
                    setError(`Please fill all distance fields between ${from} and ${to}.`);
                    return;
                }
            }
        }

        try {
            const graph = {};
            for (let from of cities) {
                graph[from] = {};
                for (let to in matrix[from]) {
                    graph[from][to] = parseInt(matrix[from][to], 10);
                }
            }

            const response = await axios.post(`${BACKEND_URL}/api/tsp`, { graph, start, method });
            setTimeout(() => {
                setResult(response.data);
                setResolving(false);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Check your inputs.');
            setResolving(false);
        }
    };

    // Generate graph data for visualization
    const graphData = result ? generateGraphData(matrix, result.path) : { nodes: [], edges: [] };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative isolate px-6 pt-2 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
            >
                <div className="relative left-0 top-0 h-[700px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-xl p-6 z-10"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Travelling Salesman Problem (DFS / BFS)</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Choose Algorithm</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1"
                        >
                            <option value="dfs">DFS</option>
                            <option value="bfs">BFS</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">Graph Adjacency Matrix</label>
                        <div className="overflow-auto rounded-md border border-gray-300 bg-white/80 backdrop-blur-sm">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {cities.map(to => (
                                            <th key={to} className="border px-3 py-2">{to}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cities.map(from => (
                                        <tr key={from}>
                                            <th className="border px-3 py-2">{from}</th>
                                            {cities.map(to => (
                                                <td key={to} className="border px-2 py-1">
                                                    {from === to ? (
                                                        "-"
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={matrix[from][to] || ''}
                                                            onChange={(e) => handleInputChange(from, to, e.target.value)}
                                                            className="w-full border rounded px-2 py-1 text-sm text-center"
                                                        />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700">Start Node</label>
                        <input
                            type="text"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1"
                            placeholder="A"
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-48 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
                        >
                            Solve
                        </button>
                    </div>
                </form>
                {resolving && (
                    <motion.p
                        className="mt-4 text-gray-700 font-medium animate-pulse text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Resolving...
                    </motion.p>
                )}

                {error && <p className="mt-4 text-red-800 text-center font-medium">{error}</p>}

                {result && (
                    <motion.div
                        className="mt-6 rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="font-bold text-lg text-gray-800">Result:</h2>
                        <p><strong>Path:</strong> {result.path.join(' → ')}</p>
                        <p><strong>Total Cost:</strong> {result.cost}</p>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        className="mt-10 h-[400px] bg-white rounded-lg shadow border border-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="font-bold text-center py-2 text-gray-800">Optimal Path Visualization</h3>
                        <div style={{ width: '100%', height: '350px' }}>
                            <ReactFlow
                                nodes={graphData.nodes}
                                edges={graphData.edges}
                                nodesDraggable={false}
                                nodesConnectable={false}
                                fitView
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}