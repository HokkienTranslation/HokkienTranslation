import os
import requests
import pandas as pd

def hokkien_to_audio(sentence, save_directory, index):
    # API URLs and API Key
    translate_url = 'https://7070-203-145-219-124.ngrok-free.app/translateHAN2KIP'
    romanize_url = "https://tw-tts.z12.tw/display2"
    audio_url = "https://tw-tts.z12.tw/synthesize_TLPA"
    headers = {'API-KEY': 'iisriisra305'}

    # Ensure the directory exists
    base_directory = os.path.dirname(__file__)  # Base directory where the script is located
    full_save_directory = os.path.join(base_directory, '..', save_directory)
    os.makedirs(full_save_directory, exist_ok=True)

    # Step 1: Hokkien characters -> Romanization
    translate_data = {'sentence': sentence}
    translate_response = requests.post(translate_url, json=translate_data, headers=headers)
    if translate_response.status_code != 200:
        return "Translation API error", None
    romanized_text = translate_response.json()['result']

    # Step 2: Romanization -> Numeric tones
    romanize_params = {'text0': romanized_text}
    romanize_response = requests.get(romanize_url, params=romanize_params)
    if romanize_response.status_code != 200:
        return "Romanization API error", None
    num_tones_text = romanize_response.text

    # Step 3: Numeric tones -> Audio
    audio_params = {
        'text1': num_tones_text,
        'gender': '女聲',
        'accent': '強勢腔（高雄腔）'
    }
    audio_response = requests.get(audio_url, params=audio_params)
    if audio_response.status_code != 200:
        return "Audio API error", None

    # Save the audio file
    filename_prefix = f"{index:03d}_"  # Prefix with the index, padded with zeros
    audio_filename = os.path.join(full_save_directory, f"{filename_prefix}{sentence[:10].replace(' ', '_')}.wav")
    with open(audio_filename, "wb") as file:
        file.write(audio_response.content)

    return f"Audio file saved as {os.path.basename(audio_filename)}", os.path.basename(audio_filename)

# Relative paths for CSV and directory to save audio files
csv_file_path = "../data/new_flashcard_data_samples.csv"
audio_save_directory = "../HokkienTranslation/data/audio_files"

# Load data from CSV
df = pd.read_csv(csv_file_path)

# List to store audio filenames
audio_filenames = []

# Process each sentence in the 'origin' column with indexing
for index, sentence in enumerate(df['origin'], start=1):
    result, file_name = hokkien_to_audio(sentence, audio_save_directory, index)
    print(result)
    audio_filenames.append(file_name)  # Add filename to the list

# Add the filenames as a new column in the DataFrame
df['audio_filename'] = audio_filenames

# Save the updated DataFrame back to the CSV file
df.to_csv(csv_file_path, index=False)
