import React from "react";
import "../../App.css";
import {Navigate, useParams} from "react-router-dom";
import { Button } from 'primereact/button';

const LoginPage = (props) => {
    const params = useParams()
    const token = params.token
    const user_type = params.user_type


    if (token && token.length > 20) {
        localStorage.setItem("token", params.token)
        localStorage.setItem("user_type", user_type)
        if (user_type === "student") {
            Navigate({to: '/'})

        }
        else if (user_type === "instructor") {
            Navigate({to: '/instructor/GA'})
        }
    }

    const login = () => {
        console.log("login")
        window.open(process.env.REACT_APP_BACKEND_URL + 'login/google', '_self')
    }

    return (
        <>
            <div className="md:h-36"></div>
            <div className="max-w-6xl bg-lime-50 m-auto rounded-lg pt-2 md:pb-2 pb-10 px-2">
                <div className="divide-lime-400 lg:grid lg:grid-cols-2 lg:divide-x">
                    <div className="h-96 m-auto flex flex-col align-middle justify-center">
                        <img alt="logo" className="h-48 object-contain" src={require('../../assets/logo.png')}/>
                        <div className="text-xl pt-5 text-center">
                            Welcome To Study Buddy
                        </div>
                    </div>
                    <div className="h-96 ">
                        <div className="flex flex-col align-middle justify-center h-80">
                            <div className="mx-auto text-2xl">
                                Hi
                            </div>
                            <div className="mx-auto mb-3 mt-10 text-xl">
                                <div className="text-center mb-5">Continue to login</div>
                                <Button label="Login With Google" icon="pi pi-check" className="mt-5 w-full" onClick={login}/>
                            </div>
                            <div className="mx-auto w-80">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
