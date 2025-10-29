import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../shared/redux";
import { authSlice } from "./auth-slice";
import { authApi } from "./api";


export function useUser() {
    const userId = useAppSelector(authSlice.selectors.userId)
    return useQuery({
        ...authApi.getUserByid(userId!),
        enabled: Boolean(userId)
    })
}