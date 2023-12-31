/**
 * Memory game
 * 
 * Bootstrapped from Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo, useState} from 'react';
import {
  Button,
  Image,
  ImageSourcePropType,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

// npm install react-native-svg
import Svg, { Circle } from 'react-native-svg';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const defaultCardBackImageUri = 'https://reactnative.dev/img/tiny_logo.png';

type CardProps = {
  cardId: number;
  pairId: number|string;
  backImageUri: string;
  frontImageUri: string;
  onFlip: () => void;
  isFlipped: boolean;
};

const Card = (cardProps: CardProps) => {
  const backImage: ImageSourcePropType = {
    ...styles.cardDimensions,
    uri: cardProps.backImageUri,
  };
  const frontImage: ImageSourcePropType = {
    ...styles.cardDimensions,
    uri: cardProps.frontImageUri,
  };
  return (
    <Pressable onPress={cardProps.onFlip} disabled={cardProps.isFlipped}>
      <Image source={cardProps.isFlipped? frontImage : backImage} />
    </Pressable>
  );
}

type EmojiCardProps = {
  emoji: string
} & CardProps

const EMOJI = {
  tada: String.fromCodePoint(0x1F389),
  trophy: String.fromCodePoint(0x1F3C6),
  speaker: String.fromCodePoint(0x1F508),
  tamtam: String.fromCodePoint(0x1FA98),
  question: String.fromCodePoint(0x2753)
}

const FOOD_EMOJI = {
  avocado: String.fromCodePoint(0x1F951),
  banana: String.fromCodePoint(0x1F34C),
  coconut: String.fromCodePoint(0x1F965),
  corn: String.fromCodePoint(0x1F33D),
  mango: String.fromCodePoint(0x1F96D),
  peanut: String.fromCodePoint(0x1F95C),
  pineapple: String.fromCodePoint(0x1F34D)
}

const TRANSPORT_EMOJI = {
  airplane: String.fromCodePoint(0x2708, 0xFE0F),
  canoe: String.fromCodePoint(0x1F6F6),
  helicopter: String.fromCodePoint(0x1F681),
}

/*
  (not working) u'xyz' to indicate a Unicode string, a sequence of Unicode characters
  (working) '\uxxxx' to indicate a string with a unicode character denoted by four hex digits
  (not working) '\Uxxxxxxxx' to indicate a string with a unicode character denoted by eight hex digits
  */
  // Unicode range for flags: u'[\U0001F1E6-\U0001F1FF]
const FLAG_BANK = {
  // Egypte
  eg: String.fromCodePoint(0x1F1EA, 0x1F1EC), // 🇪🇬
  // Cote d'Ivoire
  ci: String.fromCodePoint(0x1F1E8, 0x1F1EE), // 🇨🇮
  // Cameroun
  cm: String.fromCodePoint(0x1F1E8, 0x1F1F2), // 🇨🇲
  // Ghana
  gh: String.fromCodePoint(0x1F1EC, 0x1F1ED), // 🇬🇭
  // Nigeria
  ng: String.fromCodePoint(0x1F1F3, 0x1F1EC), // 🇳🇬
  // Algerie
  dz: String.fromCodePoint(0x1F1E9, 0x1F1FF), // 🇩🇿
  // RDC
  cd: String.fromCodePoint(0x1F1E8, 0x1F1E9), // 🇨🇩
  // Zambie
  zm: String.fromCodePoint(0x1F1FF, 0x1F1F2), // 🇿🇲
  // Soudan
  sd: String.fromCodePoint(0x1F1F8, 0x1F1E9), // 🇸🇩
  // Tunisie
  tn: String.fromCodePoint(0x1F1F9, 0x1F1F3), // 🇹🇳
  // Senegal
  sn: String.fromCodePoint(0x1F1F8, 0x1F1F3), // 🇸🇳
  // Ethiopie
  et: String.fromCodePoint(0x1F1EA, 0x1F1F9), // 🇪🇹
  // Maroc
  ma: String.fromCodePoint(0x1F1F2, 0x1F1E6), // 🇲🇦
  // Afrique du Sud
  za: String.fromCodePoint(0x1F1FF, 0x1F1E6), // 🇿🇦
  // Congo (Brazzaville)
  cg: String.fromCodePoint(0x1F1E8, 0x1F1EC), // 🇨🇬
};

// usage: <EmojiCard ... emoji={FLAG_BANK.dz}/>
const EmojiCard = (props: EmojiCardProps) => {
  const backImage: ImageSourcePropType = {
    ...styles.cardDimensions,
    uri: props.backImageUri,
  };
  return (
    <Pressable onPress={props.onFlip} disabled={props.isFlipped}>
      {props.isFlipped ?
        <View style={{...styles.cardDimensions, alignItems: "center"}}>
          <Text style={styles.emojiText}>{props.emoji}</Text>
        </View>
      :
        <Image source={backImage} />
      }
    </Pressable>
  );
}

type MyCardData = {
  id: number,
  pairId: number|string,
  frontImageUri: string
};

type BoardProps = {
  cardsData: MyCardData[];
  numberOfColumns: number;
  isMatchingPair: (card1: MyCardData, card2: MyCardData) => boolean;
  onRestart: () => void;
  onGameWin: () => void;
  debugMode: boolean;
};



