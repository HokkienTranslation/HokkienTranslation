import { useEffect } from "react";
import {callOpenAIChat} from "../../backend/API/OpenAIChatService.js";

const getContextSentence = async ({word}) => {
    const answer = await callOpenAIChat("Can you use the word '" + word + "' in a sentence? It should be the main subject of the sentence. Please do not include pleasentries in the response and make the sentence short.");
    console.log(answer);

    return answer;
};

export default getContextSentence;