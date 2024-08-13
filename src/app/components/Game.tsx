'use client';

import { generatedDeck, DeckProps } from "@/utils/deck";
import { useEffect, useState } from "react";
import { Card, CardHidden } from "./Card";
import Bet from "./Bet";
import ActionButton from "./ActionButton";
import { motion } from "framer-motion";

type GameRole = 'player' | 'dealer';

type PlayerProps = {
    bet: number
    balance: number
}
type ResultProps = { message: string };

const playerInitialState = {
    bet: 0,
    balance: 50000
}

export default function Game() {
    const [deck, setDeck] = useState<DeckProps[]>(generatedDeck);
    const [playerHand, setPlayerHand] = useState<DeckProps[]>([]);
    const [dealerHand, setDealerHand] = useState<DeckProps[]>([]);
    const [playerHandValue, setPlayerHandValue] = useState<number>(0);
    const [dealerHandValue, setDealerHandValue] = useState<number>(0);
    const [playerHitCount, setPlayerHitCount] = useState<number>(0);
    const [isDealersTurn, setIsDealersTurn] = useState<boolean>(false);
    const [result, setResult] = useState<ResultProps>({ message: '' });
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [player, setPlayer] = useState<PlayerProps>(playerInitialState);
    const [isDeal, setIsDeal] = useState<boolean>(false);

    const addBet = (chipValue: number): void => {
        if (player.balance - chipValue >= 0)
            setPlayer({
                balance: player.balance - chipValue,
                bet: player.bet + chipValue
            })
        else alert('Insufficient balance!');
    }

    const handleDeal = (): void => {
        if (player.bet === 0) alert('Please add your bet');
        else setIsDeal(prevState => !prevState);
    }

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
        if (isDeal && playerHand.length === 0 && dealerHand.length === 0) {
            drawCard('player', 2);
            drawCard('dealer', 1);
        }

        updateDeck();
    }, [isDeal, playerHand, dealerHand]);

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
        <main className="h-full grid content-center gap-10">
            <h1 className="absolute inset-x-0 top-28 text-4xl text-center animate-pulse">{result.message}</h1>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 place-items-center">
                <div className="space-y-14">
                    <div>
                        <motion.h1
                            className="flex justify-center mb-2"
                            initial={{ scale: 0, x: -500 }}
                            animate={{ scale: 1, x: 0 }}
                        >
                            Dealer: {isDeal ? dealerHandValue : 0}
                        </motion.h1>
                        <div className="flex -space-x-8">
                            {isDeal ?
                                dealerHand.map((value, index) => (
                                    <Card isDeal={isDeal} cardRank={value.rank} cardSuit={value.suit} index={index} />
                                ))
                                :
                                <CardHidden />
                            }
                        </div>
                    </div>

                    <div>
                        <motion.h1
                            className="flex justify-center mb-2"
                            initial={{ scale: 0, x: -500 }}
                            animate={{ scale: 1, x: 0 }}
                        >
                            Player: {isDeal ? playerHandValue : 0}
                        </motion.h1>
                        <div className="flex -space-x-8">
                            {isDeal ?
                                playerHand.map((value, index) => (
                                    <Card isDeal={isDeal} cardRank={value.rank} cardSuit={value.suit} index={index} />
                                ))
                                :
                                <>
                                    <CardHidden />
                                    <CardHidden />
                                </>
                            }
                        </div>
                    </div>
                </div>


                <Bet
                    playerBet={player.bet}
                    playerBalance={player.balance}
                    addBet={(chipValue) => addBet(chipValue)}
                    handleDeal={handleDeal}
                    isDeal={isDeal}
                />

                <div className="space-x-3">
                    <ActionButton isDeal={isDeal} handleClick={handlePlayerHit} disabled={isGameOver || playerHitCount >= 4} background="bg-orange-500">Hit</ActionButton>
                    <ActionButton isDeal={isDeal} handleClick={handleStand} disabled={isGameOver} background="bg-slate-400">Stand</ActionButton>
                </div>
            </section>
        </main>

    )
}