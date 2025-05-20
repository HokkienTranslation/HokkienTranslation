import * as Notifications from 'expo-notifications';

// Function to set up notification categories for flashcards
export async function setupFlashcardCategories() {
  // Create a category for flashcard quiz notifications
  await Notifications.setNotificationCategoryAsync('flashcard_quiz', [
    {
      identifier: 'option_1',
      buttonTitle: 'Option 1', // This will be dynamically replaced when sending
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      }
    },
    {
      identifier: 'option_2',
      buttonTitle: 'Option 2', // This will be dynamically replaced when sending
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      }
    },
    {
      identifier: 'option_3',
      buttonTitle: 'Option 3', // This will be dynamically replaced when sending
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      }
    },
  ]);

  console.log('Flashcard notification categories set up successfully');
}
