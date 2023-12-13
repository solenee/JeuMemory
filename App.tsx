/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  ImageSourcePropType,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

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

  
  const evaluatePair = (selectedCandidate1: MyCardData, selectedCandidate2: MyCardData) => {
    console.log('evaluatePair -- START');
    console.log(`Evaluating [${selectedCandidate1?.id}, ${selectedCandidate2?.id}]`);

    // if (match) then reflect it on the board (keep cards on the front)
    if (selectedCandidate1.frontImageUri === selectedCandidate2.frontImageUri) {
      console.log(`Recording match: [${selectedCandidate1?.id}, ${selectedCandidate2?.id}]`);
      setPairsFound((pairs) => [...pairs, selectedCandidate1.id, selectedCandidate2.id]);
      clearSelectedCandidates();
    } else {
      // flip cards back
      console.log('Flipping back the cards selected: [' + selectedCandidate1?.id
      + ',' + selectedCandidate2?.id + ']');
      setTimeout(() => {console.log('Wait...'); clearSelectedCandidates();}, 3000);
      console.log('After setTimeout...');;
    }
    console.log('evaluatePair -- END');

  }

  function clearSelectedCandidates() {
    setCandidate1(undefined);
    setCandidate2(undefined);
  }

  function resetBoard() {
    setPairsFound([]); clearSelectedCandidates();
  }

  const recordCardFlip = (cardData: any) => {
    console.log('Attempt to flip card [' + cardData.id + ']');
    if (isCardSelectionRecorded(cardData) || isCardAlreadyMatched(cardData)) {
      // ignore; already recorded
      return;
    }
    if (candidate1 === undefined) {
      setCandidate1(cardData);
    } else if (candidate2 === undefined) {
      const selectedCandidate2 = cardData;
      setCandidate2(selectedCandidate2);
      setTimeout(() => {console.log('Wait...'); evaluatePair(candidate1, selectedCandidate2);}, 2000);
      console.log('After setTimeout...');
    }
  }

  const isCardSelectionRecorded = (cardData: MyCardData) => {
    const result = (candidate1?.id === cardData.id) || (candidate2?.id === cardData.id);
    console.log(`isCardSelectionRecorded: [${cardData.id}, ${result}]`);
    return result;
  }

  const isCardAlreadyMatched = (cardData: MyCardData) => {
    const result = pairsFound.includes(cardData.id);
    console.log(`isCardAlreadyMatched: [${cardData.id}, ${result}]`);
    return result;
  }

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
        isFlipped={isCardSelectionRecorded(cardData)|| (isCardAlreadyMatched(cardData))}
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
        <Text>{//'numberOfCardsFlipped = [' + numberOfCardsFlipped + ']; 
          'candidates = [' 
          + candidate1?.id
          + ',' + candidate2?.id + ']'}
        </Text>
      </View>
      <Button title='Rejouer' onPress={() => resetBoard()}/>
    </View>
    
  );
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  boardContainer: {
    //flex: 1,
    alignItems: "center"
  }
});

export default App;
