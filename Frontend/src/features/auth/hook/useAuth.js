import { setError, setLoading, setUser } from "../state/auth.slice.js";
import { register,login } from "../service/auth.api.js";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ email, contact, password, fullname, isSeller });
            if (data?.user) {
                dispatch(setUser(data.user));
            }
            dispatch(setLoading(false));
            return { success: true, data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
            dispatch(setError(errorMsg));
            dispatch(setLoading(false));
            return { success: false, error: errorMsg };
        }
    }

    async function handleLogin({email, password}){
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await login({email, password});
            if (data?.user) {
                dispatch(setUser(data.user));
            }
            dispatch(setLoading(false));
            return { success: true, data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
            dispatch(setError(errorMsg));
            dispatch(setLoading(false));
            return { success: false, error: errorMsg };
        }
    }

    return {
        user,
        loading,
        error,
        handleRegister
    };
};
