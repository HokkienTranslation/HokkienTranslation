// Very basic file that parses the phrase and outputs the same thing

function fetchOutput() {
    var phrase = document.getElementById('phraseInput').value;
    fetch('/fetch_phrase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({phrase: phrase}),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('output').innerText = data.output_phrase;
    });
}
