import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-normal p-24 bg-white">
      <h1 className="text-6xl font-bold text-center mb-8">Welcome to Schedule Snake!</h1>
      <div className="flex flex-col items-center space-y-4">
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white justify-center font-bold py-2 px-4 rounded"
          >
            <Link href="/pages/sign-up">Click to make an account!</Link> 
          </button>
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white justify-center font-bold py-2 px-4 rounded"
          >
          <Link href="/pages/sign-in">Click to sign in!</Link>
          </button>
        </div>
      </div>
    </main>
  );
}
