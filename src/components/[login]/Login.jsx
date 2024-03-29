import React, { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";

import { USER } from "../../reducer/userReducer";
import { useTheme, useUser, useUserDispatch } from "../../hooks/customHook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../api/auth/AUTH";
import { checkDayExpiry, validateFormInput } from "../../utils/helpers";
import LoginRedirect from "../utils/LoginRedirect";
import Banner from "../utils/Banner";
import Label from "../form/Label";

import FormInput from "../form/FormInput";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const userDispatch = useUserDispatch();
    const user = useUser();
    const theme = useTheme();

    useEffect(() => {
        check();
    }, []);

    const check = () => {
        if (user.isAuth) {
            navigate(-1);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();

        const { isValid, message } = validateFormInput(email, password);

        if (!isValid) {
            toast.warn(message,{
                theme:theme == "dark" ? "dark" : "light"
            });
            return;
        }


        const data = {
            email: email,
            password: password,
        };
        const res = await login(data);

        if (res != null) {
            localStorage.setItem("token", res.token);

            await checkDayExpiry(res.user.day_timer, res.user, res.token);

            userDispatch({ type: USER.LOGGED_IN, payload: res.user });

            return navigate("/explore", { replace: true });
        } else {
            setEmail("");
            setPassword("");
            return navigate("/");
        }
    };
    return (
        <section className="h-[90vh] w-full flex-box  z-30">
            <div className=" w-[90%] lg:w-[30%] relative flex-box flex-col justify-start overflow-hidden self-start mt-[5em] bg-[#fffefe8d] dark:bg-[#1717178c] shadow-[rgba(0,_0,_0,_0.2)_0px_10px_20px_-7px] rounded-2xl ">
                <Banner>Login In</Banner>
                <Form
                    method="post"
                    className="w-full h-full p-5 flex-box flex-col gap-10 justify-end  "
                    autoComplete="off"
                >
                    <div className=" w-3/4 flex-box gap-2 flex-col items-start">
                        <Label>Email</Label>

                        <FormInput
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            placeholder="example@gmail.com"
                        />
                    </div>

                    <div className=" w-3/4 flex-box gap-2 flex-col items-start">
                        <Label>Password</Label>
                        <FormInput
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={handleLogin}
                        className="lg:text-lg px-[0.6em] py-[0.4em] text-white font-light bg-gradient-to-tl dark:from-red-600 dark:to-orange-400  from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500  dark:hover:from-red-500 dark:hover:to-orange-600 duration-200 rounded-xl"
                    >
                        LogIn
                    </button>
                    <LoginRedirect to={"/signup"} redirectText={"SignIn"}>
                        Not a User?&nbsp;
                    </LoginRedirect>
                </Form>
            </div>

        </section>
    );
};

export default Login;
