// Get current day
function getCurrentDay() {
    const dayIndex = new Date().getDay();
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayMap[dayIndex];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed'];
    
    // If current day is in DAYS array, use it; otherwise default to 'Mon'
    return DAYS.includes(currentDay) ? currentDay : 'Mon';
}

// Application state
const state = {
    selectedDay: getCurrentDay(),
    courses: [
        {
            id: '1',
            code: '01876',
            name: 'Digital Logic and Circuits',
            section: 'K',
            sessions: [
                { type: 'Theory', time: 'Sun 1:0 PM - 2:30 PM', room: 'DS0504' },
                { type: 'Theory', time: 'Tue 1:0 PM - 2:30 PM', room: 'DS0504' },
            ]
        },
        {
            id: '2',
            code: '01530',
            name: 'Web Technologies',
            section: 'G',
            sessions: [
                { type: 'Theory', time: 'Mon 3:0 PM - 5:0 PM', room: '9402' },
                { type: 'Lab', time: 'Wed 3:0 PM - 5:20 PM', room: 'DS0104' },
            ]
        },
        {
            id: '3',
            code: '00994',
            name: 'Compiler Design',
            section: 'G',
            sessions: [
                { type: 'Theory', time: 'Mon 12:40 PM - 2:40 PM', room: '9406' },
                { type: 'Lab', time: 'Wed 12:40 PM - 3:0 PM', room: 'DS0203' },
            ]
        },
        {
            id: '4',
            code: '00395',
            name: 'Chemistry',
            section: 'G',
            sessions: [
                { type: 'Theory', time: 'Tue 3:0 PM - 5:0 PM', room: '9212' },
                { type: 'Lab', time: 'Sun 3:0 PM - 5:20 PM', room: 'DE0201' },
            ]
        },
        {
            id: '5',
            code: '01703',
            name: 'Computational Statistics',
            section: 'E',
            sessions: [
                { type: 'Theory', time: 'Sun 9:40 - 11:10', room: 'DN0712' },
                { type: 'Theory', time: 'Tue 9:40 - 11:10', room: 'DN0712' },
            ]
        },
    ]
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed'];

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateTimeString = now.toLocaleDateString('en-US', options);
    const dateTimeElement = document.getElementById('current-datetime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }
}

// Helper function to get sessions for a specific day
function getSessionsForDay(day) {
    const allSessions = [];

    state.courses.forEach(course => {
        course.sessions.forEach(session => {
            if (session.time.startsWith(day)) {
                allSessions.push({ course, session });
            }
        });
    });

    // Sort by time
    return allSessions.sort((a, b) => {
        const timeA = a.session.time.match(/(\d+):(\d+)/);
        const timeB = b.session.time.match(/(\d+):(\d+)/);
        if (!timeA || !timeB) return 0;

        const hourA = parseInt(timeA[1]);
        const hourB = parseInt(timeB[1]);

        return hourA - hourB;
    });
}

// Render day tabs
function renderDayTabs() {
    const tabsContainer = document.getElementById('day-tabs');
    tabsContainer.innerHTML = '';

    DAYS.forEach(day => {
        const button = document.createElement('button');
        button.className = `day-tab ${state.selectedDay === day ? 'active' : ''}`;
        button.textContent = day;
        button.onclick = () => selectDay(day);

        if (state.selectedDay === day) {
            const indicator = document.createElement('div');
            indicator.className = 'day-tab-indicator';
            button.appendChild(indicator);
        }

        tabsContainer.appendChild(button);
    });

    // After adding tabs, ensure the active tab is visible on small screens
    const activeBtn = tabsContainer.querySelector('.day-tab.active');
    if (activeBtn && activeBtn.scrollIntoView) {
        // Use nearest block to avoid jumping the whole layout
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

// Render sessions for the selected day
function renderSessions() {
    const container = document.getElementById('sessions-container');
    const daySessions = getSessionsForDay(state.selectedDay);

    if (daySessions.length === 0) {
        container.innerHTML = '<div class="empty-state">No classes</div>';
        return;
    }

    container.innerHTML = '';

    daySessions.forEach(({ course, session }, index) => {
        const sessionCard = document.createElement('div');
        sessionCard.className = 'session-card';
        sessionCard.innerHTML = `
            <div class="session-header">
                <div class="session-info">
                    <div class="session-time">${session.time}</div>
                    <h3 class="session-title">${course.name}${course.section ? ` <span class="session-section">[${course.section}]</span>` : ''} <span class="session-badge ${session.type.toLowerCase()}">${session.type}</span></h3>
                </div>
                <span class="session-room">${session.room}</span>
            </div>
        `;
        container.appendChild(sessionCard);
    });
}

// Handle day selection
function selectDay(day) {
    state.selectedDay = day;
    renderDayTabs();
    renderSessions();
}

// Initialize the app
function init() {
    updateDateTime();
    renderDayTabs();
    renderSessions();
    
    // Update time every second
    setInterval(updateDateTime, 1000);

    // Add narrow-screen class for very small devices (helps CSS tweaks)
    function updateNarrowClass() {
        if (window.innerWidth <= 380) {
            document.body.classList.add('narrow-screen');
        } else {
            document.body.classList.remove('narrow-screen');
        }
    }

    updateNarrowClass();
    window.addEventListener('resize', updateNarrowClass);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
