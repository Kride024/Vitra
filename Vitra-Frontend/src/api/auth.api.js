import api from "./api";

export const loginUser = (credentials) => {
    return api.post("/users/login",credentials);
}

export const registerUser = (data) =>{
    return api.post("/users/register", data);
}

export const getMyProfile = () => {
    return api.get("/users/me");
}