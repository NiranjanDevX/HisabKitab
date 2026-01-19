import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative w-full h-full flex items-center justify-center text-4xl font-bold border-2 border-primary-500/30 rounded-full">
                        404
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold mb-2">Page not found</h1>
                    <p className="text-zinc-400">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-medium"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
