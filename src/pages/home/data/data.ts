import axios from "axios";
import { useMutation, useQuery } from "react-query";

export interface loginOptions{
    UserName: string,
    Password: string
}

export interface newUser{
    UserName: string,
    Password: string
    Email: string
}

export const SignUp = async(newUser: newUser) =>{
    const response = await axios.post("https://veganapi.azurewebsites.net/Users/CreateUser", newUser);

    return response.data
}

export const Login = async(opts:loginOptions) =>{
    const response = await axios.post("https://veganapi.azurewebsites.net/Users/Login", opts);

    return response.data
}

export const GetAllUsers = async () => {
    const response = await axios.get("https://veganapi.azurewebsites.net/Users/GetAllUsers");

    return response.data
}

export const useSignUp = ()=>{
    return useMutation(({ newUser }: { newUser: newUser; }) =>
    SignUp(newUser)
  );
}

export const useLogin = () =>{
    return useMutation(({ opts }: { opts: loginOptions; }) =>
    Login(opts)
  );
}

export const useGetAllUsers = () =>{
    return useQuery('getAllUsers', GetAllUsers);
}