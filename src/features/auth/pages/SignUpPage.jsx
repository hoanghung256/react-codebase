import { useForm } from "react-hook-form";
import { callApi } from "../../../common/utils/apiConnector";
import { METHOD } from "../../../common/constants/api";
import { authEndPoints } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import useLoading from "../../../common/hooks/useLoading";

function SignUpPage() {
    const navigate = useNavigate();
    const isLoading = useLoading();
    const {
        register,
        handleSubmit,
        reset: resetForm,
        formState: { errors },
    } = useForm();
    

    const onSubmit = async (data) => {
        const res = await callApi({
            method: METHOD.POST,
            endpoint: authEndPoints.SIGN_UP_API,
            arg: {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            },
            displaySuccessMessage: true,
            alertErrorMessage: true,
        });

        if (res && confirm("Đăng ký thành công! Login để tiếp tục")) {
            navigate("/login");
        }
        resetForm();
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 24, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <h2 style={{ marginBottom: 16 }}>Tạo tài khoản</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="fullName" style={{ display: "block", marginBottom: 6 }}>
                        Họ và tên
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        {...register("fullName", {
                            required: "Vui lòng nhập họ và tên",
                            minLength: { value: 2, message: "Tên quá ngắn" },
                        })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}
                    />
                    {errors.fullName && (
                        <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.fullName.message}</span>
                    )}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email", {
                            required: "Vui lòng nhập email",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email không hợp lệ",
                            },
                        })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}
                    />
                    {errors.email && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.email.message}</span>}
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Tối thiểu 6 ký tự"
                        {...register("password", {
                            required: "Vui lòng nhập mật khẩu",
                            minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                        })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 6 }}
                    />
                    {errors.password && (
                        <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.password.message}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: isLoading ? "#94a3b8" : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </button>
            </form>
        </div>
    );
}

export default SignUpPage;
