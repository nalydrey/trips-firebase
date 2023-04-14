import axios from "axios";

const token = process.env.REACT_APP_TOKEN
const chatId = process.env.REACT_APP_BOT
const url_bot = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}`

export const sendToTelegram = async (text) => {
    await axios.post(url_bot, {text})
}