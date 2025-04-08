import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";
const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Algorithms', href: '/#algorithms' },
    { name: 'Visualizations', href: '/#visualizations' },
    { name: 'About', href: '/about' },
];

export function Landing(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return (
        <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
                <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white px-6 py-6 sm:max-w-sm">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">AI Experiments</span>
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                    alt=""
                                />
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="size-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link to="/login" className="text-sm font-semibold text-gray-900">
                                        Log in <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
                >
                    <div
                        className="relative left-0 top-0 h-screen w-30 rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-3xl"
                    />
                </div>
                <main className="relative isolate px-6 pt-32 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                AI Search Experiments
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Dive into classic AI problems implemented in Python with visuals
                            </p>
                        </div>

                        {/* Boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                            {[
                                { to: "/tsp", title: "DFS and BFS for Travelling Saleman Problem" },
                                { to: "/tic-tac-toe", title: "Tic Tac Toe Program" },
                                { to: "/water-jug-hill", title: "Water Jug problem using Hill climbing" },
                                { to: "/eight-puzzle-gbfs", title: "8 Puzzle problem using Greedy Best first Search" },
                                { to: "/astar-eight-puzzle", title: "A* Algorithm for Water jug and 8 Puzzle" },
                                { to: "/predicate-resolution", title: "Resolution of Marcus Problem of Predicate logic" },
                            ].map(({ to, title }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="w-full max-w-sm h-full min-h-[80px] flex flex-col justify-center rounded-xl bg-gray-800 p-6 text-center shadow-md hover:shadow-lg hover:bg-gray-700"
                                >
                                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}


