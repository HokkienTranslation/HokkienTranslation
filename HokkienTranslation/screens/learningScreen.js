
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import flashcardFetchFunctions from '../api/flashcardFetchFunctions';
import db from '../api/firebase';
import currentUser from '../api/firebase';
import {
    generatorParameters,
    FSRSParameters,
    FSRS,
    RecordLog,
} from "ts-fsrs";
import { ExtendedCard, createExtendedCard } from './components/extendedCard';

const learningScreen = () => { 
    var flashcardList = [];
    useEffect(() => {
        flashcardList = flashcardFetchFunctions.getFlashcards();
    }
    , [])




    return (
        <View>
            <Text>Learning Screen</Text>
        </View>
    )
}

type

const initalizeScheduler = () => {

    // this function should initalize the scheduler for a user that has never used the scheduling system before. 

    var flashcards = flashcardFetchFunctions.getFlashcards(db, currentUser); // get all flashcards for that user
    var cardList = [];
    // for each flashcard, create an empty extended card associated with it. attach the flashcard object id to the card
    var extendedCards = flashcards.map((flashcard) => {
        let card = createExtendedCard(flashcard.id, new Date().getTime());
        cardList.push(card);

    });

    // create a new scheduler object
    var scheduler = new FSRS(cardList, FSRSParameters, generatorParameters);
}