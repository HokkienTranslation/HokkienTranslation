import axios from "axios";
import { TRANSLATION_API_URL } from "@env";

const apiUrl = TRANSLATION_API_URL;

// outputLanguage = "ZH" (Chinese) / "EN" (English) / "HAN" (Hokkien)
const fetchTranslation = async (query, outputLanguage) => {
  if (!query) return null;

  try {
    const requestData = {
      inputs: `[TRANS]\n${query}\n[/TRANS]\n${outputLanguage}\n`,
      parameters: {
        max_new_tokens: 128,
        repetition_penalty: 1.1,
      },
    };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data[0].generated_text) {
      const text = response.data[0].generated_text;
      const lines = text.split("\n");
      const translationText = lines[lines.length - 2].trim();
      return translationText;
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error in translation.");
  }
};

export { fetchTranslation };
