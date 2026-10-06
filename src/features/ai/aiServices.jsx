import api from "../../services/api";
import { CHATBOT } from "../../services/apiRoutes";

export const sendAIMessage = async (message) => {
  const response = await api.post(CHATBOT, {
    message,
  });

  return response.data;
};