import { link_api } from "../config/api-config";

 const verifyOtp = async (otp, email) => {
    try {
      const response = await fetch(`${link_api.VERIFY_OTP_LINK}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          email: email,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error?.name || "Something went wrong!");
      }
  
      return { success: true, message: data.message, resetToken: data.resetToken, data: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  export default verifyOtp;
  