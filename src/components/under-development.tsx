export function UnderDevelopment() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    🚧 Em Desenvolvimento 🚧
                </h1>
                <p className="text-gray-600 mb-4">
                    Esta funcionalidade está em desenvolvimento e estará disponível em
                    breve. Agradecemos sua paciência!
                </p>
                {/* <div className="animate-bounce">
                    <svg
                        className="w-12 h-12 mx-auto text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div> */}
            </div>
        </div>
    )
}