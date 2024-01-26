import axios from "axios";

const apiUrl = "http://203.145.216.157:56238/generate";

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

    if (response.data && response.data.generated_text) {
      let translationText = response.data.generated_text
        .split("\n")[0]
        .trimStart();
      if (outputLanguage === "EN") {
        translationText = translationText.substring(
          0,
          translationText.length - 1
        );
      }
      return translationText;
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error in translation.");
  }
};

export { fetchTranslation };
