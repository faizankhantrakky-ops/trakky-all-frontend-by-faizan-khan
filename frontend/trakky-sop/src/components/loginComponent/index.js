"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ----- Yup validation schema -----
const LoginSchema = Yup.object().shape({
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    password: Yup.string()
        .required("Password is required")
        .trim()
        .min(1, "Password cannot be empty"),
    remember: Yup.boolean(),
});

// ----------------------------------------------------

const LoginComponent = () => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="relative w-full min-h-screen px-8 pt-40 pb-20 lg:pt-56 flex items-center justify-center bg-white">

                <div className="absolute inset-0 flex justify-center items-center -z-10">
                    <div className="w-[600px] h-[400px] bg-gradient-to-r from-[#b5accf8f] via-[#ab97e3] to-[#A088F7] rounded-3xl blur-3xl opacity-40"></div>
                </div>

                <div className="w-full max-w-[1200px] px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-2 bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

                    <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-[#faf9ff] via-[#f5f3ff] to-[#ede9ff] p-12 text-center relative overflow-hidden">

                        <div className="absolute top-10 animate-bounce right-10 w-20 h-20 bg-[#5E38D1]/10 rounded-full"></div>
                        <div className="absolute animate-bounce bottom-10 left-10 w-16 h-16 bg-[#A088F7]/15 rounded-2xl rotate-45"></div>

                        <div className="relative z-10">
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold text-[#5E38D1] mb-3">Trakky</h1>
                                <div className="w-20 h-1 ani bg-gradient-to-r from-[#5E38D1] to-[#A088F7] mx-auto rounded-full"></div>
                            </div>
                            <p className="text-gray-700 text-lg max-w-md leading-relaxed mb-10">
                                Complete <span className="font-semibold text-[#5E38D1]">POS solution</span> designed for
                                modern salons. Manage appointments, billing, and business growth in one place.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center py-8 lg:p-12">
                        <div className="w-full max-w-md">

                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#5E38D1] to-[#A088F7] rounded-xl mb-4 shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    Login
                                </h2>
                                <p className="text-gray-500 text-sm">Welcome back! Please sign in to continue</p>
                            </div>

                            <Formik
                                initialValues={{ phone: "", password: "", remember: false }}
                                validationSchema={LoginSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    await new Promise(res => setTimeout(res, 2000));
                                    setSubmitting(false);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-5">
                                        <div className="group">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#5E38D1] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <Field
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="Enter your phone number"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5E38D1] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                                />
                                            </div>
                                            <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div className="group">
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#5E38D1] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <Field
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Enter your password"
                                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5E38D1] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center rounded-r-xl transition-colors"
                                                >
                                                    <svg className={`w-5 h-5 transition-colors ${showPassword ? 'text-[#5E38D1]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {showPassword ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        )}
                                                    </svg>
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div className="flex items-start lg:items-center gap-y-4 lg:gap-y-0 flex-col lg:flex-row justify-between text-sm">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <Field
                                                    type="checkbox"
                                                    name="remember"
                                                    className="w-4 h-4 text-[#5E38D1] rounded focus:ring-[#5E38D1] border-gray-300 accent-[#5E38D1]"
                                                />
                                                <span className="text-gray-600">Remember me</span>
                                            </label>
                                            <div className="flex flex-col items-start lg:flex-row gap-3">
                                                <button
                                                    type="button"
                                                    className="text-[#5E38D1] hover:text-[#4a2cc7] hover:underline transition-colors text-sm"
                                                >
                                                    Forgot Password?
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-[#5E38D1] hover:text-[#4a2cc7] hover:underline transition-colors text-sm"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="relative w-full bg-gradient-to-r from-[#5E38D1] to-[#A088F7] hover:from-[#4a2cc7] hover:to-[#8b6bef] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="relative z-10">Signing In...</span>
                                                </div>
                                            ) : (
                                                <span className="relative z-10">Login</span>
                                            )}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="text-center mt-6">
                                <p className="text-gray-600 text-sm">
                                    No account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-[#5E38D1] hover:text-[#4a2cc7] font-semibold hover:underline transition-colors"
                                    >
                                        Sign up for free
                                    </Link>
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        By signing in, you agree to our{" "}
                                        <a href="#"
                                            className="text-[#5E38D1] hover:underline">
                                            Terms of Service
                                        </a>
                                        {" "}
                                        and{" "}
                                        <a href="#"
                                            className="text-[#5E38D1] hover:underline">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="lg:hidden mt-8 text-center">
                                <h1 className="text-2xl font-bold text-[#5E38D1] mb-2">
                                    Trakky
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Complete POS solution for salons
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginComponent;
