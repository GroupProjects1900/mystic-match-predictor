// ==========================================
// 📖 AUTO-FILL LISTENER LOGIC
// ==========================================
const handleAutoFill = (teamInputId, prefix, isAway) => {
    const teamName = document.getElementById(teamInputId).value.trim().toLowerCase();
    
    if (typeof clubDatabase !== 'undefined' && clubDatabase[teamName]) {
        const data = clubDatabase[teamName];
        document.getElementById(`date${prefix}`).value = data.founded;
        document.getElementById(`manager${prefix}`).value = data.manager;
        document.getElementById(`captain${prefix}`).value = data.captain;

        document.getElementById(`color${prefix}`).value = isAway ? data.awayColor : data.homeColor;

        const inputEl = document.getElementById(teamInputId);
        inputEl.style.boxShadow = "0 0 15px var(--neon-cyan)";
        inputEl.style.borderColor = "var(--neon-cyan)";
        setTimeout(() => {
            inputEl.style.boxShadow = "none";
            inputEl.style.borderColor = "var(--glass-border)";
        }, 1200);
    }
};

document.getElementById('teamA').addEventListener('input', () => handleAutoFill('teamA', 'A', false));
document.getElementById('teamB').addEventListener('input', () => handleAutoFill('teamB', 'B', true));

