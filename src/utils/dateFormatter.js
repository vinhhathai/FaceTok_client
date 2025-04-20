/**
 * Format a date to a time string (HH:MM)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error("Error formatting time:", error);
    return '';
  }
};

/**
 * Format a date to a relative time (today, yesterday, DD/MM/YYYY)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted relative date
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Same day - show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }
    
    // This year - show day/month
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
    
    // Different year - show day/month/year
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return '';
  }
}; 