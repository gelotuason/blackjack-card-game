'use client';

import { generatedDeck, DeckProps } from "@/utils/deck";
import { useEffect, useState } from "react";

type GameRole = 'player' | 'dealer';

type ResultProps = {
    message: string
}

export default function StartGame() {
    const [deck, setDeck] = useState<DeckProps[]>(generatedDeck);
    const [playerHand, setPlayerHand] = useState<DeckProps[]>([]);
    const [dealerHand, setDealerHand] = useState<DeckProps[]>([]);
    const [playerHandValue, setPlayerHandValue] = useState<number>(0);
    const [dealerHandValue, setDealerHandValue] = useState<number>(0);
    const [playerHitCount, setPlayerHitCount] = useState<number>(0);
    const [dealerTurn, setDealerTurn] = useState<boolean>(false);
    const [result, setResult] = useState<ResultProps | null>({ message: '' });
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    const getRandomCard = (): DeckProps => {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const randomCard = deck[randomIndex];

        return randomCard;
    }

    const updateDeck = (): void => {
        const drawnCards: DeckProps[] = [...playerHand, ...dealerHand];
        const indices: number[] = [];

        drawnCards.map((card) => {
            indices.push(deck.indexOf(card));
        })

        const updatedDeck = deck.filter((_, index) => !indices.includes(index));
        setDeck(updatedDeck);
    }

    const drawCard = (gameRole: GameRole, times: number): void => {
        const drawnCards: DeckProps[] = [];

        for (let i = 1; i <= times; i++) {
            const card = getRandomCard();
            drawnCards.push(card);
        }

        if (gameRole === 'player') {
            const newPlayerHand: DeckProps[] = [...playerHand, ...drawnCards];
            setPlayerHand(newPlayerHand);
            setPlayerHandValue(calculateHandValue(newPlayerHand));
        } else {
            const newDealerHand: DeckProps[] = [...dealerHand, ...drawnCards];
            setDealerHand(newDealerHand);
            setDealerHandValue(calculateHandValue(newDealerHand));
        }
    }

    const calculateHandValue = (hand: DeckProps[]): number => {
        const constantRanks = ['J', 'Q', 'K'];
        const constantRanksValue = 10;
        const aceValues = [1, 11];

        let handValue = 0;

        if (hand.length !== 0) {
            hand.map(card => {
                if (constantRanks.includes(card.rank)) {
                    handValue += constantRanksValue;
                } else if (card.rank == 'A') {
                    if (handValue <= 10) handValue += aceValues[1];
                    else handValue += aceValues[0];
                } else {
                    handValue += parseInt(card.rank);
                }
            });
        }

        return handValue;
    }

    const handlePlayerHit = () => {
        drawCard('player', 1);
        setPlayerHitCount(prevCount => prevCount + 1);
    }

    const handleStand = () => setDealerTurn(true);

    useEffect(() => {
        if (playerHand.length === 0 && dealerHand.length === 0) {
            drawCard('player', 2);
            drawCard('dealer', 1);
        }

        updateDeck();
    }, [playerHand, dealerHand]);

    useEffect(() => {
        const checkResult = (): boolean | null => {
            if (playerHandValue > 21 || playerHandValue === 21) return true;
            if (playerHitCount >= 4) setDealerTurn(true);
            return false;
        }

        const resultFound = checkResult();
        if (resultFound) setIsGameOver(resultFound);
    }, [playerHitCount, playerHandValue]);

    useEffect(() => {
        const checkResult = (): boolean => {
            if (dealerTurn) {
                if (
                    dealerHandValue > 21 ||
                    dealerHandValue === 21 ||
                    dealerHandValue > playerHandValue ||
                    dealerHandValue >= 17
                ) return true;
                else drawCard('dealer', 1);
            }

            return false;
        }

        const resultFound = checkResult();
        if (resultFound) setIsGameOver(resultFound);
    }, [dealerHandValue, dealerTurn]);

    useEffect(() => {
        const determineResult = (): ResultProps | any => {
            switch (isGameOver) {
                case playerHandValue > 21:
                    return { message: 'Player busts. Dealer wins!' };
                case dealerHandValue > 21:
                    return { message: 'Dealer busts. Player wins!' };
                case playerHandValue === 21:
                    return { message: 'Player wins with a Blackjack!' };
                case dealerHandValue === 21:
                    return { message: 'Dealer wins with a Blackjack!' };
                case playerHandValue > dealerHandValue:
                    return { message: 'Player wins!' };
                case playerHandValue < dealerHandValue:
                    return { message: 'Dealer wins!' };
                default:
                    return { message: `It's a tie!` };
            }
        }

        const gameOverResult = determineResult();
        if (gameOverResult) setResult(gameOverResult);
    }, [isGameOver]);

    return (
        <main className="flex flex-col items-center p-10 h-full space-y-52">
            <p>{deck.length}</p>
            {isGameOver && <p>{result?.message}</p>}
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
                <button onClick={handlePlayerHit} disabled={isGameOver || playerHitCount >= 4} className="bg-orange-500 w-24 py-1 rounded-md">Hit</button>
                <button onClick={handleStand} disabled={isGameOver} className="bg-gray-500 w-24 py-1 rounded-md">Stand</button>
            </div>
        </main>
    )
}