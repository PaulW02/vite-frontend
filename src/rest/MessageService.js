import {apiRequests as apiRequest, apiRequests} from "./ApiRequests";


const serverUrl = "https://message-microservice.app.cloud.cbh.kth.se";
export const MessageService = {
    sendMessage,
    getMessagesByUser
}

async function sendMessage(data) {
    let url = serverUrl + `/message/`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to send message"}
    }
}

async function getMessagesByUser(userId) {
    const url = `${serverUrl}/message/conversations/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return { ok: true, status: response.status, response: await response.json() };
}