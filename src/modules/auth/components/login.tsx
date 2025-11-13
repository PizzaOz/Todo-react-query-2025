import { useAppDispath, useAppSelector } from "../../../shared/redux";
import { authSlice } from "../auth-slice";
import { loginThunk, useLoginLoding } from "./login-thunk";
import { registerThunk, useRegisterLoading } from "../register-thunk";
import { useState } from "react";

export function Login() {
  const dispatch = useAppDispath();
  const loginError = useAppSelector(authSlice.selectors.loginError);
  const isLoading = useLoginLoding();
  const isRegisterLoading = useRegisterLoading();
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const login = formData.get("login")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (isRegister) {
      dispatch(registerThunk(login, password));
    } else {
      dispatch(loginThunk(login, password));
    }
  };

  return (
    <div className="p-5 border border-slate-500 rounded-lg container mx-auto mt-10 max-w-md">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <h1 className="text-bold text-xl text-center">
          {isRegister ? "Регистрация" : "Вход"}
        </h1>
        <input
          className="p-3 rounded border border-slate-500"
          name="login"
          placeholder="Логин"
        />
        <input
          className="p-3 rounded border border-slate-500"
          name="password"
          type="password"
          placeholder="Пароль"
        />
        {loginError && (
          <div className="bg-rose-500 text-white p-3 rounded">{loginError}</div>
        )}

        <button
          disabled={isLoading || isRegisterLoading}
          className="p-3 rounded bg-teal-500 text-white disabled:bg-slate-300"
        >
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>

        <button
          type="button"
          className="p-2 text-blue-500 underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}
