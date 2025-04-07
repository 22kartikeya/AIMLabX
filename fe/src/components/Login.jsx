export default function Login() {
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl -z-10"
                >
                    <div
                        className="relative left-0 top-0 h-screen w-30 rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-40 blur-3xl"
                    />
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <a href="#" className="-m-1.5 p-1.5 inline-block">
                        <span className="h-10 w-auto text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-500 to-black text-transparent bg-clip-text tracking-tight drop-shadow-md">
                            AIMLabX
                        </span>
                    </a>
                    <h2 className="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        New to this?{' '}
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </a>
                    </p>
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
                    >
                    </div>
                </div>
            </div>
        </>
    )
}