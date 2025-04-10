import { Link } from "react-router-dom";

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Algorithms', href: '/algorithms' },
    { name: 'About', href: '/about' },
];

export default function AppBar() {
    return (
        <nav aria-label="Global" className="flex flex-wrap items-center justify-between gap-y-4 p-6 lg:px-8">
            <div className="flex flex-1">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-500 to-black text-transparent bg-clip-text tracking-tight drop-shadow-md">
                    AIMLabX
                </span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 w-full sm:w-auto">
                {navigation.map((item) => (
                    <Link key={item.name} to={item.href} className="text-sm font-semibold text-gray-900">
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="flex justify-end flex-1">
                <Link to="/login" className="text-sm font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </nav>
    );
}