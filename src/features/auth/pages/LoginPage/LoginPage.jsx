import { useForm } from "react-hook-form";
import useLoading from "../../../../common/hooks/useLoading";
import { callApi } from "../../../../common/utils/apiConnector";
import { METHOD } from "../../../../common/constants/api";
import { authEndPoints } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../../../../common/store/authSlice";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const isLoading = useLoading();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset: resetForm,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { success, data: responseData, message } = await callApi({
            method: METHOD.POST,
            endpoint: authEndPoints.LOGIN_API,
            arg: {
                email: data.email,
                password: data.password,
            },
            displaySuccessMessage: true,
            alertErrorMessage: true,
        });

        if (success) {
            localStorage.setItem("user", JSON.stringify(responseData.user));
            localStorage.setItem("token", JSON.stringify(responseData.token));
            dispatch(setUserData(responseData.user));
            dispatch(setToken(responseData.token));

            navigate("/");
        }
        resetForm();
    };

    return (
        <div>
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" {...register("password", { required: "Password is required" })} />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                {isLoading ? <p>...Loading</p> : <button type="submit">Login</button>}
            </form>
        </div>
    );
}

export default LoginPage;
