import axios from "axios";
import { ROMANIZER_API_URL, API_KEY } from "@env";

const apiUrl = ROMANIZER_API_URL;
const apiKey = API_KEY;

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
