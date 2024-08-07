'use client';

import { cardDeck, DeckProps } from "@/utils/deck";
import { useEffect, useState } from "react";

type GameRole = 'player' | 'dealer';

export default function StartGame() {
    const [deck, setDeck] = useState<DeckProps[]>(cardDeck);
    const [playerHand, setPlayerHand] = useState<DeckProps[]>([]);
    const [dealerHand, setDealerHand] = useState<DeckProps[]>([]);
    const [playerHandValue, setPlayerHandValue] = useState<number>(0);
    const [dealerHandValue, setDealerHandValue] = useState<number>(0);

    // game flow states
    const [newGame, setNewGame] = useState<Boolean>(true);

    useEffect(() => {
        if (newGame && playerHand.length === 0 && dealerHand.length === 0) {
            drawCard('player', 2);
            drawCard('dealer', 1);
        }
    }, []);

    useEffect(() => {
        countCardsInDeck();
        calculateHandValue();
    }, [playerHand, dealerHand]);

    const getRandomCard = (): DeckProps => {
        const randomIndex = Math.floor(Math.random() * cardDeck.length);
        const randomCard = deck[randomIndex];

        return randomCard;
    }

    const drawCard = (gameRole: GameRole, times: number): void => {
        const card: DeckProps[] = [];

        for (let i = 1; i <= times; i++) {
            card.push(getRandomCard());
        }

        gameRole == 'player' ? setPlayerHand([...playerHand, ...card]) : setDealerHand([...dealerHand, ...card]);
    }

    const calculateHandValue = () => {
        const constantRanks = ['J', 'Q', 'K'];
        const constantRanksValue = 10;
        const aceValues = [1, 11];

        playerHand.map(card => {
            if (constantRanks.includes(card.rank)) {
                setPlayerHandValue(prev => prev + constantRanksValue)
            } else if (card.rank == 'A') {
                if (playerHandValue <= 10) setPlayerHandValue(prev => prev + aceValues[1]);
                else setPlayerHandValue(prev => prev + aceValues[0]);
            } else {
                setPlayerHandValue(prev => prev + parseInt(card.rank));
            }
        });

        dealerHand.map(card => {
            if (constantRanks.includes(card.rank)) {
                setDealerHandValue(prev => prev + constantRanksValue)
            } else if (card.rank == 'A') {
                if (dealerHandValue <= 10) setDealerHandValue(prev => prev + aceValues[1]);
                else setDealerHandValue(prev => prev + aceValues[0]);
            } else {
                setDealerHandValue(prev => prev + parseInt(card.rank));
            }
        });
    }

    const countCardsInDeck = () => {
        const drawedCard = [...playerHand, ...dealerHand];
        const newDeck = deck.filter(card => !drawedCard.includes(card));
        setDeck(newDeck);
    }

    return (
        <main className="flex flex-col items-center p-10 h-full space-y-52">
            <p>{deck.length}</p>
            <div className="space-y-52">
                <div>
                    <h1>Dealer: {dealerHandValue}</h1>
                    {
                        dealerHand.map((value, index) => (
                            <div key={index}>
                                <p>{value.rank}</p>
                                <p>{value.suit}</p>
                            </div>
                        ))
                    }
                </div>

                <div>
                    <h1>Player: {playerHandValue}</h1>
                    {
                        playerHand.map((value, index) => (
                            <div key={index}>
                                <p>{value.rank}</p>
                                <p>{value.suit}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="space-x-3">
                <button onClick={() => drawCard('player', 1)} className="bg-orange-500 w-24 py-1 rounded-md">Hit</button>
                <button className="bg-gray-500 w-24 py-1 rounded-md">Stand</button>
            </div>
        </main>
    )
}