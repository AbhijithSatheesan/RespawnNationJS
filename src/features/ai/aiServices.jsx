import api from "../../services/api";
import { CHATBOT } from "../../services/apiRoutes";

export const sendAIMessage = async ({
  message,
  history = [],
  summary = "",
}) => {
  const response = await api.post(CHATBOT, {
    message,
    history,
    summary,
  });

  return response.data;
};