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
const defaultCardFrontImageUri = 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png';
const soleneeGithubImageUri = 'https://github.com/solenee.png';

type CardProps = {
  cardId: number;
  backImage: ImageSourcePropType;
  frontImage: ImageSourcePropType;
  onFlip: any;
  isFlipped: boolean;
}; 

const Card = (props: CardProps) => {
  return (
    <Pressable onPress={props.onFlip}>
      <Image source={props.isFlipped? props.frontImage : props.backImage} />
    </Pressable>
  );
}


const Board = ({}) => {
  const [candidate1, setCandidate1] = useState<MyCardData|undefined>(undefined);
  const [candidate2, setCandidate2] = useState<MyCardData|undefined>(undefined);
  const [pairsFound, setPairsFound] = useState<number[]>([]);

  // Model logic 

  const isMatchingPair = (selectedCandidate1: MyCardData, selectedCandidate2: MyCardData) => {
    return selectedCandidate1.frontImageUri === selectedCandidate2.frontImageUri;
  }

  const recordCardFlip = (cardData: any) => {
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

    if (isMatchingPair(selectedCandidate1, selectedCandidate2)) {
      // reflect matching pair discovery on the board: keep cards on the front side
      console.log(`Recording match: [${selectedCandidate1?.id}, ${selectedCandidate2?.id}]`);
      setPairsFound((pairs) => [...pairs, selectedCandidate1.id, selectedCandidate2.id]);
      clearSelectedCandidates();
    } else {
      // flip cards back
      console.log('Flipping back the cards selected: [' + selectedCandidate1?.id
      + ',' + selectedCandidate2?.id + ']');
      setTimeout(() => {console.log('Wait...'); clearSelectedCandidates();}, 2000);
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
    console.log(`isCardSelectionAlreadyRecorded: [${cardData.id}, ${result}]`);
    return result;
  }

  const isCardAlreadyMatched = (cardData: MyCardData) => {
    const result = pairsFound.includes(cardData.id);
    console.log(`isCardAlreadyMatched: [${cardData.id}, ${result}]`);
    return result;
  }

  // Visual component 
  
  const newCard = (cardData: MyCardData) => {
    return (
      <Card 
        cardId={cardData.id}
        backImage={{
          uri: defaultCardBackImageUri,
          width: 64,
          height: 64,
        }}
        frontImage={{
          uri: cardData.frontImageUri,
          width: 64,
          height: 64,
        }}
        onFlip={() => recordCardFlip(cardData)}
        isFlipped={isCardSelectionAlreadyRecorded(cardData)|| (isCardAlreadyMatched(cardData))}
      />
    );
  }

  type MyCardData = {
    id: number,
    frontImageUri: string
  };

  const cardsData: MyCardData[] = [
    {
      id: 0,
      frontImageUri: soleneeGithubImageUri
    },
    {
      id: 1,
      frontImageUri: defaultCardFrontImageUri
    },
    {
      id: 2,
      frontImageUri: soleneeGithubImageUri
    },
    {
      id: 3,
      frontImageUri: defaultCardFrontImageUri
    }
  ];

  return (
    <View>
      <View style={styles.boardContainer}>
        <FlatList
              data={cardsData}
              renderItem={item => newCard(item.item)}
              numColumns={2}
              keyExtractor={item => `${item.id}`}
              //columnWrapperStyle={styles.flatlistRow}
        />
        <Text>{
          'candidates = [' 
          + candidate1?.id
          + ',' + candidate2?.id + ']'}
        </Text>
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
          
          <Board />

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    //flex: 1,
    marginTop: 32,
    alignItems: "center"
  }
});

export default App;
