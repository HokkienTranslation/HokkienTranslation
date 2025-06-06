import axios from "axios";
import {GoogleGenAI, Modality} from "@google/genai";

// import { IMAGE_API_URL, API_KEY } from "@env";

// const apiUrl = IMAGE_API_URL;
// const apiKey = API_KEY;

const apiUrl = process.env.IMAGE_API_URL;
const apiKey = process.env.API_KEY;

const generateImage = async (prompt) => {
  if (!prompt) return { imgBase64: null, error: null };

  const requestData = {
    prompt: prompt, //option types: string or list of strings.
    prompt_style: "photography", //options: "anime", "portraits", "landscape", "sci-fi", "photography", "video_game", None for default.
    negative_prompt: "", //can change to your negative prompt here.
    negative_prompt_style: null, //options: "comic", "basic", "natural_human", None for default.
    n_steps: 40, //generating steps
    high_noise_frac: 0.8, //generating parameters
    base64_string: true, //please set True for api call, False is for testing.
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: { "API-KEY": apiKey },
    });

    if (response.data && response.data.img_base64_list) {
      const imgBase64 = response.data.img_base64_list[0];
      return { imgBase64, error: null };
    }
  } catch (error) {
    console.error("Error:", error);
    return { imgBase64: null, error };
  }
};

const apiKeyForGemini = process.env.GEMINI_API_KEY;

const generateImageWithGemini = async (prompt) => {
    if (!prompt) return {imgBase64: null, error: null};
    console.log("Gemini image generation is being used");

    const ai = new GoogleGenAI({apiKey: apiKeyForGemini});

    const promptContent = `Generate an image representing: ${prompt}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{
                role: "user",
                parts: [{text: promptContent}]
            }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        // Check if response has candidates and content
        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const imageData = part.inlineData.data;
                    return {imgBase64: imageData, error: null};
                }
            }
        }

        return {imgBase64: null, error: "No image data found in response"};
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {imgBase64: null, error: error.message || "Failed to generate image with Gemini"};
    }
};

export { generateImage, generateImageWithGemini };
