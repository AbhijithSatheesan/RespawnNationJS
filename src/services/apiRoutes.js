export const SEE_TOURNAMENTS = "/tournaments/seetournaments/";
export const TOURNAMENT_DETAILS = (id) => `tournaments/tournament/${id}/`;
export const RAZORPAY_GENERATE_ORDER = (id) => `tournaments/${id}/generate_order/`;
export const REGISTER_TOURNAMENT = (id) => `tournaments/${id}/register/`;

// Game Page
export const GAME_DETAILS = (id) => `games/game/${id}/`
export const GAME_TOURNAMENTS = (id) => `tournaments/game/${id}/`
export const WALLET_WITHDRAW = "accounts/wallet/withdraw/"
export const WALLET_DEPOSIT_ORDER = "accounts/wallet/deposit/generate/"
export const WALLET_DEPOSIT_VERIFY = "accounts/wallet/deposit/verify/"


// Chat
export const GET_CHAT_ROOM= "chat/room";
export const CHAT_ROOM_HISTORY = (id) => `chat/room/${id}/history`;
export const SEND_CHAT = (id) => `chat/room/${id}/send/`;