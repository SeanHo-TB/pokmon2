// Pokemon JSON Parser - Activity 02
// Discovery Challenge: Master JSON parsing and API integration through exploration!

// API Configuration
const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

// DOM Elements - Already connected for you
const pokemonInput = document.getElementById('pokemonInput');
const searchBtn = document.getElementById('searchBtn');
const showRawBtn = document.getElementById('showRawBtn');
const parseStatsBtn = document.getElementById('parseStatsBtn');
const parseMovesBtn = document.getElementById('parseMovesBtn');
const parseTypesBtn = document.getElementById('parseTypesBtn');
const randomPokemonBtn = document.getElementById('randomPokemonBtn');
const compareBtn = document.getElementById('compareBtn');
const teamBuilderBtn = document.getElementById('teamBuilderBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const fallback = document.getElementById('fallback');

// Global variables - You'll use these to store API responses
let currentPokemonData = null;
let teamMembers = [];

// Sample fallback data for offline practice
const samplePokemonData = {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    types: [{ type: { name: "electric" } }],
    stats: [
        { base_stat: 35, stat: { name: "hp" } },
        { base_stat: 55, stat: { name: "attack" } },
        { base_stat: 40, stat: { name: "defense" } },
        { base_stat: 50, stat: { name: "special-attack" } },
        { base_stat: 50, stat: { name: "special-defense" } },
        { base_stat: 90, stat: { name: "speed" } }
    ],
    moves: [
        { move: { name: "thunder-shock" } },
        { move: { name: "quick-attack" } },
        { move: { name: "thunderbolt" } }
    ],
    sprites: {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    }
};

// Event Listeners - Study this pattern for connecting HTML to JavaScript
searchBtn.addEventListener('click', () => searchPokemon(pokemonInput.value));
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPokemon(pokemonInput.value);
});

// Quick access buttons - Examine how data attributes work
document.querySelectorAll('.pokemon-btn').forEach(btn => {
    btn.addEventListener('click', () => searchPokemon(btn.dataset.pokemon));
});

// JSON parsing buttons - You'll implement these functions
showRawBtn.addEventListener('click', showRawJSON);
parseStatsBtn.addEventListener('click', parseStatsOnly);
parseMovesBtn.addEventListener('click', parseMovesOnly);
parseTypesBtn.addEventListener('click', parseTypesOnly);

// Advanced feature buttons - Challenge yourself with these
randomPokemonBtn.addEventListener('click', getRandomPokemon);
compareBtn.addEventListener('click', compareTwoPokemon);
teamBuilderBtn.addEventListener('click', buildRandomTeam);

// Initialize sample JSON display - Study this structure!
document.getElementById('sampleJson').textContent = JSON.stringify(samplePokemonData, null, 2);

// Utility Functions
function showLoading() {
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    fallback.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
    results.classList.remove('hidden');
}

function showError(message) {
    hideLoading();
    results.innerHTML = `
        <div class="error-display">
            <h2>⚠️ Oops!</h2>
            <p>${message}</p>
            <p>Try searching for: pikachu, charizard, or any Pokemon name!</p>
        </div>
    `;
}

// DISCOVERY CHALLENGE 1: Implement Pokemon Search
// Research Question: How do you make HTTP requests in JavaScript?
// Goal: Fetch Pokemon data from an API and display it