// ==========================================
// 🔮 THE ARCANE ENGINE (9 Pillars Logic)
// ==========================================
document.getElementById('castBtn').addEventListener('click', () => {
    // 1. CAPTURE ALL INPUTS
    const teamA = document.getElementById('teamA').value.toUpperCase();
    const dateA = new Date(document.getElementById('dateA').value);
    const mgrA = new Date(document.getElementById('managerA').value);
    const capA = new Date(document.getElementById('captainA').value);
    const colA = document.getElementById('colorA').value;

    const teamB = document.getElementById('teamB').value.toUpperCase();
    const dateB = new Date(document.getElementById('dateB').value);
    const mgrB = new Date(document.getElementById('managerB').value);
    const capB = new Date(document.getElementById('captainB').value);
    const colB = document.getElementById('colorB').value;

    const stadium = document.getElementById('stadium').value.toUpperCase();
    const referee = document.getElementById('referee').value.toUpperCase();
    const matchDate = new Date(document.getElementById('matchDate').value);

    if (!teamA || isNaN(dateA) || isNaN(mgrA) || isNaN(capA) || !teamB || isNaN(dateB) || isNaN(mgrB) || isNaN(capB) || !stadium || !referee || isNaN(matchDate)) {
        alert("The altar requires all fields to be filled before casting.");
        return;
    }

    document.getElementById('results').classList.add('hidden');
    document.getElementById('loader').classList.remove('hidden');

    let scoreA = 0;
    let scoreB = 0;

    // --- HELPER: ZODIAC & NUMEROLOGY ---
    const getZodiac = (date) => {
        const d = date.getDate(), m = date.getMonth() + 1;
        if ((m==3 && d>=21)||(m==4 && d<=19)) return {s:'Aries', e:'Fire'};
        if ((m==4 && d>=20)||(m==5 && d<=20)) return {s:'Taurus', e:'Earth'};
        if ((m==5 && d>=21)||(m==6 && d<=20)) return {s:'Gemini', e:'Air'};
        if ((m==6 && d>=21)||(m==7 && d<=22)) return {s:'Cancer', e:'Water'};
        if ((m==7 && d>=23)||(m==8 && d<=22)) return {s:'Leo', e:'Fire'};
        if ((m==8 && d>=23)||(m==9 && d<=22)) return {s:'Virgo', e:'Earth'};
        if ((m==9 && d>=23)||(m==10 && d<=22)) return {s:'Libra', e:'Air'};
        if ((m==10 && d>=23)||(m==11 && d<=21)) return {s:'Scorpio', e:'Water'};
        if ((m==11 && d>=22)||(m==12 && d<=21)) return {s:'Sagittarius', e:'Fire'};
        if ((m==12 && d>=22)||(m==1 && d<=19)) return {s:'Capricorn', e:'Earth'};
        if ((m==1 && d>=20)||(m==2 && d<=18)) return {s:'Aquarius', e:'Air'};
        return {s:'Pisces', e:'Water'};
    };
    const affinity = (te, me) => (te===me)?2:((te==='Fire'&&me==='Air')||(te==='Air'&&me==='Fire')||(te==='Earth'&&me==='Water')||(te==='Water'&&me==='Earth'))?1:0;
    const zM = getZodiac(matchDate);

    const chaldean = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':8,'G':3,'H':5,'I':1,'J':1,'K':2,'L':3,'M':4,'N':5,'O':7,'P':8,'Q':1,'R':2,'S':3,'T':4,'U':6,'V':6,'W':6,'X':5,'Y':1,'Z':7};
    const calcChaldean = (str) => {
        let sum = 0;
        for (let c of str.replace(/[^A-Z]/g, '')) sum += chaldean[c]||0;
        return sum%9||9;
    };

    // --- PILLAR 1: TWIN NUMEROLOGY ---
    const pythagorean = (char) => (char.charCodeAt(0) - 65) % 9 + 1;
    let chA = calcChaldean(teamA), chB = calcChaldean(teamB);
    let pyA = 0, pyB = 0;
    for (let c of teamA.replace(/[^A-Z]/g, '')) pyA += pythagorean(c);
    for (let c of teamB.replace(/[^A-Z]/g, '')) pyB += pythagorean(c);
    pyA = pyA%9||9; pyB = pyB%9||9;

    const mDay = matchDate.getDate()%9||9;
    let numWinnerA = 0, numWinnerB = 0;
    if (Math.abs(chA - mDay) < Math.abs(chB - mDay)) numWinnerA++; else numWinnerB++;
    if (Math.abs(pyA - mDay) < Math.abs(pyB - mDay)) numWinnerA++; else numWinnerB++;

    let divineConf = false;
    if (numWinnerA === 2) { scoreA += 3; divineConf = teamA; }
    else if (numWinnerB === 2) { scoreB += 3; divineConf = teamB; }
    else { scoreA += 1; scoreB += 1; }

    // --- PILLAR 2: CLUB ASTROLOGY ---
    const lCycle = 29.53, kNew = new Date("2000-01-06T18:14:00Z");
    const phaseRaw = ((matchDate - kNew)/(864e5)) % lCycle;
    const isWax = phaseRaw < (lCycle/2);
    const isFullOrNew = (phaseRaw < 1 || Math.abs(phaseRaw - 14.7) < 1);
    const astroWeight = isFullOrNew ? 4 : 2;

    const zA = getZodiac(dateA), zB = getZodiac(dateB);
    let astroW = "Neutral";
    if (affinity(zA.e, zM.e) > affinity(zB.e, zM.e)) { scoreA += (astroWeight/2); astroW = teamA; }
    else if (affinity(zB.e, zM.e) > affinity(zA.e, zM.e)) { scoreB += (astroWeight/2); astroW = teamB; }

    let lunarW = "Neutral";
    if (isWax) {
        lunarW = dateA > dateB ? teamA : teamB;
        dateA > dateB ? scoreA+=(astroWeight/2) : scoreB+=(astroWeight/2);
    } else {
        lunarW = dateA < dateB ? teamA : teamB;
        dateA < dateB ? scoreA+=(astroWeight/2) : scoreB+=(astroWeight/2);
    }

    // --- PILLAR 3: COMMANDER ASTROLOGY ---
    const zMgrA = getZodiac(mgrA), zMgrB = getZodiac(mgrB);
    let mgrWinner = "Neutral";
    if (affinity(zMgrA.e, zM.e) > affinity(zMgrB.e, zM.e)) { scoreA += 2; mgrWinner = teamA; }
    else if (affinity(zMgrB.e, zM.e) > affinity(zMgrA.e, zM.e)) { scoreB += 2; mgrWinner = teamB; }

    // --- PILLAR 4: CAPTAIN BIORHYTHMS ---
    const getBio = (dob) => {
        const days = (matchDate - dob) / 864e5;
        const phys = Math.sin(2 * Math.PI * (days / 23));
        const emot = Math.sin(2 * Math.PI * (days / 28));
        const inte = Math.sin(2 * Math.PI * (days / 33));
        return phys + emot + inte;
    };
    const bioA = getBio(capA), bioB = getBio(capB);
    let bioWinner = bioA > bioB ? teamA : teamB;
    bioA > bioB ? scoreA += 2 : scoreB += 2;

    // --- PILLAR 5: CHROMOTHERAPY ---
    const dayColors = {
        0: ['Yellow', 'Gold'],
        1: ['White', 'Silver'],
        2: ['Red', 'Pink'],
        3: ['Orange'],
        4: ['Blue'],
        5: ['Green'],
        6: ['Black']
    };
    const mDayOfWeek = matchDate.getDay();
    const rulingColors = dayColors[mDayOfWeek] || [];

    let colorWinner = "None / Neutral";
    if (rulingColors.includes(colA) && !rulingColors.includes(colB)) { scoreA += 2; colorWinner = teamA; }
    else if (rulingColors.includes(colB) && !rulingColors.includes(colA)) { scoreB += 2; colorWinner = teamB; }

    // --- PILLAR 6: GEOMANCY ---
    const geomanticFigures = ["Via", "Populus", "Conjunctio", "Albus", "Amissio", "Acquisitio", "Letitia", "Tristitia", "Puella", "Puer", "Rubeus", "Carcer", "Caput Draconis", "Cauda Draconis", "Fortuna Major", "Fortuna Minor"];
    let geoHash = 0;
    for (let i = 0; i < stadium.length; i++) geoHash = Math.imul(31, geoHash) + stadium.charCodeAt(i) | 0;
    const geoIndex = Math.abs(geoHash + matchDate.getDate()) % 16;
    const activeFigure = geomanticFigures[geoIndex];
    let geoWinner = geoIndex % 2 !== 0 ? teamA : teamB;
    geoIndex % 2 !== 0 ? scoreA += 2 : scoreB += 2;

    // --- PILLAR 7: THE JUDGE ---
    const refNum = calcChaldean(referee);
    let refWinner = "Neutral";
    if (Math.abs(chA - refNum) < Math.abs(chB - refNum)) { scoreA += 2; refWinner = teamA; }
    else if (Math.abs(chB - refNum) < Math.abs(chA - refNum)) { scoreB += 2; refWinner = teamB; }
    else { scoreA += 1; scoreB += 1; }

    // --- PILLAR 8: PLANETARY TRANSITS (Mercury Retrograde) ---
    // Hardcoded ephemeris for 2024-2027
    const retrogradeRanges = [
        [new Date('2024-04-01'), new Date('2024-04-25')], [new Date('2024-08-05'), new Date('2024-08-28')], [new Date('2024-11-25'), new Date('2024-12-15')],
        [new Date('2025-03-15'), new Date('2025-04-07')], [new Date('2025-07-18'), new Date('2025-08-11')], [new Date('2025-11-09'), new Date('2025-11-29')],
        [new Date('2026-02-26'), new Date('2026-03-20')], [new Date('2026-06-29'), new Date('2026-07-23')], [new Date('2026-10-24'), new Date('2026-11-13')],
        [new Date('2027-02-09'), new Date('2027-03-03')], [new Date('2027-06-10'), new Date('2027-07-04')], [new Date('2027-10-07'), new Date('2027-10-28')]
    ];
    const isRetrograde = retrogradeRanges.some(range => matchDate >= range[0] && matchDate <= range[1]);
    let transitWinner = "Direct Alignment (Neutral)";

    if (isRetrograde) {
        scoreB += 3; // Massive Chaos modifier favoring the invading/away team
        transitWinner = `<span class="highlight">MERCURY RETROGRADE!</span><br>Chaos favors the invader: <strong>${teamB}</strong>`;
    }

    // --- PILLAR 9: I CHING ---
    const ichingSeed = `${teamA}${teamB}${matchDate.getTime()}`;
    let iHash = 0;
    for (let i=0; i<ichingSeed.length; i++) iHash = Math.imul(31, iHash) + ichingSeed.charCodeAt(i) | 0;
    const hex = Math.abs(iHash) % 64 + 1;
    let ichingWinner = hex % 2 !== 0 ? teamA : teamB;
    hex % 2 !== 0 ? scoreA += 2 : scoreB += 2;

    // ==========================================
    // 🖥️ ASYNC UI UPDATE
    // ==========================================
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');

        document.getElementById('numOutput').innerHTML = `Chaldean & Pythagorean compared.<br>Divine Confirmation: <strong>${divineConf ? `<span class="highlight">${divineConf}</span>` : 'Slight Deviation'}</strong>`;
        document.getElementById('astroOutput').innerHTML = `Sun Affinity: ${astroW}<br>Moon: ${isWax?'Waxing':'Waning'} (Favors ${lunarW})`;
        document.getElementById('managerOutput').innerHTML = `Home Aura: ${zMgrA.s} (${zMgrA.e})<br>Away Aura: ${zMgrB.s} (${zMgrB.e})<br><em>Favors: <span class="highlight">${mgrWinner}</span></em>`;
        document.getElementById('geomancyOutput').innerHTML = `Stadium resonates with:<br><strong>${activeFigure}</strong><br><em>Favors: <span class="highlight">${geoWinner}</span></em>`;
        document.getElementById('bioOutput').innerHTML = `Net Resonance (P+E+I):<br>Home: ${bioA.toFixed(2)} | Away: ${bioB.toFixed(2)}<br><em>Favors: <span class="highlight">${bioWinner}</span></em>`;
        document.getElementById('colorOutput').innerHTML = `Day's ruling palette: <strong>${rulingColors.join(' / ')}</strong><br><em>Advantage: <span class="highlight">${colorWinner}</span></em>`;
        document.getElementById('refOutput').innerHTML = `Official's Resonance: <strong>${refNum}</strong><br><em>Bias favors:<br><span class="highlight">${refWinner}</span></em>`;

        document.getElementById('transitOutput').innerHTML = isRetrograde ? transitWinner : "Planets in direct motion.<br><em>Structure maintained.</em>";
        document.getElementById('ichingOutput').innerHTML = `Hexagram <strong>#${hex}</strong> cast.<br>State: ${hex%2!==0?'Yang (Active/Home)':'Yin (Receptive/Away)'} favoring <strong><span class="highlight">${ichingWinner}</span></strong>`;

        const victor = scoreA > scoreB ? teamA : (scoreB > scoreA ? teamB : "STALEMATE (Will of the Fates)");
        document.getElementById('finalVerdict').innerText = victor;

        document.getElementById('results').classList.remove('hidden');
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2800);
});

// ==========================================
// 📋 UTILITIES
// ==========================================
document.getElementById('copyBtn').addEventListener('click', () => {
    const text = `🔮 9 PILLARS OF PROPHECY 🔮\n⚽ ${document.getElementById('teamA').value.toUpperCase()} vs ${document.getElementById('teamB').value.toUpperCase()}\n\n🏆 Prophesied Victor: ${document.getElementById('finalVerdict').innerText}\n\nRead the stars yourself at the Arcane Forecaster!`;
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.innerText = "✅ Prophecy Copied!";
        setTimeout(() => copyBtn.innerText = "📋 Copy to Clipboard", 2500);
    }).catch(err => {
        alert("The fates blocked the copying process.");
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    document.querySelectorAll('input').forEach(el => el.value = '');
    document.getElementById('colorA').selectedIndex = 0;
    document.getElementById('colorB').selectedIndex = 0;
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loader').classList.add('hidden');
    
    document.getElementById('teamA').style.boxShadow = "none";
    document.getElementById('teamA').style.borderColor = "var(--glass-border)";
    document.getElementById('teamB').style.boxShadow = "none";
    document.getElementById('teamB').style.borderColor = "var(--glass-border)";
});