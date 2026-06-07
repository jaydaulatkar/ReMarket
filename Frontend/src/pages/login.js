import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './login.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    // Clear any existing CAS session on component mount
    useEffect(() => {
        const clearSession = async () => {
            try {
                await axios.post('/api/clear-session', {}, {
                    withCredentials: true
                });
            } catch (error) {
                console.error('Failed to clear session:', error);
            }
        };
        clearSession();
    }, []);

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value.trim());
            case 'password':
                return value.length >= 8;
            default:
                return value.trim() !== '';
        }
    };

    const getErrorMessage = (name, value) => {
        switch (name) {
            case 'email':
                return value.trim()
                    ? 'Please enter a valid email address.'
                    : 'Email is required.';
            case 'password':
                return value.trim()
                    ? 'Password must be at least 8 characters.'
                    : 'Password is required.';
            default:
                return `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recaptchaToken) {
            setErrors(prev => ({ ...prev, submit: 'Please complete the reCAPTCHA' }));
            return;
        }

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!validateField(key, formData[key])) {
                newErrors[key] = getErrorMessage(key, formData[key]);
            }
        });

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/api/login', {
                    ...formData,
                    recaptchaToken,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                
                const data = response.data;
                if (response.status === 200) {
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
                    setErrors({ submit: data.message || 'Failed to login. Please try again.' });
                    setFormData({
                        email: '',
                        password: '',
                    });
                    setRecaptchaToken(null);
                }
            } catch (error) {
                console.error('Login error:', error.response?.data || error);
                const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message || 'Failed to Login. Please try again.';
                setErrors({ submit: errorMessage });
                setFormData({
                    email: '',
                    password: '',
                });
                setRecaptchaToken(null);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
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
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6Lc5z7oqAAAAAO6FPsxuAg88x_aR7b64KQTKYxtf"}
                        onChange={handleRecaptchaChange}
                    />
                </div>
                {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}
                <div>
                    <button type="submit" className={styles.submitButton}>
                        LOGIN
                    </button>
                </div>
                <div className={styles.loginLink}>
                    <Link to="/">Don't have an account? Register here</Link>
                </div>
            </form>
        </div>
    );
}