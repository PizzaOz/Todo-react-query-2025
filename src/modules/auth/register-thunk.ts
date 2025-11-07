import { MutationObserver, useMutation } from "@tanstack/react-query";
import { AppThunk } from "../../shared/redux";
import { queryClient } from "../../shared/api/query-client";
import { authApi } from "./api";
import { authSlice } from "./auth-slice";
import { jsonApiInstance } from "../../shared/api/api-instance";
import { UserDto } from "./api";

export const registerThunk =
  (login: string, password: string): AppThunk =>
  async (dispatch) => {
    if (!login.trim() || !password.trim()) {
      dispatch(authSlice.actions.setError("Заполните логин и пароль"));
      return;
    }

    if (password.length < 6) {
      dispatch(authSlice.actions.setError("Пароль должен быть не менее 6 символов"));
      return;
    }

    try {
      // ПРОВЕРКА УНИКАЛЬНОСТИ ЛОГИНА
      const existingUsers = await jsonApiInstance<UserDto[]>(`/users?login=${login}`);
      if (existingUsers.length > 0) {
        dispatch(authSlice.actions.setError("Пользователь с таким логином уже существует"));
        return;
      }

      // Если логин уникальный - создаем пользователя
      const user = await new MutationObserver(queryClient, {
        mutationKey: ['register'],
        mutationFn: () => authApi.registerUser({ login, password }),
      }).mutate();

      if (user) {
        dispatch(
          authSlice.actions.addUser({
            userId: user.id,
          })
        );
        
        queryClient.setQueryData(authApi.getUserByid(user.id).queryKey, user)
        localStorage.setItem('userId', user.id)
      }
    } catch (error) {
      dispatch(authSlice.actions.setError("Ошибка регистрации"));
    }
  };

export const useRegisterLoading = () => 
  useMutation({
      mutationKey: ['register']
  }).isPending