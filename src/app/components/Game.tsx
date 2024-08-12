'use client';

import { generatedDeck, DeckProps } from "@/utils/deck";
import { useEffect, useState } from "react";
import Card from "./Card";

type GameRole = 'player' | 'dealer';

type ResultProps = { message: string }

export default function Game() {
    const [deck, setDeck] = useState<DeckProps[]>(generatedDeck);
    const [playerHand, setPlayerHand] = useState<DeckProps[]>([]);
    const [dealerHand, setDealerHand] = useState<DeckProps[]>([]);
    const [playerHandValue, setPlayerHandValue] = useState<number>(0);
    const [dealerHandValue, setDealerHandValue] = useState<number>(0);
    const [playerHitCount, setPlayerHitCount] = useState<number>(0);
    const [isDealersTurn, setIsDealersTurn] = useState<boolean>(false);
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
            setPlayerHandValue(handleHandValue(newPlayerHand));
        } else {
            const newDealerHand: DeckProps[] = [...dealerHand, ...drawnCards];
            setDealerHand(newDealerHand);
            setDealerHandValue(handleHandValue(newDealerHand));
        }
    }

    const handleHandValue = (hand: DeckProps[]): number => {
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

    const handleStand = () => setIsDealersTurn(true);

    useEffect(() => {
        if (playerHand.length === 0 && dealerHand.length === 0) {
            drawCard('player', 2);
            drawCard('dealer', 1);
        }

        updateDeck();
    }, [playerHand, dealerHand]);

    useEffect(() => {
        const checkResult = (): boolean => {
            if (playerHandValue > 21 || playerHandValue === 21) return true;
            if (playerHitCount >= 4) setIsDealersTurn(true);
            return false;
        }

        const isResultFound = checkResult();
        if (isResultFound) setIsGameOver(isResultFound);
    }, [playerHitCount, playerHandValue]);

    useEffect(() => {
        const checkResult = (): boolean => {
            if (isDealersTurn) {
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

        const isResultFound = checkResult();
        if (isResultFound) setIsGameOver(isResultFound);
    }, [dealerHandValue, isDealersTurn]);

    useEffect(() => {
        const determineResult = (): ResultProps | any => {
            if (isGameOver) {
                if (playerHandValue > 21) return { message: 'Player busts. Dealer wins!' };
                else if (dealerHandValue > 21) return { message: 'Dealer busts. Player wins!' };
                else if (playerHandValue === 21) return { message: 'Player wins with a Blackjack!' };
                else if (dealerHandValue === 21) return { message: 'Dealer wins with a Blackjack!' };
                else if (playerHandValue > dealerHandValue) return { message: 'Player wins!' };
                else if (playerHandValue < dealerHandValue) return { message: 'Dealer wins!' };
                else return { message: `It's a tie!` };
            }
        }

        const gameOverResult = determineResult();
        if (gameOverResult) setResult(gameOverResult);
    }, [isGameOver]);

    return (
        <main className="flex flex-col items-center justify-center p-10 h-full space-y-24">
            {isGameOver && <p>{result?.message}</p>}
            <div className="space-y-14">
                <div>
                    <h1 className="mb-2">Dealer: {dealerHandValue}</h1>
                    <div className="flex -space-x-8">
                        {
                            dealerHand.map((value, index) => (
                                <Card cardRank={value.rank} cardSuit={value.suit} index={index} />
                            ))
                        }
                    </div>
                </div>

                <div>
                    <h1 className="mb-2">Player: {playerHandValue}</h1>
                    <div className="flex -space-x-8">
                        {
                            playerHand.map((value, index) => (
                                <Card cardRank={value.rank} cardSuit={value.suit} index={index} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="space-x-3">
                <button onClick={handlePlayerHit} disabled={isGameOver || playerHitCount >= 4} className="bg-orange-500 w-24 py-1 rounded-md">Hit</button>
                <button onClick={handleStand} disabled={isGameOver} className="bg-gray-500 w-24 py-1 rounded-md">Stand</button>
            </div>
        </main>
    )
}