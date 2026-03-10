document.getElementById('predictBtn').addEventListener('click', () => {
    const teamA = document.getElementById('teamA').value.trim().toLowerCase();
    const teamB = document.getElementById('teamB').value.trim().toLowerCase();
    const matchDate = document.getElementById('matchDate').value;

    if (!teamA || !teamB || !matchDate) {
        alert("The Oracles require all fields to be filled.");
        return;
    }

    // 1. Numerology Logic (Calculate string character codes to a single digit)
    const getNumerologyRoot = (str) => {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        while (sum > 9) {
            sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return sum;
    };

    const numA = getNumerologyRoot(teamA);
    const numB = getNumerologyRoot(teamB);
    let numWinner = numA > numB ? teamA : (numB > numA ? teamB : "Draw");

    // 2. Astrology Logic (Zodiac element of the day vs team length)
    const month = new Date(matchDate).getMonth() + 1;
    const elements = ['Fire', 'Earth', 'Air', 'Water'];
    const dayElement = elements[month % 4]; 
    let astroWinner = teamA.length % 4 === month % 4 ? teamA : teamB;

    // 3. Occult Logic (Deterministic pseudo-random "fate" based on combined inputs)
    const fateSeed = teamA.length * teamB.length * parseInt(matchDate.replace(/-/g, ''));
    let occultWinner = fateSeed % 2 === 0 ? teamA : teamB;

    // 4. Calculate Final Verdict (Best out of 3, or weighted)
    let scoreA = 0;
    let scoreB = 0;

    if (numWinner === teamA) scoreA++; else if (numWinner === teamB) scoreB++;
    if (astroWinner === teamA) scoreA++; else scoreB++;
    if (occultWinner === teamA) scoreA++; else scoreB++;

    let finalWinner = scoreA > scoreB ? teamA : (scoreB > scoreA ? teamB : "The fates are tied (Draw)");

    // Display Results
    document.getElementById('numResult').innerText = `Home vibration: ${numA}. Away vibration: ${numB}. Numerology favors: ${numWinner.toUpperCase()}`;
    document.getElementById('astroResult').innerText = `The day's element is ${dayElement}. The celestial bodies align with: ${astroWinner.toUpperCase()}`;
    document.getElementById('occultResult').innerText = `The esoteric seed of fate (${fateSeed}) shifts the unseen balance toward: ${occultWinner.toUpperCase()}`;
    document.getElementById('finalWinner').innerText = finalWinner.toUpperCase();

    document.getElementById('results').classList.remove('hidden');
});