import axios from "axios";

const apiUrl = "https://e402-203-145-219-124.ngrok-free.app/translateHAN2KIP";
const apiKey = "iisriisra305";

const fetchRomanizer = async (hokkien) => {
  if (!hokkien) return null;

  try {
    const requestData = {
      sentence: hokkien,
    };

    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "API-KEY": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.result) {
      return response.data.result;
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error in romanizing.");
  }
};

export { fetchRomanizer };