async function searchPokemon(pokemonName) {
    console.log('Function searchPokemon called with:', pokemonName); // DEBUG LOG

    if (!pokemonName || pokemonName.trim() === '') {
        console.log('Empty input detected'); // DEBUG LOG
        showError('Please enter a Pokemon name or ID!');
        return;
    }

    showLoading();

    try {
        console.log('Fetching from URL:', `${POKEMON_API_BASE}/pokemon/${pokemonName.toLowerCase()}`); // DEBUG LOG

        // Fetch Pokemon data
        const response = await fetch(`${POKEMON_API_BASE}/pokemon/${pokemonName.toLowerCase()}`);

        console.log('Response status:', response.status); // DEBUG LOG

        if (!response.ok) {
            throw new Error(`Pokemon not found: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data); // DEBUG LOG

        // Store and display result
        currentPokemonData = data;
        displayPokemonCard(data);
        pokemonInput.value = '';

    } catch (error) {
        console.error('Error in searchPokemon:', error); // DEBUG LOG
        showError(`Could not find Pokemon "${pokemonName}". Check the spelling or try a different name!`);
    }
}

// DISCOVERY CHALLENGE 2: Random Pokemon Generator
// Research Question: How do you generate random numbers in JavaScript?
// Goal: Create a function that shows a random Pokemon

async function getRandomPokemon() {
    showLoading();

    try {
        // Generate random ID between 1 and 1010
        const randomId = Math.floor(Math.random() * 1010) + 1;
        console.log('🎲 Generated random ID:', randomId);

        // Reuse the existing search functionality
        // This follows the DRY principle (Don't Repeat Yourself)
        await searchPokemon(randomId.toString());

    } catch (error) {
        console.error('Error fetching random Pokemon:', error);
        showError('Could not fetch random Pokemon. Please try again!');
    }
}

// DISCOVERY CHALLENGE 3: JSON Structure Explorer
// Research Question: How do you format and display JSON data?
// Goal: Show the raw API response in a readable format

function showRawJSON() {
    if (!currentPokemonData) {
        showError('No Pokemon data available. Search for a Pokemon first!');
        return;
    }

    // Display formatted JSON
    // We modify the results directly since there wasn't a pre-built helper for this specific layout
    hideLoading();
    results.innerHTML = `
        <div class="json-display">
            <h3>JSON Data for ${currentPokemonData.name}</h3>
            <pre>${JSON.stringify(currentPokemonData, null, 2)}</pre>
        </div>
    `;
}

// DISCOVERY CHALLENGE 4: Data Extraction Mastery
// Research Question: How do you extract specific data from complex objects?
// Goal: Pull out only the stats from the Pokemon data

function parseStatsOnly() {
    if (!currentPokemonData) {
        showError('No Pokemon data available. Search for a Pokemon first!');
        return;
    }

    try {
        const stats = currentPokemonData.stats;

        // Create HTML for each stat
        const statsHTML = stats.map(stat =>
            `<div class="stat-card">
                <h4>${stat.stat.name.replace('-', ' ').toUpperCase()}</h4>
                <p>${stat.base_stat}</p>
            </div>`
        ).join('');

        // Display results
        hideLoading();
        results.innerHTML = `
            <div class="pokemon-card">
                <h2>${currentPokemonData.name} Stats</h2>
                <div class="pokemon-stats">
                    ${statsHTML}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error parsing stats:', error);
        showError('Could not parse Pokemon stats.');
    }
}

// DISCOVERY CHALLENGE 5: Array Processing Challenge
// Research Question: How do you handle large arrays efficiently?
// Goal: Extract and display Pokemon moves from a potentially huge array

function parseMovesOnly() {
    if (!currentPokemonData) {
        showError('No Pokemon data available. Search for a Pokemon first!');
        return;
    }

    try {
        // Get first 10 moves
        const moves = currentPokemonData.moves.slice(0, 10);

        // Create HTML list of moves
        // We handle the case where a Pokemon might have fewer than 10 moves gracefully by just mapping what's there
        const movesList = moves.map(moveItem =>
            `<li>${moveItem.move.name.replace(/-/g, ' ')}</li>`
        ).join('');

        // Display results
        hideLoading();
        results.innerHTML = `
            <div class="pokemon-card">
                <h2>${currentPokemonData.name} Moves (First 10)</h2>
                <ul style="list-style-type: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 20px;">
                    ${movesList}
                </ul>
            </div>
        `;

        // Note: added some inline styles for the list to look nice since we didn't add specific move classes in CSS

    } catch (error) {
        console.error('Error parsing moves:', error);
        showError('Could not parse Pokemon moves.');
    }
}

// DISCOVERY CHALLENGE 6: Dynamic Styling Challenge
// Research Question: How do you create dynamic, styled content?
// Goal: Extract types and apply Pokemon-themed styling

function parseTypesOnly() {
    if (!currentPokemonData) {
        showError('No Pokemon data available. Search for a Pokemon first!');
        return;
    }

    try {
        const types = currentPokemonData.types;

        // Create styled badges for each type
        // We use the 'type-badge' class from CSS along with specific 'type-typename' classes
        const typesHTML = types.map(type =>
            `<span class="type-badge type-${type.type.name}" 
                   style="padding: 0.5rem 1rem; border-radius: 20px; color: white; font-weight: bold; text-transform: capitalize; margin: 0 5px;">
                ${type.type.name}
            </span>`
        ).join('');

        // Display results
        hideLoading();
        results.innerHTML = `
            <div class="pokemon-card">
                <h2>${currentPokemonData.name} Types</h2>
                <div class="pokemon-types" style="display: flex; justify-content: center; margin-top: 2rem;">
                    ${typesHTML}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error parsing types:', error);
        showError('Could not parse Pokemon types.');
    }
}

// ADVANCED CHALLENGE 7: Concurrent API Calls
// Research Question: How do you handle multiple API requests efficiently?
// Goal: Compare two Pokemon by fetching their data simultaneously

async function compareTwoPokemon() {
    const pokemon1 = prompt('Enter first Pokemon name:');
    const pokemon2 = prompt('Enter second Pokemon name:');

    if (!pokemon1 || !pokemon2) {
        showError('Please enter both Pokemon names to compare!');
        return;
    }

    showLoading();

    try {
        // Fetch both Pokemon data concurrently using Promise.all
        const [p1Response, p2Response] = await Promise.all([
            fetch(`${POKEMON_API_BASE}/pokemon/${pokemon1.toLowerCase()}`),
            fetch(`${POKEMON_API_BASE}/pokemon/${pokemon2.toLowerCase()}`)
        ]);

        // Check success for both
        if (!p1Response.ok) throw new Error(`Pokemon ${pokemon1} not found`);
        if (!p2Response.ok) throw new Error(`Pokemon ${pokemon2} not found`);

        // Parse JSON for both
        const [data1, data2] = await Promise.all([
            p1Response.json(),
            p2Response.json()
        ]);

        // Display comparison
        displayComparison(data1, data2);

    } catch (error) {
        console.error('Error comparing Pokemon:', error);
        showError(`Could not compare Pokemon. Check that both names are correct!`);
    }
}

// MASTER CHALLENGE 8: Advanced Data Processing
// Research Question: How do you orchestrate complex async workflows?
// Goal: Generate, fetch, and display a team of random Pokemon

// Make function globally available for the 'Generate New Team' button
window.buildRandomTeam = buildRandomTeam;

async function buildRandomTeam() {
    console.log('🚀 buildRandomTeam called!');
    showLoading();

    try {
        const teamIds = new Set();
        // Generate 3 unique random IDs
        while (teamIds.size < 3) {
            const randomId = Math.floor(Math.random() * 1010) + 1;
            teamIds.add(randomId);
        }

        const idsArray = Array.from(teamIds);
        console.log('🎲 Generated team IDs:', idsArray);

        // Fetch all 3 concurrently
        console.log('Fetching Pokemon...');
        const responses = await Promise.all(
            idsArray.map(id => fetch(`${POKEMON_API_BASE}/pokemon/${id}`))
        );

        // Check for any failures
        for (const response of responses) {
            if (!response.ok) {
                console.error('Fetch failed for one Pokemon:', response.status);
                throw new Error(`Failed to fetch Pokemon: ${response.status}`);
            }
        }

        // Parse all JSON data
        const teamData = await Promise.all(
            responses.map(res => res.json())
        );

        console.log('Team assembled:', teamData);

        // Display the team
        displayTeam(teamData);

    } catch (error) {
        console.error('Error building team:', error);
        showError('Could not assemble your team. Please try again!');
    }
}

// Helper Functions (Already Complete - Use These!)

function displayPokemonCard(pokemon) {
    hideLoading();

    const types = pokemon.types.map(type =>
        `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
    ).join(' ');

    const stats = pokemon.stats.map(stat =>
        `<div class="stat-card">
            <h4>${stat.stat.name.replace('-', ' ').toUpperCase()}</h4>
            <p>${stat.base_stat}</p>
        </div>`
    ).join('');

    results.innerHTML = `
        <div class="pokemon-card">
            <h2>#${pokemon.id} ${pokemon.name}</h2>
            <div class="pokemon-image">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-info">
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Types:</strong> ${types}</p>
            </div>
            <div class="pokemon-stats">
                ${stats}
            </div>
        </div>
    `;
}

function displayTeam(team) {
    hideLoading();

    const teamHTML = team.map(pokemon =>
        `<div class="team-member">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h4>${pokemon.name}</h4>
            <p>ID: ${pokemon.id}</p>
            <p>Type: ${pokemon.types[0].type.name}</p>
        </div>`
    ).join('');

    results.innerHTML = `
        <div class="team-display">
            <h2>🏆 Your Random Pokemon Team</h2>
            <div class="team-container">
                ${teamHTML}
            </div>
            <button onclick="buildRandomTeam()" class="btn primary" style="margin-top: 1rem;">
                🎲 Generate New Team
            </button>
        </div>
    `;
}

function displayComparison(pokemon1, pokemon2) {
    hideLoading();

    results.innerHTML = `
        <div class="comparison-display">
            <h2>⚔️ Pokemon Comparison</h2>
            <div class="comparison-container">
                <div class="comparison-card">
                    <h3>${pokemon1.name}</h3>
                    <img src="${pokemon1.sprites.front_default}" alt="${pokemon1.name}">
                    <p>ID: ${pokemon1.id}</p>
                    <p>Height: ${pokemon1.height / 10}m</p>
                    <p>Weight: ${pokemon1.weight / 10}kg</p>
                </div>
                <div class="comparison-card">
                    <h3>${pokemon2.name}</h3>
                    <img src="${pokemon2.sprites.front_default}" alt="${pokemon2.name}">
                    <p>ID: ${pokemon2.id}</p>
                    <p>Height: ${pokemon2.height / 10}m</p>
                    <p>Weight: ${pokemon2.weight / 10}kg</p>
                </div>
            </div>
        </div>
    `;
}

// 🎓 DISCOVERY EXTENSION IDEAS:
// Once you've mastered the core challenges, explore these:
//
// BEGINNER EXTENSIONS:
// - Pokemon favorites system with localStorage
// - Search history with recent Pokemon
// - Type filtering and category browsing
//
// INTERMEDIATE EXTENSIONS:
// - Evolution chain exploration
// - Pokemon abilities and hidden stats
// - Move effectiveness calculator
//
// ADVANCED EXTENSIONS:
// - Pokemon battle simulator
// - Team composition analyzer
// - Performance optimizations
//
// CREATIVE EXTENSIONS:
// - Pokemon quiz game
// - Stats visualization charts
// - Voice search integration
// - Pokemon card generator

/*
🎯 DISCOVERY-BASED LEARNING PATH:

PHASE 1: FOUNDATION DISCOVERY (Challenges 1-3)
Research Focus: HTTP, JSON, Basic DOM
Skills Gained: API basics, data format understanding, simple display

PHASE 2: DATA MASTERY (Challenges 4-6)
Research Focus: Object navigation, array processing, dynamic styling
Skills Gained: Complex data extraction, efficient processing, UI design

PHASE 3: ADVANCED INTEGRATION (Challenges 7-8)
Research Focus: Concurrent programming, system design, user experience
Skills Gained: Performance optimization, complex workflows, professional patterns

🔬 RESEARCH METHODOLOGY:
1. EXPLORE the sample data structure first
2. INVESTIGATE the browser DevTools Network tab
3. EXPERIMENT with small code snippets in console
4. IMPLEMENT your discoveries step by step
5. ITERATE and improve based on results

🛠️ DEBUGGING STRATEGIES:
- console.log() every step of your data processing
- Use browser DevTools to inspect network requests
- JSON.stringify() to understand data structures
- Start simple, add complexity gradually

🏆 SUCCESS METRICS:
- Can fetch and display any Pokemon
- Successfully parse different data types
- Handle errors gracefully
- Code is clean and well-documented
- Demonstrable understanding of concepts

Master these challenges and you'll have built enterprise-level API integration skills! 🚀
*/