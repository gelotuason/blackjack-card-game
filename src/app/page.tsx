'use client';

import Game from "./components/Game";
export default function Home() {

  return (
    <main className="h-screen max-w-[1220px] mx-auto p-10">
      <h1 className="text-center text-3xl font-bold">Blackjack</h1>
      <Game />
    </main>
  );
}
