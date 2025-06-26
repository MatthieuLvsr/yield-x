import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PhantomConnectButton } from "@/components/PhantomConnectButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#18181b] dark:via-[#312e81] dark:to-[#0f172a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/next.svg" alt="Logo" />
            <AvatarFallback>YX</AvatarFallback>
          </Avatar>
          <span className="font-bold text-xl tracking-tight text-primary">
            YieldX
          </span>
        </div>
        <PhantomConnectButton />
      </header>
      {/* Main Card */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 dark:bg-black/60 shadow-2xl border-0 p-8 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to YieldX
            </CardTitle>
          </CardHeader>
          <p className="text-center text-lg text-muted-foreground mt-4 mb-8">
            Explore DeFi strategies with a beautiful, modern interface inspired by{" "}
            <span className="font-semibold text-indigo-500">rainbow.me</span>.
          </p>
        </Card>
      </main>
      {/* Footer */}
      <footer className="flex justify-center items-center py-6 text-xs text-muted-foreground">
        Inspired by{" "}
        <a
          href="https://rainbow.me"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 underline text-indigo-500"
        >
          rainbow.me
        </a>
      </footer>
    </div>
  );
}
