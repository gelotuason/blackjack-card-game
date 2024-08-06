export type DeckProps = {
    suit: string
    rank: string
}

const suits: string[] = ['♠', '♥', '♣', '♦'];
const ranks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const cardDeck: DeckProps[] = suits.flatMap((suit) =>
    ranks.map((rank) => {
        return { suit, rank }
    })
);

