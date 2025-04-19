import Cookies from 'js-cookie';

function saveDataToCookie(data, cookieName, expiresInSeconds) {
    console.log(`Saving data to cookie: ${cookieName}`, data);
    
    try {
        // Convert data to JSON string if it's an object
        const valueToStore = typeof data === 'object' ? JSON.stringify(data) : String(data);
        
        // Calculate expiry in days (Cookies.js uses days instead of seconds)
        const expiresInDays = expiresInSeconds / 86400;
        
        // Use js-cookie library for better cross-browser compatibility
        Cookies.set(cookieName, valueToStore, { 
            expires: expiresInDays, 
            path: '/',
            sameSite: 'strict'
        });
        
        // Verify cookie was set
        const savedCookie = Cookies.get(cookieName);
        console.log(`Cookie verification - ${cookieName}:`, savedCookie ? 'Set successfully' : 'Failed to set');
        
        if (!savedCookie) {
            console.error('Cookie verification failed');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error saving cookie:', error);
        return false;
    }
}

export default saveDataToCookie;
