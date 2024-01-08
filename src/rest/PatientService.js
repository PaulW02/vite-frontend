import {apiRequests as apiRequest, apiRequests} from "./ApiRequests";
import { userService } from "../rest/UserService";


const serverUrl = "https://api-gateway.app.cloud.cbh.kth.se";
export const PatientService = {
    searchPatient,
    getPatientInfo,
    getAllPatients,
    addObservation,
    addCondition,
    getPatientDetails,
    getPatientInfoById,
    getEncounterDetails, // Lägg till den nya funktionen
    getObservationsByEncounter, // Lägg till den nya funktionen
    addEncounter
};

// Implementera de nya funktionerna
async function getEncounterDetails(encounterId) {


    const url = `${serverUrl}/encounter/${encounterId}/`;

    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to get encounter details"}
    }
}

async function getObservationsByEncounter(encounterId) {
    const url = `${serverUrl}/encounter/${encounterId}/observations`;

    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to get observations by encounter"}
    }
}

async function searchPatient (firstName, lastName) {

    const url = `${serverUrl}/patient/search?firstName=${firstName}&lastName=${lastName}`;

  //  let body = JSON.stringify({firstName: firstName, lastName : lastName});
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to search patient"}
    }
}
async function getPatientDetails(id)
{
    const url = `${serverUrl}/patient/${id}/details`;

    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to get patient details"}
    }
}

async function getPatientInfo(userId) {
    const url = `${serverUrl}/patient/profile?userId=${userId}`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to get patient info"}
    }
}

async function getAllPatients() {
    const url = `${serverUrl}/patient/`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to get all patients"}
    }
}

async function addObservation(data) {
    let url = serverUrl + `/observation/`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to add observation"}
    }
}

async function addEncounter(data) {
    let url = serverUrl + `/encounter/`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to add encounter"}
    }
}

async function addCondition(data) {
    let url = serverUrl + `/condition/`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to add condition"}
    }
}
async function getPatientInfoById()
{
    const id = userService.getSub();
    const url = `${serverUrl}/patient/user/${id}`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return { ok: true, status: response.status, response: response.response };
}
