/**
 * Memory game
 * 
 * Bootstrapped from Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

// npm install react-native-svg
import Svg, { Circle } from 'react-native-svg';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Board } from './components/Board';
import { EMOJI } from './data/Emoji';
import { MyCardData } from './types/MyCardData';

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
          <Circle cx="50" cy="50" r="25" stroke="blue" strokeWidth=".5" fill="green" />
        </Svg>
      </View>

    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  svgContainer: {
    marginTop: '10%',
    alignItems: "center"
  }
});

export default App;
