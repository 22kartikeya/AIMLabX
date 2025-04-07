// import React, { useState } from 'react';
// import axios from 'axios';
// import { BACKEND_URL } from '../config';


// export default function TSP() {
//     const [method, setMethod] = useState('dfs');
//     const [graphText, setGraphText] = useState('');
//     const [start, setStart] = useState('');
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setResult(null);
//         setError('');

//         try {
//             const graph = JSON.parse(graphText);
//             const response = await axios.post(`${BACKEND_URL}/api/tsp`, { graph, start, method });
//             setResult(response.data);
//         } catch (err) {
//             setError(err.response?.data?.error || 'Something went wrong. Check your inputs.');
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
//             <h1 className="text-2xl font-bold mb-4 text-center">Travelling Salesman Problem (DFS / BFS)</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block font-medium text-gray-700">Choose Algorithm</label>
//                     <select
//                         value={method}
//                         onChange={(e) => setMethod(e.target.value)}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                         <option value="dfs">DFS</option>
//                         <option value="bfs">BFS</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block font-medium text-gray-700">Graph (in JSON format)</label>
//                     <textarea
//                         value={graphText}
//                         onChange={(e) => setGraphText(e.target.value)}
//                         rows={8}
//                         placeholder={`{
//   "A": {"B": 10, "C": 15, "D": 20},
//   "B": {"A": 10, "C": 35, "D": 25},
//   "C": {"A": 15, "B": 35, "D": 30},
//   "D": {"A": 20, "B": 25, "C": 30}
// }`}
//                         className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm p-2"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium text-gray-700">Start Node</label>
//                     <input
//                         type="text"
//                         value={start}
//                         onChange={(e) => setStart(e.target.value)}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                         placeholder="A"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
//                 >
//                     Solve
//                 </button>
//             </form>

//             {error && <p className="mt-4 text-red-600">{error}</p>}

//             {result && (
//                 <div className="mt-6 bg-gray-100 p-4 rounded-md">
//                     <h2 className="font-bold text-lg">Result:</h2>
//                     <p><strong>Path:</strong> {result.path.join(' → ')}</p>
//                     <p><strong>Total Cost:</strong> {result.cost}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function TSP() {
    const cities = ['A', 'B', 'C', 'D'];
    const [method, setMethod] = useState('dfs');
    const [start, setStart] = useState('A');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [matrix, setMatrix] = useState(() =>
        cities.reduce((acc, from) => {
            acc[from] = {};
            cities.forEach(to => {
                if (from !== to) acc[from][to] = '';
            });
            return acc;
        }, {})
    );

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

        try {
            // Convert string values to numbers
            const graph = {};
            for (let from of cities) {
                graph[from] = {};
                for (let to in matrix[from]) {
                    const val = matrix[from][to];
                    if (val !== '') {
                        graph[from][to] = parseInt(val);
                    }
                }
            }

            const response = await axios.post(`${BACKEND_URL}/api/tsp`, { graph, start, method });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Check your inputs.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Travelling Salesman Problem (DFS / BFS)</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Choose Algorithm</label>
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="dfs">DFS</option>
                        <option value="bfs">BFS</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-2">Graph Adjacency Matrix (leave blank if no edge)</label>
                    <div className="overflow-auto">
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
                                                        className="w-full border rounded px-1 py-1 text-sm"
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
                    <label className="block font-medium text-gray-700">Start Node</label>
                    <input
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="A"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
                >
                    Solve
                </button>
            </form>

            {error && <p className="mt-4 text-red-600">{error}</p>}

            {result && (
                <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <h2 className="font-bold text-lg">Result:</h2>
                    <p><strong>Path:</strong> {result.path.join(' → ')}</p>
                    <p><strong>Total Cost:</strong> {result.cost}</p>
                </div>
            )}
        </div>
    );
}