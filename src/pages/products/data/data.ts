import { message } from "antd";
import axios from "axios";
import querystring from 'querystring';
import { useContext } from "react";
import {
    useQuery,
    useMutation,
} from 'react-query'
import { UserContext } from "../../../App";

const redirectUrl = "https://veganapi.azurewebsites.net/.auth/login/google?post_login_redirect_uri=http://10.0.0.216:3000"

export interface productUpdateOptions {
    Id: string,
    Sighting: {
        Store: {
            Name: string
        },
        SpottedBy: string,
        Seen: Date,
        Street: string,
        City: string,
        State: string,
        ZipCode: number
    }

}

export interface productQuery {
    Name?: string,
    StoreName?: string,
    ZipCodes?: string[]
}

export interface newProduct {
    Name: string,
    Sighting: {
        Store: {
            Name: string
        },
        SpottedBy: string,
        Seen: Date,
        Street: string,
        City: string,
        State: string,
        ZipCode: number
    }
    Brand: string,
    Type: number,
    CreatedBy: string,
    CoverImage: string
}

export interface Sighting {
    Store: {
        Name: string
    },
    SpottedBy: string,
    Seen: Date,
    Street: string,
    City: string,
    State: string,
    ZipCode: number
}


export const AddProduct = async (newProduct: newProduct, token:string) => {
    await axios.post("https://veganapi.azurewebsites.net/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(r => {
            if (r.status === 401) {
                window.location.replace(redirectUrl)
            }
            message.success("Product Created")
        })
        .catch(r => message.error("Unable to add requested product. Make sure it does not already exist, then try again!"))
        .finally()
}

export const GetProducts = async (productQuery: productQuery, token:string) => {
    let params = '';
    if (productQuery.Name != null && productQuery.Name != undefined && productQuery.Name != "") {
        const url = new URLSearchParams({ Name: productQuery.Name.toUpperCase() }).toString();
        params += url
    }
    if (productQuery.StoreName != null) {
        const url = new URLSearchParams({ StoreName: productQuery.StoreName.toUpperCase() }).toString();
        params += url
    }
    if (productQuery.ZipCodes != null) {
        const url = new URLSearchParams();
        productQuery.ZipCodes.forEach(x => {
            url.append("ZipCodes", x)
        })
        params += url
    }
    const response = await axios.get("https://veganapi.azurewebsites.net/products?" + params, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

export const GetAllProducts = async (token:string) => {
    const response = await axios.get("https://veganapi.azurewebsites.net/products/", {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

export const UpdateProduct = async (productUpdateOptions: productUpdateOptions, token:string) => {
    await axios.patch("https://veganapi.azurewebsites.net/products", productUpdateOptions, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export const useUpdateProduct = () => {
    return useMutation(({ updates, token }: { updates: productUpdateOptions; token:string; }) =>
        UpdateProduct(updates, token).catch(() => localStorage.clear())
    );
}

export const useGetAllProducts = (token:string) => {
    return useQuery('products', () => GetAllProducts(token).catch(() => localStorage.clear()))
}

export const useAddProduct = () => {
    return useMutation(({ newProduct, token }: { newProduct: newProduct; token:string; }) =>
        AddProduct(newProduct, token).catch(() => localStorage.clear())
    );
}