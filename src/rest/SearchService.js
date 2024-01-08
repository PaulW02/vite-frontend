import {apiRequests as apiRequest, apiRequests} from "./ApiRequests";
import {Error} from "@mui/icons-material";


const serverUrl = "https://quarkus-microservice.app.cloud.cbh.kth.se";
export const SearchService = {
    searchPatient,
    getAllPatients,
};

// Implementera de nya funktionerna

async function searchPatient(name, condition, encounterDate) {

    const url = `${serverUrl}/search/patients?name=${name}&condition=&encounterDate=`;

    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        console.log(response)
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Users not found"}
    }
}

async function getAllPatients() {
    const url = `${serverUrl}/search/patients/`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return { ok: true, status: response.status, response: await response.json() };
}
