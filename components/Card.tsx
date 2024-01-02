import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export type CardProps = {
  cardId: number;
  pairId: number | string;
  backImageUri: string;
  frontImageUri: string;
  onFlip: () => void;
  isFlipped: boolean;
};

export const Card = (cardProps: CardProps) => {
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
      <Image source={cardProps.isFlipped ? frontImage : backImage} />
    </Pressable>
  );
};

export type EmojiCardProps = {
  emoji: string;
} & CardProps;

// usage: <EmojiCard ... emoji={FLAG_BANK.dz}/>
export const EmojiCard = (props: EmojiCardProps) => {
  const backImage: ImageSourcePropType = {
    ...styles.cardDimensions,
    uri: props.backImageUri,
  };
  return (
    <Pressable onPress={props.onFlip} disabled={props.isFlipped}>
      {props.isFlipped ?
        <View style={{ ...styles.cardDimensions, alignItems: "center" }}>
          <Text style={styles.emojiText}>{props.emoji}</Text>
        </View>
        :
        <Image source={backImage} />}
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  cardDimensions: {
    width: 90,
    height: 90
  },
  emojiText: {
    fontSize: 60
  }
});
