"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Icon from "../icon";
import Link from "next/link";

const SignupSchema = Yup.object().shape({
    salonName: Yup.string().required("Salon Name is required"),
    salonContact: Yup.string()
        .required("Salon Contact Number is required")
        .matches(/^\d+$/, "Must be a valid number"),
    whatsappNumber: Yup.string()
        .required("WhatsApp Number is required")
        .matches(/^\d+$/, "Must be a valid number"),
    ownerName: Yup.string().required("Owner Name is required"),
    ownerContact: Yup.string()
        .required("Owner Contact Number is required")
        .matches(/^\d+$/, "Must be a valid number"),
    salonAddress: Yup.string().required("Salon Address is required"),
    city: Yup.string().required("City is required"),
    area: Yup.string().required("Area is required"),
    googleMap: Yup.string().url("Must be a valid URL").nullable(),
    openingTime: Yup.string().required("Opening Time is required"),
    closingTime: Yup.string().required("Closing Time is required"),
    salonImages: Yup.mixed()
        .required("Salon Profile Images are required")
        .test("fileCount", "You must upload at least 2 images", (value) => {
            return value && value.length >= 2;
        }),
});

const InputField = ({ label, name, type = "text", placeholder, icon, required }) => (
    <Field name={name}>
        {({ field, form }) => (
            <div className="group relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    {label}
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon={icon} className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        {...(type !== "file" ? field : {})}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        onChange={(e) => {
                            if (type === "file") {
                                form.setFieldValue(name, e.currentTarget.files);
                            } else {
                                field.onChange(e);
                            }
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl ${form.touched[name] && form.errors[name] ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-[#5E38D1] focus:border-transparent transition-all bg-gray-50 focus:bg-white`}
                        multiple={type === "file"}
                        accept={type === "file" ? "image/*" : undefined}
                    />
                </div>
                <ErrorMessage
                    name={name}
                    component="div"
                    className="text-red-500 text-xs mt-1"
                />
            </div>
        )}
    </Field>
);

const SignupComponent = () => {
    return (
        <div className="relative w-full min-h-screen pt-48 px-4 py-16 flex justify-center items-start bg-gray-50">
            {/* Soft Background */}
            <div className="absolute inset-0 flex justify-center items-center -z-10">
                <div className="w-[700px] h-[500px] bg-gradient-to-r from-[#c1b6f0]/40 via-[#ab97e3]/30 to-[#A088F7]/30 rounded-3xl blur-3xl"></div>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 sm:p-12 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Salon Registration
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Create your salon profile on{" "}
                        <span className="text-[#5E38D1] font-semibold">Trakky</span>
                    </p>
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={{
                        salonName: "",
                        salonContact: "",
                        whatsappNumber: "",
                        ownerName: "",
                        ownerContact: "",
                        salonAddress: "",
                        city: "",
                        area: "",
                        googleMap: "",
                        openingTime: "",
                        closingTime: "",
                        salonImages: [],
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            console.log("Form submitted values:", values);
                            setSubmitting(false);
                            // Here you can call your API to submit form data
                        }, 2000);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6" noValidate>
                            {/* Salon Name and Salon Contact */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="Salon Name *"
                                        name="salonName"
                                        placeholder="Enter salon name"
                                        icon="mdi:storefront-outline"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="Salon Contact Number *"
                                        name="salonContact"
                                        placeholder="Enter contact number"
                                        type="tel"
                                        icon="mdi:phone-outline"
                                        required
                                    />
                                </div>
                            </div>

                            {/* WhatsApp Number and Owner Name */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="WhatsApp Number *"
                                        name="whatsappNumber"
                                        placeholder="Enter WhatsApp number"
                                        type="tel"
                                        icon="mdi:whatsapp"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="Owner Name *"
                                        name="ownerName"
                                        placeholder="Enter owner name"
                                        icon="mdi:account-outline"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Owner Contact and City */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="Owner Contact Number *"
                                        name="ownerContact"
                                        placeholder="Enter owner's contact"
                                        type="tel"
                                        icon="mdi:phone-outline"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="City *"
                                        name="city"
                                        placeholder="Enter city"
                                        icon="ph:city-fill"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Area and Google Map */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="Area *"
                                        name="area"
                                        placeholder="Enter area"
                                        icon="mdi:map-marker-outline"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="Google Map Link"
                                        name="googleMap"
                                        placeholder="Enter Google Map link"
                                        icon="lets-icons:map-duotone"
                                        type="url"
                                    />
                                </div>
                            </div>

                            {/* Opening and Closing Time */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <InputField
                                        label="Opening Time *"
                                        name="openingTime"
                                        type="time"
                                        icon="mdi:clock-outline"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputField
                                        label="Closing Time *"
                                        name="closingTime"
                                        type="time"
                                        icon="mdi:clock-outline"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Salon Address */}
                            <InputField
                                label="Salon Address *"
                                name="salonAddress"
                                placeholder="Enter salon address"
                                icon="mdi:map-outline"
                                required
                            />

                            {/* Salon Images */}
                            <InputField
                                label="Salon Profile Images (2) *"
                                name="salonImages"
                                type="file"
                                icon="mdi:image-outline"
                                required
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#5E38D1] to-[#A088F7] hover:from-[#4a2cc7] hover:to-[#8b6bef] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                            >
                                {isSubmitting ? "Registering..." : "Register Salon"}
                            </button>

                            {/* Login Link */}
                            <div>
                                <p>
                                    Already Have account ?{" "}
                                    <Link href="/login" className="hover:underline text-[#5E38D1]">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignupComponent;
