// Simulated "database" to store contributions (replace with real backend in production)
let contributions = [
    { id: 1, html: '<p class="contrib">First collab! 🎉</p>', css: '.contrib { color: #ff6b6b; font-weight: bold; }', author: 'Friend1', timestamp: new Date() }
];

// Simulated user data (replace with authenticated user data from backend)
const userProfile = {
    username: 'CoolUser',
    status: 'Feeling: ✨ Creative ✨',
    bio: 'Hey! I’m just chilling in URSPACE. My friends and team make this page awesome by adding their own flair. What’s your vibe?',
    interests: ['Music', 'Coding', 'Art'],
    profilePic: 'https://via.placeholder.com/150'
};

// Initialize the page
function init() {
    renderProfile();
    renderContributions();
    setupEventListeners();
}

// Render user profile data
function renderProfile() {
    document.querySelector('.profile-header h2').textContent = `${userProfile.username}'s URSPACE`;
    document.querySelector('.status').textContent = userProfile.status;
    document.querySelector('.profile-pic').src = userProfile.profilePic;
    document.getElementById('bio-content').textContent = userProfile.bio;

    const interestsList = document.getElementById('interests-content');
    interestsList.innerHTML = userProfile.interests.map(item => `<li>${item}</li>`).join('');
}

// Render all contributions in the vibe section
function renderContributions() {
    const vibeContent = document.getElementById('vibe-content');
    vibeContent.innerHTML = ''; // Clear existing content

    // Add contributions as HTML
    contributions.forEach(contrib => {
        vibeContent.innerHTML += contrib.html;
    });

    // Apply contribution CSS
    const styleSheet = document.createElement('style');
    styleSheet.id = 'contrib-styles';
    styleSheet.textContent = contributions.map(contrib => contrib.css).join('\n');
    document.head.appendChild(styleSheet);

    // Update contribution list for viewing/toggling
    updateContributionList();
}

// Update the contribution list (for viewing/toggling)
function updateContributionList() {
    const list = document.createElement('div');
    list.className = 'contrib-list';
    list.innerHTML = '<h4>Contributions</h4>';

    contributions.forEach((contrib, index) => {
        const item = document.createElement('div');
        item.className = 'contrib-item';
        item.innerHTML = `
            <p><strong>${contrib.author}</strong> at ${contrib.timestamp.toLocaleString()}</p>
            <button onclick="toggleContribution(${index})">${contrib.enabled !== false ? 'Hide' : 'Show'}</button>
        `;
        list.appendChild(item);
    });

    const vibeSection = document.querySelector('.vibe');
    const existingList = vibeSection.querySelector('.contrib-list');
    if (existingList) existingList.remove();
    vibeSection.appendChild(list);
}

// Toggle a contribution's visibility
function toggleContribution(index) {
    contributions[index].enabled = !contributions[index].enabled;
    renderContributions();
}

// Basic client-side validation for HTML/CSS
function validateInput(html, css) {
    // Simple checks (replace with robust server-side validation)
    const forbiddenTags = ['script', 'iframe', 'object', 'embed'];
    const htmlLower = html.toLowerCase();

    for (const tag of forbiddenTags) {
        if (htmlLower.includes(`<${tag}`)) {
            return { valid: false, error: `Forbidden tag detected: ${tag}` };
        }
    }

    // Basic CSS validation (e.g., check for dangerous properties)
    if (css.toLowerCase().includes('javascript:') || css.includes('expression(')) {
        return { valid: false, error: 'Unsafe CSS detected' };
    }

    return { valid: true };
}

// Handle contribution form submission
function handleContribution(e) {
    e.preventDefault();

    const htmlInput = document.getElementById('html-input').value.trim();
    const cssInput = document.getElementById('css-input').value.trim();

    // Validate inputs
    const validation = validateInput(htmlInput, cssInput);
    if (!validation.valid) {
        alert(`Error: ${validation.error}`);
        return;
    }

    // Simulate contribution data
    const newContribution = {
        id: contributions.length + 1,
        html: htmlInput || '<p>New contribution!</p>',
        css: cssInput || '',
        author: 'Guest', // Replace with authenticated user
        timestamp: new Date(),
        enabled: true
    };

    // Add to contributions (in production, send to backend)
    contributions.push(newContribution);

    // Re-render contributions
    renderContributions();

    // Close modal and reset form
    closeContributeModal();
    e.target.reset();

    // In a real app, send to backend:
    /*
    fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContribution)
    })
    .then(response => response.json())
    .then(data => {
        contributions.push(data);
        renderContributions();
    })
    .catch(err => alert('Submission failed: ' + err));
    */
}

// Undo last contribution
function undoLastContribution() {
    if (contributions.length > 0) {
        contributions.pop();
        renderContributions();
        alert('Last contribution undone!');
    } else {
        alert('No contributions to undo.');
    }
}

// Modal Functions
function openContributeModal() {
    document.getElementById('contribute-modal').style.display = 'flex';
}

function closeContributeModal() {
    document.getElementById('contribute-modal').style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Contribution form submission
    document.getElementById('contribute-form').addEventListener('submit', handleContribution);

    // Add undo button to vibe section
    const vibeSection = document.querySelector('.vibe');
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo Last Contribution';
    undoButton.style.marginTop = '1rem';
    undoButton.addEventListener('click', undoLastContribution);
    vibeSection.appendChild(undoButton);
}

// Run initialization
document.addEventListener('DOMContentLoaded', init);
