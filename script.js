document.getElementById('castBtn').addEventListener('click', () => {
    const teamA = document.getElementById('teamA').value.toUpperCase();
    const dateStrA = document.getElementById('dateA').value;
    const teamB = document.getElementById('teamB').value.toUpperCase();
    const dateStrB = document.getElementById('dateB').value;
    const dateStrMatch = document.getElementById('matchDate').value;

    if (!teamA || !dateStrA || !teamB || !dateStrB || !dateStrMatch) {
        alert("The ritual is incomplete. Provide all names and exact dates.");
        return;
    }

    // Hide results and show loader
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loader').classList.remove('hidden');

    const matchDate = new Date(dateStrMatch);
    const dateA = new Date(dateStrA);
    const dateB = new Date(dateStrB);
    
    let scoreA = 0;
    let scoreB = 0;

    // --- 1. CHALDEAN NUMEROLOGY ---
    const chaldeanChart = {
        'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':8, 'G':3, 'H':5, 'I':1, 
        'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':7, 'P':8, 'Q':1, 'R':2, 
        'S':3, 'T':4, 'U':6, 'V':6, 'W':6, 'X':5, 'Y':1, 'Z':7
    };

    const calculateChaldean = (str) => {
        let sum = 0;
        for (let char of str.replace(/[^A-Z]/g, '')) sum += chaldeanChart[char] || 0;
        return sum % 9 === 0 ? 9 : sum % 9; 
    };

    const numA = calculateChaldean(teamA);
    const numB = calculateChaldean(teamB);
    const matchDayNum = matchDate.getDate() % 9 === 0 ? 9 : matchDate.getDate() % 9;
    
    const diffA = Math.abs(numA - matchDayNum);
    const diffB = Math.abs(numB - matchDayNum);
    
    let numWinner = "Neutral";
    if (diffA < diffB) { numWinner = teamA; scoreA += 2; }
    else if (diffB < diffA) { numWinner = teamB; scoreB += 2; }

    // --- 2. ASTROLOGY (Sun Signs & Elemental) ---
    const getZodiac = (dateObj) => {
        const d = dateObj.getDate();
        const m = dateObj.getMonth() + 1;
        if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return { sign: 'Aries', element: 'Fire' };
        if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return { sign: 'Taurus', element: 'Earth' };
        if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) return { sign: 'Gemini', element: 'Air' };
        if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) return { sign: 'Cancer', element: 'Water' };
        if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return { sign: 'Leo', element: 'Fire' };
        if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return { sign: 'Virgo', element: 'Earth' };
        if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) return { sign: 'Libra', element: 'Air' };
        if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) return { sign: 'Scorpio', element: 'Water' };
        if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) return { sign: 'Sagittarius', element: 'Fire' };
        if ((m == 12 && d >= 22) || (m == 1 && d <= 19)) return { sign: 'Capricorn', element: 'Earth' };
        if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return { sign: 'Aquarius', element: 'Air' };
        return { sign: 'Pisces', element: 'Water' };
    };

    const zodiacA = getZodiac(dateA);
    const zodiacB = getZodiac(dateB);
    const zodiacMatch = getZodiac(matchDate);

    const checkAffinity = (teamElement, matchElement) => {
        if (teamElement === matchElement) return 2; 
        if ((teamElement === 'Fire' && matchElement === 'Air') || (teamElement === 'Air' && matchElement === 'Fire')) return 1;
        if ((teamElement === 'Earth' && matchElement === 'Water') || (teamElement === 'Water' && matchElement === 'Earth')) return 1;
        return 0; 
    };

    const affinityA = checkAffinity(zodiacA.element, zodiacMatch.element);
    const affinityB = checkAffinity(zodiacB.element, zodiacMatch.element);

    let astroWinner = "Neutral";
    if (affinityA > affinityB) { astroWinner = teamA; scoreA += 2; }
    else if (affinityB > affinityA) { astroWinner = teamB; scoreB += 2; }

    // --- 3. ESOTERICISM / I CHING SEEDING ---
    const seedString = `${teamA}${dateStrA}${teamB}${dateStrB}${matchDate.getTime()}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = Math.imul(31, hash) + seedString.charCodeAt(i) | 0;
    }
    
    const hexagram = Math.abs(hash) % 64 + 1;
    let ichingWinner = hexagram % 2 !== 0 ? teamA : teamB;
    hexagram % 2 !== 0 ? scoreA += 2 : scoreB += 2;

    // --- FAKE DELAY FOR ANIMATION (2.5 Seconds) ---
    setTimeout(() => {
        // Hide loader
        document.getElementById('loader').classList.add('hidden');

        // DISPLAY RESULTS
        document.getElementById('numOutput').innerHTML = 
            `<strong>${teamA}</strong> Frequency: ${numA} <br>
             <strong>${teamB}</strong> Frequency: ${numB} <br>
             Day's Resonance: ${matchDayNum} <br>
             <em>Alignment favors: ${numWinner}</em>`;

        document.getElementById('astroOutput').innerHTML = 
            `Match Day Sun: <strong>${zodiacMatch.sign} (${zodiacMatch.element})</strong> <br>
             <strong>${teamA}</strong>: ${zodiacA.sign} (${zodiacA.element}) <br>
             <strong>${teamB}</strong>: ${zodiacB.sign} (${zodiacB.element}) <br>
             <em>Elemental affinity favors: ${astroWinner}</em>`;

        document.getElementById('ichingOutput').innerHTML = 
            `The casting reveals Hexagram <strong>#${hexagram}</strong>. <br>
             Energy state: ${hexagram % 2 !== 0 ? 'Yang (Active/Home)' : 'Yin (Receptive/Away)'}. <br>
             <em>The Book of Changes points to: ${ichingWinner}</em>`;

        let finalVictor = "DRAW / STALEMATE";
        if (scoreA > scoreB) finalVictor = teamA;
        if (scoreB > scoreA) finalVictor = teamB;

        document.getElementById('finalVerdict').innerText = finalVictor;
        
        // Show results
        document.getElementById('results').classList.remove('hidden');
    }, 2500); // 2500 milliseconds = 2.5 seconds
});

// --- CLIPBOARD COPY LOGIC ---
document.getElementById('copyBtn').addEventListener('click', () => {
    const teamA = document.getElementById('teamA').value.toUpperCase();
    const teamB = document.getElementById('teamB').value.toUpperCase();
    const matchDate = document.getElementById('matchDate').value;
    const verdict = document.getElementById('finalVerdict').innerText;
    
    const textToCopy = `🔮 ARCANE PITCH FORECASTER 🔮\n⚽ ${teamA} vs ${teamB}\n📅 Date: ${matchDate}\n\n🏆 Prophesied Victor: ${verdict}\n\nCast your own runes to see the shifting fates!`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.innerText = "✅ Prophecy Copied!";
        
        setTimeout(() => {
            copyBtn.innerText = "📋 Copy Prophecy to Clipboard";
        }, 2500);
    }).catch(err => {
        alert("The fates blocked the copying process. Please try again.");
        console.error("Clipboard write failed:", err);
    });
});

// --- RESET LOGIC ---
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('teamA').value = '';
    document.getElementById('dateA').value = '';
    document.getElementById('teamB').value = '';
    document.getElementById('dateB').value = '';
    document.getElementById('matchDate').value = '';
    
    // Hide both results and loader on reset
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loader').classList.add('hidden');
});