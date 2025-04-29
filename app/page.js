import Link from "next/link";
import { MainMenu } from "./Admin/components/MainMenu";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Continue As</h1>
      <div className="flex gap-8 w-full justify-center items-center">
        <Link
          href="/Admin"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Admin
        </Link>
        <Link
          href="/User"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          User
        </Link>
      </div>
    </div>
  );
}
