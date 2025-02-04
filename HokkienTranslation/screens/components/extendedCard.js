

import {
    Card,
    createEmptyCard,
    generatorParameters,
    FSRSParameters,
    FSRS,
    RecordLog,
  } from "ts-fsrs";


const ExtendedCard = Card & {
    flascardId // this is a string
};
  
const createExtendedCard = (flashcardId, date) => {
    return {
        ...createEmptyCard(date),
        flashcardId,
    };
};

export { ExtendedCard, createExtendedCard };