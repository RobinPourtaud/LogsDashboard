import { MountainSnow } from "lucide-react";
import Link from "next/link";

export default function MainNav() {
    return (
        <header className="flex h-16 items-center border-b bg-card px-4 sm:px-6">
            <nav className="flex items-center gap-6 text-sm font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                    <MountainSnow className="h-6 w-6" />
                    <span className="sr-only">Dashboard</span>
                </Link>
                <Link href="/" className="text-foreground hover:underline" prefetch={false}>
                    Home
                </Link>
                <Link href="/dash" className="text-foreground hover:underline" prefetch={false}>
                    Dashboard
                </Link>
                <Link href="/settings" className="text-foreground hover:underline" prefetch={false}>
                    Settings
                </Link>
            </nav>
            <div className="ml-auto flex items-center gap-4">
                <Link href="https://github.com/RobinPourtaud" className="text-foreground hover:underline" prefetch={false}>
                    Github
                </Link>
            </div>
        </header>
    );
}
