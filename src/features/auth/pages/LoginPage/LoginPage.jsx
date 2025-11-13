import { useForm } from "react-hook-form";
import useLoading from "../../../../common/hooks/useLoading";
import { callApi } from "../../../../common/utils/apiConnector";
import { METHOD } from "../../../../common/constants/api";
import { authEndPoints } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../../../../common/store/authSlice";
import { useNavigate } from "react-router-dom";
import DarkVeil from './DarkVeil';
import SplitText from "./SplitText";
import { TextField, Button, Typography } from '@mui/material';
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
    const handleAnimationComplete = () => {
        // optional callback when split text animation completes
    };

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
        <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
            {/* dark veil canvas fills the parent (canvas is absolutely positioned in its CSS) */}
            <DarkVeil />
                       
            {/* overlay container centers the login card */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: '24px' }}>
                {/* main two-column card */}
                <div style={{ width: '960px', maxWidth: 'calc(100% - 48px)', display: 'flex', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(2,6,23,0.7), 0 0 80px rgba(123,97,255,0.15)', border: '1px solid rgba(60,40,100,0.2)', minHeight: '560px', alignItems: 'stretch' }}>

                    {/* left: login column */}
                    <div style={{ flex: 1, padding: '40px 36px', background: 'linear-gradient(180deg, rgba(12,16,28,0.75) 0%, rgba(34,12,64,0.6) 100%)', color: '#f3eefc', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', backdropFilter: 'blur(8px)', borderRight: '1px solid rgba(123,97,255,0.12)', position: 'relative' }}>
                        
                        {/* decorative corner accent - top left */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(123,97,255,0.15) 0%, transparent 100%)', borderTopLeftRadius: '16px' }}></div>
                        
                        {/* decorative corner accent - bottom right */}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '80px', background: 'linear-gradient(315deg, rgba(123,97,255,0.1) 0%, transparent 100%)' }}></div>

                        <div style={{ textAlign: 'center', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                            <Typography variant="h4" style={{ fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', textShadow: '0 2px 12px rgba(123,97,255,0.3)' }}>
                                Welcome back
                            </Typography>
                            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #7B61FF, transparent)', margin: '12px auto 0', borderRadius: '2px' }}></div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="filled"
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    sx={{
                                        background: 'rgba(255,255,255,0.04)',
                                        '& .MuiFilledInput-input': { color: '#fff', padding: '16px 14px' },
                                        '& .MuiFilledInput-root': { borderRadius: '8px', transition: 'all 0.2s ease' },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                        '&:hover .MuiFilledInput-root': { background: 'rgba(255,255,255,0.06)' }
                                    }}
                                    {...register('email', { required: 'Email is required' })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="filled"
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    sx={{
                                        background: 'rgba(255,255,255,0.04)',
                                        '& .MuiFilledInput-input': { color: '#fff', padding: '16px 14px' },
                                        '& .MuiFilledInput-root': { borderRadius: '8px', transition: 'all 0.2s ease' },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                        '&:hover .MuiFilledInput-root': { background: 'rgba(255,255,255,0.06)' }
                                    }}
                                    {...register('password', { required: 'Password is required' })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {isLoading ? (
                                    <Typography color="#ddd">...Loading</Typography>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isLoading}
                                        fullWidth
                                        sx={{
                                            padding: '14px 28px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #4A148C 0%, #2E0A52 50%, #1A0A33 100%)',
                                            textTransform: 'none',
                                            fontSize: '17px',
                                            fontWeight: 700,
                                            boxShadow: '0 6px 20px rgba(74, 20, 140, 0.6), 0 0 30px rgba(123,97,255,0.15)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5c20a4 0%, #401070 50%, #29104a 100%)',
                                                boxShadow: '0 8px 28px rgba(74, 20, 140, 0.8), 0 0 40px rgba(123,97,255,0.25)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                )}
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Typography style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                                    Don't have an account?{' '}
                                    <span 
                                        onClick={() => navigate('/signup')} 
                                        style={{ color: '#7B61FF', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                        Sign up
                                    </span>
                                </Typography>
                            </div>
                        </form>
                    </div>

                    {/* right: info / promo column */}
                    <div style={{ flex: 1, minHeight: '100%', padding: '40px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #1a0b3d 30%, #2d1055 60%, #0d0d0d 100%)', position: 'relative', overflow: 'hidden' }}>
                        
                        {/* decorative floating circles */}
                        <div style={{ position: 'absolute', top: '10%', right: '15%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>
                        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,20,140,0.12) 0%, transparent 70%)', filter: 'blur(25px)' }}></div>
                        
                        {/* decorative grid pattern overlay */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(123,97,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,97,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }}></div>

                        <div style={{ textAlign: 'center', pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
                            <div style={{ marginBottom: '16px' }}>
                                <SplitText
                                    text="InterVu"
                                    tag="h1"
                                    className="text-3xl font-bold"
                                    delay={35}
                                    duration={0.9}
                                    ease="power3.out"
                                    splitType="chars"
                                    from={{ opacity: 0, y: 20 }}
                                    to={{ opacity: 1, y: 0 }}
                                    threshold={0.1}
                                    rootMargin="-100px"
                                    textAlign="center"
                                    onLetterAnimationComplete={handleAnimationComplete}
                                    playOnMount={true}
                                    loop={true}
                                    loopDelay={1.2}
                                    color="#ffffff"
                                />
                            </div>
                            
                            <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(123,97,255,0.8), transparent)', margin: '16px auto', borderRadius: '2px' }}></div>
                            
                            <div>
                                <SplitText
                                    text="Online Interview Support System"
                                    tag="h2"
                                    className="text-xl"
                                    delay={45}
                                    duration={0.9}
                                    ease="power3.out"
                                    splitType="chars"
                                    from={{ opacity: 0, y: 20 }}
                                    to={{ opacity: 1, y: 0 }}
                                    threshold={0.1}
                                    rootMargin="-100px"
                                    textAlign="center"
                                    onLetterAnimationComplete={handleAnimationComplete}
                                    playOnMount={true}
                                    loop={true}
                                    loopDelay={1.2}
                                    color="#e0d9ff"
                                />
                            </div>
                            
                            {/* decorative subtitle */}
                            <div style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', lineHeight: '1.6' }}>
                                Created and operated by TheSuperTeam
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
