import React, { useState } from 'react';
import axios from 'axios';

import ReCAPTCHA from 'react-google-recaptcha';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';


export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        contactNumber: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value.trim());
            case 'contactNumber':
                const phoneRegex = /^\d{10}$/;
                return phoneRegex.test(value.trim());
            case 'password':
                return value.length >= 8;
            default:
                return value.trim() !== '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                [name]: 'This field is required',
            }));
        } else {
            const isValid = validateField(name, value);
            setErrors(prev => {
                const newErrors = { ...prev };
                if (isValid) {
                    delete newErrors[name];
                } else {
                    newErrors[name] = getErrorMessage(name, value);
                }
                return newErrors;
            });
        }
    };

    const getErrorMessage = (name, value) => {
        switch (name) {
            case 'email':
                return value.trim()
                    ? 'Please enter a valid email address.'
                    : 'Email is required.';
            case 'contactNumber':
                return value.trim()
                    ? 'Contact number must be 10 digits.'
                    : 'Contact number is required.';
            case 'password':
                return value.trim()
                    ? 'Password must be at least 8 characters.'
                    : 'Password is required.';
            default:
                return `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!recaptchaToken) {
        //     setErrors(prev => ({ ...prev, submit: 'Please complete the reCAPTCHA' }));
        //     return;
        // }
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!validateField(key, formData[key])) {
                newErrors[key] = getErrorMessage(key, formData[key]);
            }
        });

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/signup', {
                    ...formData,
                    recaptchaToken,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                    } else {
                        alert(data.message);
                        setFormData({
                            email: '',
                            password: '',
                        });
                        setRecaptchaToken(null);
                    }
                } else {
                    if (data.message === 'Email is already registered.') {
                        alert('User already exists with this email.');
                        setFormData({
                            firstName: '',
                            lastName: '',
                            email: '',
                            age: '',
                            contactNumber: '',
                            password: '',
                        });
                        setRecaptchaToken(null);
                        // setRecaptchaKey(prev => prev + 1);
                    } else {
                        setErrors({ submit: data.message || 'Failed to sign up. Please try again.' });
                        setRecaptchaToken(null);
                        // setRecaptchaKey(prev => prev + 1);
                    }
                }
            } catch (error) {
                console.error('Signup error:', error.response?.data || error);
                const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'Failed to sign up. Please try again.';
                
                if (errorMessage === 'Email is already registered.') {
                    alert('User already exists with this email.');
                } else {
                    setErrors({ submit: errorMessage });
                }
                
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    age: '',
                    contactNumber: '',
                    password: '',
                });
                setRecaptchaToken(null);
            }
        } else {
            setErrors(newErrors);
        }
    };

    // const handleRecaptchaChange = (value) => {
    //     setRecaptchaToken(value);
    //     if (!value) {
    //         setErrors(prev => ({ ...prev, recaptcha: 'Please complete the reCAPTCHA.' }));
    //     } else {
    //         setErrors(prev => {
    //             const newErrors = { ...prev };
    //             delete newErrors.recaptcha;
    //             return newErrors;
    //         });
    //     }
    // };

    return (
        <div className={styles.container}>
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.formLabel}>First Name*</label>
                    <input
                        type="text"
                        className={`${styles.formInput} ${errors.firstName ? styles.invalidInput : ''}`}
                        placeholder="First name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className={styles.errorMessage}>{errors.firstName}</div>}
                </div>

                <div>
                    <label className={styles.formLabel}>Last Name*</label>
                    <input
                        type="text"
                        className={`${styles.formInput} ${errors.lastName ? styles.invalidInput : ''}`}
                        placeholder="Last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className={styles.errorMessage}>{errors.lastName}</div>}
                </div>

                <div>
                    <label className={styles.formLabel}>Email Address*</label>
                    <input
                        type="text"
                        className={`${styles.formInput} ${errors.email ? styles.invalidInput : ''}`}
                        placeholder="example@email.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                </div>

                <div>
                    <label className={styles.formLabel}>Age*</label>
                    <input
                        type="number"
                        className={`${styles.formInput} ${errors.age ? styles.invalidInput : ''}`}
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                    {errors.age && <div className={styles.errorMessage}>{errors.age}</div>}
                </div>

                <div>
                    <label className={styles.formLabel}>Contact Number* (10 digits)</label>
                    <input
                        type="tel"
                        className={`${styles.formInput} ${errors.contactNumber ? styles.invalidInput : ''}`}
                        placeholder="1234567890"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        maxLength="10"
                    />
                    {errors.contactNumber && <div className={styles.errorMessage}>{errors.contactNumber}</div>}
                </div>

                <div>
                    <label className={styles.formLabel}>Password* (minimum 8 characters)</label>
                    <input
                        type="password"
                        className={`${styles.formInput} ${errors.password ? styles.invalidInput : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
                </div>

                <div className={styles.recaptchaContainer}>
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                        onChange={handleRecaptchaChange}
                    />
                </div>
                {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}
                <div>
                    <button type="submit" className={styles.submitButton}>
                        Sign Up
                    </button>
                </div>

                <div className={styles.loginLink}>
                    <Link to="/login">Already have an account</Link>
                </div>
            </form>
        </div>
    );
}