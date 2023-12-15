/**
 * Memory game
 * 
 * Bootstrapped from Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
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
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const defaultCardBackImageUri = 'https://reactnative.dev/img/tiny_logo.png';

type CardProps = {
  cardId: number;
  backImage: ImageSourcePropType;
  frontImage: ImageSourcePropType;
  onFlip: () => void;
  isFlipped: boolean;
};

const Card = (cardProps: CardProps) => {
  return (
    <Pressable onPress={cardProps.onFlip} disabled={cardProps.isFlipped}>
      <Image source={cardProps.isFlipped? cardProps.frontImage : cardProps.backImage} />
    </Pressable>
  );
}

type EmojiCardProps = {
  cardProps: CardProps,
  emoji: string
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

// usage: <EmojiCard cardProps={cardProps} emoji={FLAG_BANK.dz}/>
const EmojiCard = ({cardProps, emoji}: EmojiCardProps) => {
  return (
    <Pressable onPress={cardProps.onFlip} disabled={cardProps.isFlipped}>
      {cardProps.isFlipped ?
        <View style={{...styles.cardDimensions, alignItems: "center"}}>
          <Text style={{fontSize: 40}}>{emoji} </Text>
        </View>
      :
        <Image source={cardProps.backImage} />
      }
    </Pressable>
  );
}

type MyCardData = {
  id: number,
  frontImageUri: string
};

type BoardProps = {
  cardsData: MyCardData[];
  numberOfColumns: number;
  isMatchingPair: (card1: MyCardData, card2: MyCardData) => boolean;
  debugMode: boolean;
};

const Board = (props: BoardProps) => {
  const [candidate1, setCandidate1] = useState<MyCardData|undefined>(undefined);
  const [candidate2, setCandidate2] = useState<MyCardData|undefined>(undefined);
  const [pairsFound, setPairsFound] = useState<number[]>([]);

  // Model logic 

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
      const waitTimeMs: number = 2000;
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

  const renderCard = (cardData: MyCardData) => {
    return (
      <Card 
        cardId={cardData.id}
        backImage={{
          ...styles.cardDimensions,
          uri: defaultCardBackImageUri,
        }}
        frontImage={{
          ...styles.cardDimensions,
          uri: cardData.frontImageUri,
        }}
        onFlip={() => recordCardFlip(cardData)}
        isFlipped={isCardSelectionAlreadyRecorded(cardData)|| (isCardAlreadyMatched(cardData))}
      />
    );
  }

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
      <Button title='Rejouer' onPress={() => resetBoard()}/>
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

  const generateCardsData = (numberOfPairs: number) => {
    const numberOfPairsToGenerate: number = Math.min(numberOfPairs, IMAGE_URI_BANK.length);
    let data: MyCardData[] = [];
    let cardId: number = 0;
    for (let pairId = 0; pairId < numberOfPairsToGenerate; pairId++) {
      data = [...data, 
        {
          id: cardId,
          frontImageUri: IMAGE_URI_BANK[pairId]
        },
        {
          id: cardId+1,
          frontImageUri: IMAGE_URI_BANK[pairId]
        }
      ]
      cardId += 2;
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

    shuffle(data);
    return data;
  }

  const cardsData: MyCardData[] = generateCardsData(10);
  
  const isMatchingPair = (card1: MyCardData, card2: MyCardData) => {
    return card1.frontImageUri === card2.frontImageUri;
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
        
        <Board cardsData={cardsData} numberOfColumns={3} isMatchingPair={isMatchingPair} debugMode={true}/>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: "center"
  },
  cardDimensions: {
    width: 64,
    height: 64
  }
});

export default App;
