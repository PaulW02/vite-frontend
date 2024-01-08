import {apiRequests} from "./ApiRequests";
import Keycloak from "keycloak-js";

const serverUrl = "https://api-gateway.app.cloud.cbh.kth.se";

const _kc = new Keycloak("/keycloak.json");

const initKeycloak = (onAuthenticatedCallback) => {
    _kc
        .init({
            onLoad: "login-required",
        })
        .then((authenticated) => {
            if (!authenticated) {
                console.log("user is not authenticated..!");
            }
            onAuthenticatedCallback();
        })
        .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = () => _kc.updateToken(10);

const getParsedToken = () => _kc.tokenParsed;

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getSub = () => _kc.tokenParsed?.sub;

const getFullName = () =>
    _kc.tokenParsed?.given_name + " " + _kc.tokenParsed?.family_name;

const getEmail = () => _kc.tokenParsed?.email;

const getNameAndEmail = () => getFullName() + ", " + getEmail();

const hasRole = (role) => {
    let roles = getRoles();
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] === role) return true;
    }
    return false;
};

const isDoctor = () => {
    return hasRole("role_doctor");
}

const isEmployee = () => {
    return hasRole("role_employee");
}

const isPatient = () => {
    return hasRole("role_patient");
}

const getRoles = () => _kc.tokenParsed?.realm_access.roles;

async function registerUser(data) {
    let url = serverUrl + `/user/`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to register"}
    }
}

async function loginUser(data) {
    let url = serverUrl + `/user/login`;
    let body = JSON.stringify(data);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to register"}
    }
}

async function addRole(data) {
    let url = serverUrl + `/user/addRole`;
    let userId = getSub();
    let requestBody = {userId: userId, roleName: data}
    let body = JSON.stringify(requestBody);
    let response = await apiRequests.sendRequest(url, apiRequests.postRequest(body))
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Failed to register"}
    }
}

async function getAllUsers() {
    let url = serverUrl + `/user/`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Users not found"}
    }
}

async function getAllDoctors() {
    let url = serverUrl + `/user/doctors`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Users not found"}
    }
}

async function getAllEmployees() {
    let url = serverUrl + `/user/employees`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Users not found"}
    }
}

async function getAllPatients() {
    let url = serverUrl + `/user/patients`;
    let response = await apiRequests.sendRequest(url, apiRequests.getRequest())
    if (response.ok) {
        return {ok: true, status: response.status, response: response.response}
    } else {
        return {ok: false, status: response.status, response: "Users not found"}
    }
}

export const userService = {
    initKeycloak,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    updateToken,
    getUsername,
    getParsedToken,
    getSub,
    getFullName,
    getEmail,
    getNameAndEmail,
    getRoles,
    isDoctor,
    isPatient,
    isEmployee,
    hasRole,
    registerUser,
    loginUser,
    getAllUsers,
    getAllDoctors,
    getAllEmployees,
    getAllPatients,
    addRole
}