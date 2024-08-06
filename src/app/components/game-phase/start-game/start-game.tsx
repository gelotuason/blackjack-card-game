'use client';

import { cardDeck, DeckProps } from "@/utils/deck";
import { useEffect, useState } from "react"

export default function StartGame() {
    const [playerHand, setPlayerHand] = useState<DeckProps[]>([]);
    const [dealerHand, setDealerHand] = useState<DeckProps[]>([]);

    const getRandomCard = (): DeckProps => {
        const randomCard = Math.floor(Math.random() * cardDeck.length);

        return cardDeck[randomCard];
    }

    useEffect(() => {
        setPlayerHand([getRandomCard(), getRandomCard()]);
    }, []);

    return (
        <main className="flex flex-col items-center p-10 h-full space-y-52">
            <div className="space-y-52">
                <div>
                    <h1>Dealer</h1>
                    {
                        dealerHand.map((value) => (
                            <>
                                <p>{value.rank}</p>
                                <p>{value.suit}</p>
                            </>
                        ))
                    }
                </div>

                <div>
                    <h1>Player</h1>
                    {
                        playerHand.map((value) => (
                            <>
                                <p>{value.rank}</p>
                                <p>{value.suit}</p>
                            </>
                        ))
                    }
                </div>
            </div>

            <div className="space-x-3">
                <button className="bg-orange-500 w-24 py-1 rounded-md">Hit</button>
                <button className="bg-gray-500 w-24 py-1 rounded-md">Stand</button>
            </div>
        </main>
    )
}