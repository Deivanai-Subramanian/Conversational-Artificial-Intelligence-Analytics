document.addEventListener('DOMContentLoaded', function () {
    // Function to update the last refresh time
    function updateLastRefreshTime() {
        const now = new Date();
        const formattedTime = now.toLocaleString();

        // Update the content of the element with id "lastRefreshTime"
        document.getElementById('lastRefreshTime').innerHTML = `Last Refresh: ${formattedTime}`;
    }

    // Call the function on page load
    updateLastRefreshTime();

    // Add an event listener for page refresh
    window.addEventListener('beforeunload', function () {
        // Save the current time in localStorage
        localStorage.setItem('lastRefreshTime', new Date().toISOString());
    });

    // Check if there is a last refresh time stored in localStorage
    const storedRefreshTime = localStorage.getItem('lastRefreshTime');
    if (storedRefreshTime) {
        // Convert the stored time to a Date object
        const lastRefreshTime = new Date(storedRefreshTime);
        
        // Display the last refresh time
        updateLastRefreshTime();
    }
});
