import { link_api } from "../config/api-config";

export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${link_api.RESET_PASSWORD_LINK}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.name || "Something went wrong!");
    }

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
