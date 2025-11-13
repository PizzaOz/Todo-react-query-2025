import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../shared/api/supabase-client";

export type UserDto = {
  id: string;
  login: string;
  password: string;
  createdAt?: string;
};

export const authApi = {
  baseKey: 'users',
  
  getUserByid: (id: string) => {
    return queryOptions({
      queryKey: [authApi.baseKey, 'byId', id],
      queryFn: async (meta) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .abortSignal(meta.signal)
          .single();

        if (error) throw new Error(error.message);
        return data as UserDto;
      }, 
    });
  },

  loginUser: async ({ login, password }: {login: string, password: string}) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('login', login)
      .eq('password', password);

    if (error) throw new Error(error.message);
    return data?.[0] as UserDto | undefined;
  },

  registerUser: async (userData: { login: string; password: string }) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      // createdAt: new Date().toISOString(),
    };
  
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();
  
    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(error.message);
    }
    
    return data as UserDto;
  }
};