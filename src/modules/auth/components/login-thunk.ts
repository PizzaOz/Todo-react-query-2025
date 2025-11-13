import { MutationObserver, useMutation } from "@tanstack/react-query";
import { AppThunk } from "../../../shared/redux";
import { queryClient } from "../../../shared/api/query-client";
import { authApi } from "../api";
import { authSlice } from "../auth-slice";

export const loginThunk =
  (login: string, password: string): AppThunk =>
  async (dispatch) => {

    if (!login.trim() || !password.trim()) {
      dispatch(authSlice.actions.setError("Заполните логин и пароль"));
      return;
    }

    const user = await new MutationObserver(queryClient, {
      mutationKey: ['login'],
      mutationFn: authApi.loginUser,
    }).mutate({
      login,
      password,
    });

    if (user) {
      dispatch(
        authSlice.actions.addUser({
          userId: user.id,
        })
      );
      
      queryClient.setQueryData(authApi.getUserByid(user.id).queryKey, user)
      localStorage.setItem('userId', user.id)
    } else {

      dispatch(authSlice.actions.setError("Пароль и Логин неверный"));
    }

  };

  export const useLoginLoding = () => 
    useMutation({
        mutationKey: ['login']
    }).isPending
