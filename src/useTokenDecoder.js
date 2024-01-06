import { useJwt } from "react-jwt";
import {useState} from "react";

function useTokenDecoder(initialToken) {
    // Initialize with an initial token or null
    const [token, setToken] = useState(initialToken);

    // Use the useJwt hook to decode the token
    const { decodedToken, isExpired } = useJwt(token);

    // Return the decoded token and its expiration status
    return [decodedToken, isExpired];
}

export default useTokenDecoder;
