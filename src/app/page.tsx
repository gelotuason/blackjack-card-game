'use client';

import { useState } from "react";
import Game from "./components/Game";
import Bet from "./components/Bet";

// type PlayerProps = {
//   bet: number
//   balance: number
// }

// const initialState = {
//   bet: 0,
//   balance: 50000
// }
export default function Home() {
  // const [player, setPlayer] = useState<PlayerProps>(initialState);
  // const [isDeal, setIsDeal] = useState<boolean>(false);

  // const addBet = (chipValue: number): void => {
  //   if (player.balance - chipValue >= 0)
  //     setPlayer({
  //       balance: player.balance - chipValue,
  //       bet: player.bet + chipValue
  //     })
  //   else alert('Insufficient balance!');
  // }

  // const handleDeal = (): void => {
  //   if (player.bet === 0) alert('Please add your bet'); 
  //   else setIsDeal(prevState => !prevState);
  // }

  return (
    <main className="h-screen max-w-[1220px] mx-auto p-10">
      <Game />
    </main>
  );
}
