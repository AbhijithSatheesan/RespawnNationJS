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
export const GET_CATEGORY_GAMES = (name) => `games/category/${name}/`;


// Chat
export const GET_CHAT_ROOM= "chat/room";
export const CHAT_ROOM_HISTORY = (id) => `chat/room/${id}/history`;
export const SEND_CHAT = (id) => `chat/room/${id}/send/`;

// User
export const USER_TOURNAMENTS_DEATILS = 'tournaments/userdashboard/';
export const USER_SUBMIT_SCORE = 'tournaments/submit-score/';
export const USER_TOURNAMENT_MATCHES = (id) => `tournaments/${id}/my-matches/`


// Djoser
// --- DJOSER AUTHENTICATION ENGINE ROUTES ---
export const AUTH_REGISTER = "auth/users/";
export const AUTH_LOGIN = "auth/jwt/create/";
export const AUTH_ACTIVATE = "auth/users/activation/";
export const AUTH_PASSWORD_RESET = "auth/users/reset_password/";
export const AUTH_PASSWORD_RESET_CONFIRM = "auth/users/reset_password_confirm/";