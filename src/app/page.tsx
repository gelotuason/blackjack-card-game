'use client';

import Game from "./components/Game";
export default function Home() {

  return (
    <main className="h-screen max-w-[1220px] mx-auto p-10 relative">
      <h1 className="text-center text-4xl font-bold mb-10 md:mb-0">Blackjack</h1>
      <Game />
    </main>
  );
}
