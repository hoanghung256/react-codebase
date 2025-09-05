import React from "react";
import { useForm } from "react-hook-form";

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // Handle login logic here
        alert(`Email: ${data.email}\nPassword: ${data.password}`);
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
