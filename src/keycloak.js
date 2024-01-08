import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://lab-keycloak2.vm-app.cloud.cbh.kth.se/",
    realm: "Fullstack",
    clientId: "fullstack-frontend",
});

export default keycloak;