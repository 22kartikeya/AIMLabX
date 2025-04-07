import { Link } from "react-router-dom";

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Algorithms', href: '/#algorithms' },
    { name: 'Visualizations', href: '/#visualizations' },
    { name: 'About', href: '/about' },
];

export default function AppBar(){
    return(
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-500 to-black text-transparent bg-clip-text tracking-tight drop-shadow-md">AIMLabX</span>
                </a>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                        {item.name}
                    </a>
                ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <Link to="/login" className="text-sm font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </nav>
    )
}
