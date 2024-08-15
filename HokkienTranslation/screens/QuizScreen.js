import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  VStack,
  HStack,
  Text,
  Progress,
} from "native-base";
import { useTheme } from "./context/ThemeProvider";
import { Animated, Easing } from "react-native";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../backend/database/Firebase";
import getCurrentUser from "../backend/database/GetCurrentUser";

const QuizScreen = ({ route }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardScores, setFlashcardScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [userScores, setUserScores] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const flashcardListName = route.params.flashcardListName;
  console.log("QuizScreen: flashcardListName", flashcardListName);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "flashcardList"));
        let flashcardListDoc;

        querySnapshot.forEach((doc) => {
          if (doc.data().name === flashcardListName) {
            flashcardListDoc = doc;
          }
        });

        if (!flashcardListDoc) {
          console.error("No flashcard list found with the given name");
          setLoading(false);
          return;
        }

        const flashcardListData = flashcardListDoc.data();
        const flashcardIds = flashcardListData.cardList;
        const flashcards = [];

        for (const flashcardId of flashcardIds) {
          const flashcardDocRef = doc(db, "flashcard", flashcardId);
          const flashcardDoc = await getDoc(flashcardDocRef);

          if (flashcardDoc.exists()) {
            const data = flashcardDoc.data();
            const choices = shuffleArray([
              data.destination,
              ...data.otherOptions,
            ]);

            flashcards.push({
              id: flashcardDoc.id,
              ...data,
              choices,
            });
          }
        }

        setFlashcards(flashcards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    };

    fetchFlashcards();
  }, [flashcardListName]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleChoice = async (index) => {
    setSelectedAnswer(index);
    setIsDisabled(true);

    const isCorrect =
      flashcards[currentCardIndex].choices[index] ===
      flashcards[currentCardIndex].destination;
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setFlashcardScores({
      ...flashcardScores,
      [flashcards[currentCardIndex].id]: isCorrect ? 1 : 0,
    });

    if (currentCardIndex === flashcards.length - 1) {
      // Last flashcard, update quiz scores and show history
      try {
        const user = await getCurrentUser();
        console.log("user: ", user);

        const quizDocRef = doc(db, "flashcardQuiz", flashcardListName);

        console.log("quizDocRef", quizDocRef);
        console.log("time: ", serverTimestamp());
        console.log(
          "totalScore: ",
          (score + (isCorrect ? 1 : 0)) / flashcards.length
        );
        console.log("flashcardScores: ", {
          ...flashcardScores,
          [flashcards[currentCardIndex].id]: isCorrect ? 1 : 0,
        });

        await updateDoc(quizDocRef, {
          [`scores.${user}`]: arrayUnion({
            time: serverTimestamp(),
            totalScore: (score + (isCorrect ? 1 : 0)) / flashcards.length,
            flashcardScores: {
              ...flashcardScores,
              [flashcards[currentCardIndex].id]: isCorrect ? 1 : 0,
            },
          }),
        });

        showScoreHistory(user, flashcardListName);
      } catch (error) {
        console.error("Error updating quiz scores: ", error);
      }
    } else {
      setTimeout(() => {
        slideOut();
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsDisabled(false);
          setCurrentCardIndex((prevIndex) => prevIndex + 1);
          slideIn();
        }, 300);
      }, 1000);
    }
  };

  const showScoreHistory = async (user, flashcardListName) => {
    try {
      const quizDocRef = doc(db, "flashcardQuiz", flashcardListName);
      const quizDoc = await getDoc(quizDocRef);

      if (quizDoc.exists()) {
        const scores = quizDoc.data().scores[user];
        setUserScores(scores);
        setShowHistory(true);
      } else {
        console.error("No quiz history found.");
      }
    } catch (error) {
      console.error("Error fetching score history: ", error);
    }
  };

  const showFlashcardScores = (flashcardScores) => {
    return (
      <VStack space={4} alignItems="center">
        {Object.entries(flashcardScores).map(([flashcardId, score]) => (
          <Text key={flashcardId}>{`Flashcard ${flashcardId}: ${
            score ? "Correct" : "Incorrect"
          }`}</Text>
        ))}
      </VStack>
    );
  };

  const formatTimeDifference = (timestamp) => {
    const now = new Date();
    const time = timestamp.toDate();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const slideOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  const slideIn = () => {
    slideAnim.setValue(20);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  const getButtonStyle = (index) => {
    const correctAnswer = flashcards[currentCardIndex].destination;
    const choice = flashcards[currentCardIndex].choices[index];

    if (selectedAnswer === null) {
      return {
        bg: colors.primaryContainer,
        borderColor: colors.buttonBorder,
      };
    } else if (choice === correctAnswer) {
      return index === selectedAnswer
        ? { bg: "rgba(39, 201, 36, 0.6)", borderColor: "#27c924" }
        : { bg: "rgba(39, 201, 36, 0.6)", borderColor: "#27c924" };
    } else {
      return index === selectedAnswer
        ? { bg: "rgba(186, 34, 39, 0.6)", borderColor: "#ba2227" }
        : { bg: colors.primaryContainer, borderColor: colors.buttonBorder };
    }
  };

  if (loading) {
    return (
      <Center flex={1} px="3" background={colors.surface}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (showHistory) {
    return (
      <Center flex={1} px="3" background={colors.surface}>
        <VStack space={4} alignItems="center">
          {userScores.map((scoreEntry, index) => (
            <Box key={index}>
              <Text>{`${formatTimeDifference(scoreEntry.time)} - Score: ${(
                scoreEntry.totalScore * 100
              ).toFixed(2)}%`}</Text>
              {showFlashcardScores(scoreEntry.flashcardScores)}
            </Box>
          ))}
        </VStack>
      </Center>
    );
  }

  return (
    <Center flex={1} px="3" background={colors.surface}>
      <VStack space={4} alignItems="center">
        <Text fontSize="lg" color={colors.onSurface}>
          Question {currentCardIndex + 1} of {flashcards.length}
        </Text>
        <Progress
          value={((currentCardIndex + 1) / flashcards.length) * 100}
          width="90%"
          colorScheme="green"
          mb={4}
        />
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }}
        >
          <Box
            width="400px"
            height="250px"
            bg={colors.primaryContainer}
            borderRadius="10px"
            shadow={2}
            p={6}
            justifyContent="center"
          >
            <VStack
              space={10}
              alignItems="center"
              flex={1}
              justifyContent="center"
            >
              <Text fontSize="2xl" color={colors.onSurface} mb={0}>
                {flashcards[currentCardIndex].origin}
              </Text>
              <VStack space={5} width="100%">
                <HStack space={9} width="100%">
                  <Button
                    size="lg"
                    colorScheme={colors.onSurface}
                    variant="outline"
                    {...getButtonStyle(0)}
                    _hover={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _pressed={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _disabled={{
                      opacity: 1,
                    }}
                    flex={1}
                    onPress={() => handleChoice(0)}
                    isDisabled={isDisabled}
                  >
                    <Text color={colors.onSurface}>
                      {flashcards[currentCardIndex].choices[0]}
                    </Text>
                  </Button>
                  <Button
                    size="lg"
                    colorScheme={colors.onSurface}
                    variant="outline"
                    {...getButtonStyle(1)}
                    _hover={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _pressed={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _disabled={{
                      opacity: 1,
                    }}
                    flex={1}
                    onPress={() => handleChoice(1)}
                    isDisabled={isDisabled}
                  >
                    <Text color={colors.onSurface}>
                      {flashcards[currentCardIndex].choices[1]}
                    </Text>
                  </Button>
                </HStack>
                <HStack space={9} width="100%">
                  <Button
                    size="lg"
                    colorScheme={colors.onSurface}
                    variant="outline"
                    {...getButtonStyle(2)}
                    _hover={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _pressed={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _disabled={{
                      opacity: 1,
                    }}
                    flex={1}
                    onPress={() => handleChoice(2)}
                    isDisabled={isDisabled}
                  >
                    <Text color={colors.onSurface}>
                      {flashcards[currentCardIndex].choices[2]}
                    </Text>
                  </Button>
                  <Button
                    size="lg"
                    colorScheme={colors.onSurface}
                    variant="outline"
                    {...getButtonStyle(3)}
                    _hover={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _pressed={{
                      borderColor: colors.highlightButtonBorder,
                    }}
                    _disabled={{
                      opacity: 1,
                    }}
                    flex={1}
                    onPress={() => handleChoice(3)}
                    isDisabled={isDisabled}
                  >
                    <Text color={colors.onSurface}>
                      {flashcards[currentCardIndex].choices[3]}
                    </Text>
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Animated.View>
      </VStack>
      <Text fontSize="lg" color={colors.onSurface} mt={4}>
        Score: {score}
      </Text>
    </Center>
  );
};

export default QuizScreen;
