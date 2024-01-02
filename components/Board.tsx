import React, { useState } from 'react';
import {
  Button,
  FlatList, 
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Card } from './Card';
import { EmojiCard } from './Card';
import { MyCardData } from '../types/MyCardData';
import { FLAG_BANK } from '../data/Emoji';
import { FOOD_EMOJI, TRANSPORT_EMOJI } from '../data/Emoji';

export const defaultCardBackImageUri = 'https://reactnative.dev/img/tiny_logo.png';

type BoardProps = {
  cardsData: MyCardData[];
  numberOfColumns: number;
  isMatchingPair: (card1: MyCardData, card2: MyCardData) => boolean;
  onRestart: () => void;
  onGameWin: () => void;
  debugMode: boolean;
};

export const Board = (props: BoardProps) => {
  const [candidate1, setCandidate1] = useState<MyCardData | undefined>(undefined);
  const [candidate2, setCandidate2] = useState<MyCardData | undefined>(undefined);
  const [pairsFound, setPairsFound] = useState<number[]>([]);

  // Model logic 
  if (pairsFound.length === props.cardsData.length) {
    props.onGameWin();
  }

  const recordCardFlip = (cardData: MyCardData) => {
    console.log('Attempt to flip card [' + cardData.id + ']');
    if (isCardSelectionAlreadyRecorded(cardData) || isCardAlreadyMatched(cardData)) {
      // ignore; already recorded
      return;
    }
    if (candidate1 === undefined) {
      setCandidate1(cardData);
    } else if (candidate2 === undefined) {
      const selectedCandidate2 = cardData;
      setCandidate2(selectedCandidate2);
      evaluatePair(candidate1, selectedCandidate2);
    }
  };

  const evaluatePair = (selectedCandidate1: MyCardData, selectedCandidate2: MyCardData) => {
    console.log('evaluatePair -- START');
    console.log(`Evaluating [${selectedCandidate1?.id}, ${selectedCandidate2?.id}]`);

    if (props.isMatchingPair(selectedCandidate1, selectedCandidate2)) {
      // reflect matching pair discovery on the board: keep cards on the front side
      console.log(`Recording match: [${selectedCandidate1?.id}, ${selectedCandidate2?.id}]`);
      setPairsFound((pairs) => [...pairs, selectedCandidate1.id, selectedCandidate2.id]);
      clearSelectedCandidates();
    } else {
      // flip cards back
      console.log('Flipping back the cards selected: [' + selectedCandidate1?.id
        + ',' + selectedCandidate2?.id + ']');
      const waitTimeMs: number = 1250;
      setTimeout(() => { console.log('Wait...'); clearSelectedCandidates(); }, waitTimeMs);
      console.log('After setTimeout...');;
    }
    console.log('evaluatePair -- END');
  };

  // State modifiers
  const clearSelectedCandidates = () => {
    setCandidate1(undefined);
    setCandidate2(undefined);
  };

  const resetBoard = () => {
    setPairsFound([]); clearSelectedCandidates();
  };

  // State checkers
  const isCardSelectionAlreadyRecorded = (cardData: MyCardData) => {
    const result = (candidate1?.id === cardData.id) || (candidate2?.id === cardData.id);
    // console.log(`isCardSelectionAlreadyRecorded: [${cardData.id}, ${result}]`);
    return result;
  };

  const isCardAlreadyMatched = (cardData: MyCardData) => {
    const result = pairsFound.includes(cardData.id);
    // console.log(`isCardAlreadyMatched: [${cardData.id}, ${result}]`);
    return result;
  };

  // Visual component 
  const renderImageCard = (cardData: MyCardData) => {
    return (
      <Card
        cardId={cardData.id}
        pairId={cardData.pairId}
        backImageUri={defaultCardBackImageUri}
        frontImageUri={cardData.frontImageUri}
        onFlip={() => recordCardFlip(cardData)}
        isFlipped={isCardSelectionAlreadyRecorded(cardData) || (isCardAlreadyMatched(cardData))} />
    );
  };

  const mapToFlagEmoji = (cardData: MyCardData) => {
    const pairIdentifier = cardData.pairId;
    let emoji: string;
    if (pairIdentifier === 0) {
      emoji = FLAG_BANK.eg;
    }
    else if (pairIdentifier === 1) {
      emoji = FLAG_BANK.ci;
    }
    else if (pairIdentifier === 2) {
      emoji = FLAG_BANK.cm;
    }
    else if (pairIdentifier === 3) {
      emoji = FLAG_BANK.gh;
    }
    else if (pairIdentifier === 4) {
      emoji = FLAG_BANK.ng;
    }
    else if (pairIdentifier === 5) {
      emoji = FLAG_BANK.dz;
    }
    else if (pairIdentifier === 6) {
      emoji = FLAG_BANK.cd;
    } else {
      emoji = FLAG_BANK.za;
    }
    return emoji;
  };

  const mapToFoodEmoji = (cardData: MyCardData) => {
    const pairIdentifier = cardData.pairId;
    let emoji: string;
    if (pairIdentifier === 0) {
      emoji = FOOD_EMOJI.avocado;
    }
    else if (pairIdentifier === 1) {
      emoji = FOOD_EMOJI.banana;
    }
    else if (pairIdentifier === 2) {
      emoji = FOOD_EMOJI.coconut;
    }
    else if (pairIdentifier === 3) {
      emoji = FOOD_EMOJI.corn;
    }
    else if (pairIdentifier === 4) {
      emoji = FOOD_EMOJI.mango;
    }
    else if (pairIdentifier === 5) {
      emoji = FOOD_EMOJI.peanut;
    }
    else {
      emoji = FOOD_EMOJI.pineapple;
    }
    return emoji;
  };

  const mapToTransportEmoji = (cardData: MyCardData) => {
    const pairIdentifier = cardData.pairId;
    let emoji: string;
    if (pairIdentifier === 0) {
      emoji = TRANSPORT_EMOJI.canoe;
    }
    else if (pairIdentifier === 1) {
      emoji = TRANSPORT_EMOJI.helicopter;
    }
    else {
      emoji = TRANSPORT_EMOJI.airplane;
    }
    return emoji;
  };


  const renderEmojiCard = (cardData: MyCardData, mapToEmoji: (data: MyCardData) => string) => {
    let emoji: string = mapToEmoji(cardData);
    return (
      <EmojiCard
        cardId={cardData.id}
        pairId={cardData.pairId}
        backImageUri={defaultCardBackImageUri}
        frontImageUri={cardData.frontImageUri}
        emoji={emoji}
        onFlip={() => recordCardFlip(cardData)}
        isFlipped={isCardSelectionAlreadyRecorded(cardData) || (isCardAlreadyMatched(cardData))} />
    );
  };

  // const renderCard = (item: MyCardData) => renderEmojiCard(item, mapToFlagEmoji);
  const renderCard = (item: MyCardData) => renderEmojiCard(item, mapToFoodEmoji);
  // const renderCard = renderImageCard;
  return (
    <View>
      <View style={styles.boardContainer}>
        <FlatList
          data={props.cardsData}
          renderItem={({ item }) => renderCard(item)}
          numColumns={props.numberOfColumns}
          keyExtractor={item => `${item.id}`} />
        {props.debugMode && (
          <Text>{'candidates = ['
            + candidate1?.id
            + ',' + candidate2?.id + ']'}
          </Text>
        )}
      </View>
      <Button title='Rejouer' onPress={() => { props.onRestart(); resetBoard(); }} />
    </View>
  );
};

export const styles = StyleSheet.create({
  boardContainer: {
    marginTop: '25%',
    marginBottom: 32,
    alignItems: "center"
  }
});
