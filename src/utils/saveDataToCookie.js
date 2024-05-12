function saveDataToCookie(data, cookieName, expiresInSeconds) {
    try {
        const d = new Date();
        d.setTime(d.getTime() + (expiresInSeconds * 1000)); // milliseconds
        const expires = "expires=" + d.toUTCString();

        // Convert data to JSON string
        const jsonData = JSON.stringify(data);

        // Set cookie
        document.cookie = cookieName + "=" + jsonData + ";" + expires + ";path=/";

        // Kiểm tra xem cookie đã được thiết lập thành công hay không
        if (document.cookie.indexOf(cookieName) !== -1) {
            return true;
        } else {
            throw new Error('Failed to set cookie');
        }
    } catch (error) {
        return error;
    }
}

module.exports = saveDataToCookie;
