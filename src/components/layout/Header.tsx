import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Retirement Calculator
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-sm hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
