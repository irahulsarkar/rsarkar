// Main Cal.com integration
document.addEventListener('DOMContentLoaded', function() {
    initializeCalEmbed();
});

function initializeCalEmbed() {
    // Load Cal.com script dynamically
    if (!document.querySelector('script[src="https://cal.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cal.com/embed.js';
        script.onload = setupCalEmbed;
        document.body.appendChild(script);
    } else {
        setupCalEmbed();
    }
}

function setupCalEmbed() {
    if (typeof Cal === 'undefined') {
        console.error('Cal.com script failed to load');
        return;
    }

    // Initialize Cal.com
    Cal('init', {
        origin: 'https://cal.com'
    });
    
    // Setup inline embed
    Cal('inline', {
        elementOrSelector: '#cal-embed',
        calLink: 'rsarkar',
        config: {
            theme: 'light',
            branding: {
                brandColor: '#3a86ff',
                brandName: 'Rohan Sarkar'
            },
            hideEventTypeDetails: false,
            layout: 'month_view'
        }
    });
    
   
    Cal('floatingButton', {
        calLink: 'rsarkar',
        config: {
            name: '',
            email: '',
            notes: 'Booking from website',
            theme: 'auto'
        }
    });
    
}