const Board = (props: BoardProps) => {
  const [candidate1, setCandidate1] = useState<MyCardData|undefined>(undefined);
  const [candidate2, setCandidate2] = useState<MyCardData|undefined>(undefined);
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
  }

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
      setTimeout(() => {console.log('Wait...'); clearSelectedCandidates();}, waitTimeMs);
      console.log('After setTimeout...');;
    }
    console.log('evaluatePair -- END');
  }

  // State modifiers

  const clearSelectedCandidates = () => {
    setCandidate1(undefined);
    setCandidate2(undefined);
  }

  const resetBoard = () => {
    setPairsFound([]); clearSelectedCandidates();
  }

  // State checkers

  const isCardSelectionAlreadyRecorded = (cardData: MyCardData) => {
    const result = (candidate1?.id === cardData.id) || (candidate2?.id === cardData.id);
    // console.log(`isCardSelectionAlreadyRecorded: [${cardData.id}, ${result}]`);
    return result;
  }

  const isCardAlreadyMatched = (cardData: MyCardData) => {
    const result = pairsFound.includes(cardData.id);
    // console.log(`isCardAlreadyMatched: [${cardData.id}, ${result}]`);
    return result;
  }

  // Visual component 

  const renderImageCard = (cardData: MyCardData) => {
    return (
      <Card 
        cardId={cardData.id}
        pairId={cardData.pairId}
        backImageUri={defaultCardBackImageUri}
        frontImageUri={cardData.frontImageUri}
        onFlip={() => recordCardFlip(cardData)}
        isFlipped={isCardSelectionAlreadyRecorded(cardData)|| (isCardAlreadyMatched(cardData))}
      />
    );
  }

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
  }

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
  }

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
  }


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
        isFlipped={isCardSelectionAlreadyRecorded(cardData)|| (isCardAlreadyMatched(cardData))}
      />
    );
  }

  // const renderCard = (item: MyCardData) => renderEmojiCard(item, mapToFlagEmoji);
  const renderCard = (item: MyCardData) => renderEmojiCard(item, mapToFoodEmoji);
  // const renderCard = renderImageCard;

  return (
    <View>
      <View style={styles.boardContainer}>
        <FlatList 
          data={props.cardsData}
          renderItem={({item}) => renderCard(item)}
          numColumns={props.numberOfColumns}
          keyExtractor={item => `${item.id}`}
        />
        {props.debugMode && (
          <Text>{
            'candidates = [' 
            + candidate1?.id
            + ',' + candidate2?.id + ']'}
          </Text>
        )}
      </View>
      <Button title='Rejouer' onPress={() => {props.onRestart(); resetBoard();}}/>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Cards provider

  const IMAGE_URI_BANK : string[] = [
    'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
    'https://github.com/solenee.png',
    'https://jai-un-pote-dans-la.com/wp-content/uploads/2020/02/musique-min.jpg',
    'https://jai-un-pote-dans-la.com/wp-content/uploads/2020/02/plat-min.jpg',
    'https://jai-un-pote-dans-la.com/wp-content/uploads/2020/02/banane-min.jpg',
    'https://jai-un-pote-dans-la.com/wp-content/uploads/2020/02/maison-min.jpg'
  ];

  function rawCardsData(numberOfPairsToGenerate: number) {
    let data: MyCardData[] = [];
    let cardId: number = 0;
    for (let pairId = 0; pairId < numberOfPairsToGenerate; pairId++) {
      data = [...data,
      {
        id: cardId,
        pairId: pairId,
        frontImageUri: IMAGE_URI_BANK[pairId]
      },
      {
        id: cardId + 1,
        pairId: pairId,
        frontImageUri: IMAGE_URI_BANK[pairId]
      }
      ];
      cardId += 2;
    }
    return data;
  }
  
  // Fisher-Yates shuffle
  function shuffle(array: MyCardData[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const generateCardsData = (numberOfPairs: number) => {
    const numberOfPairsToGenerate: number = Math.min(numberOfPairs, IMAGE_URI_BANK.length);
    let data: MyCardData[] = rawCardsData(numberOfPairsToGenerate);
    shuffle(data);
    return data;
  }

  // This tells React that you don’t want the inner function to re-run unless the variables in [] have changed.
  // Use memoization for pure calculation that take a significant amount (say, 1ms or more).
  // Computation time can be evaluated with console.time('myFunction'); myFunction(); console.timeEnd(myFunction);
  const cardsData: MyCardData[] = useMemo(() => {
    return generateCardsData(12);
  }, []);

  
  const isMatchingPair = (card1: MyCardData, card2: MyCardData) => {
    return card1.pairId === card2.pairId;
  }

  // Game

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        
        <Board 
          cardsData={cardsData}
          numberOfColumns={3}
          isMatchingPair={isMatchingPair}
          onRestart={() => {console.log('onRestart'); shuffle(cardsData)}}
          onGameWin={() => Alert.alert('Jeu terminé', 'Bravo ! ' + EMOJI.trophy + EMOJI.tada)}
          debugMode={false}
        />

      </View>

      <View style={styles.svgContainer}>
        <Svg height="50%" width="50%" viewBox="0 0 100 100" >
          <Circle cx="50" cy="50" r="50" stroke="blue" strokeWidth=".5" fill="blue" />
          <Circle cx="50" cy="50" r="25" stroke="blue" strokeWidth=".5" fill="orange" />
        </Svg>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    marginTop: '25%',
    marginBottom: 32,
    alignItems: "center"
  },
  cardDimensions: {
    width: 90,
    height: 90
  },
  emojiText: {
    fontSize: 60
  },
  svgContainer: {
    marginTop: '10%',
    alignItems: "center"
  }
});

export default App;
