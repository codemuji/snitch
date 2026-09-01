import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth.js'
import { useNavigate } from 'react-router'

const Register = () => {
    const { handleRegister, loading: reduxLoading, error: reduxError } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contact: '',
        password: '',
        isSeller: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [localError, setLocalError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name === 'contact') {
            // Only keep digits and limit to 10 characters
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
            setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }))
        }
        if (localError) setLocalError('')
    }

    // Password strength calculation (0 - 4)
    const getPasswordStrength = (pass) => {
        let score = 0
        if (!pass) return 0
        if (pass.length >= 6) score += 1
        if (pass.length >= 8) score += 1
        if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1
        if (/[^A-Za-z0-9]/.test(pass)) score += 1
        return score
    }

    const strength = getPasswordStrength(formData.password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError('')
        setSuccessMessage('')

        if (!formData.fullname.trim()) {
            setLocalError('Please enter your full name.')
            return
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError('Please enter a valid email address.')
            return
        }
        const cleanedContact = formData.contact.replace(/\D/g, '')
        if (!cleanedContact || cleanedContact.length !== 10) {
            setLocalError('Contact must be a valid 10-digit number.')
            return
        }
        if (!formData.password || formData.password.length < 6) {
            setLocalError('Password must contain at least 6 characters.')
            return
        }

        const result = await handleRegister({
            fullname: formData.fullname,
            email: formData.email,
            contact: cleanedContact,
            password: formData.password,
            isSeller: formData.isSeller,
        })

        if (result?.success) {
            setSuccessMessage(
                formData.isSeller
                    ? 'Seller account registered! Welcome to Snitch Merchant Hub.'
                    : 'Account registered! Welcome to Snitch Archive.'
            )
        } else if (result?.error) {
            setLocalError(result.error)
        }
        navigate('/')
    }

    const displayedError = localError || reduxError

    const handleGoogleAuth = () => {
        window.location.href = '/api/auth/google'
    }

    return (
        <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#09090b] text-[#f4f4f5] flex flex-col md:flex-row relative select-none">
            {/* Background Subtle Ambient Golden Glow on Form Side */}
            <div
                className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#eab308]/10 via-[#f59e0b]/5 to-transparent blur-[120px] rounded-full z-0"
                aria-hidden="true"
            />

            {/* LEFT SIDE: Seamless Registration Form (No Borderline Separation, Zero Scrollbar) */}
            <div className="w-full md:w-[50%] lg:w-[48%] xl:w-[45%] h-full flex flex-col justify-between py-6 px-6 sm:px-10 lg:px-12 xl:px-16 z-20 relative bg-[#09090b]/90 md:bg-transparent">
                {/* Top Brand Monogram */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg border border-[#27272a] bg-[#141417] flex items-center justify-center relative shadow-[0_0_15px_rgba(234,179,8,0.12)]">
                            <svg
                                className="w-4.5 h-4.5 text-[#ffca45]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.25em] text-[#ffca45] uppercase block leading-none">
                                SNITCH
                            </span>
                            <span className="text-[9px] tracking-[0.15em] text-[#919095] uppercase block mt-0.5">
                                ARCHIVE EDITIONS
                            </span>
                        </div>
                    </div>

                    <span className="text-[9px] font-mono tracking-widest text-[#71717a] uppercase border border-[#27272a] px-2 py-0.5 rounded">
                        SYS / 2026
                    </span>
                </div>

                {/* Center Content Form (Fitted compactly within Viewport) */}
                <div className="my-auto py-2 w-full max-w-sm sm:max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
                            Create an Account
                        </h1>
                        <p className="text-xs text-[#919095] mt-1">
                            Gain access to exclusive streetwear drops or launch your verified storefront.
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {successMessage && (
                        <div className="mb-3 rounded-lg bg-[#eab308]/10 border border-[#eab308]/30 px-3 py-2 flex items-center gap-2.5 text-[#ffdf9a] text-xs">
                            <svg className="w-4 h-4 text-[#eab308] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">{successMessage}</span>
                        </div>
                    )}

                    {displayedError && (
                        <div className="mb-3 rounded-lg bg-red-950/40 border border-red-500/30 px-3 py-2 flex items-center gap-2.5 text-red-200 text-xs">
                            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="truncate">{displayedError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* 1. Full Name */}
                        <div className="relative group border-b border-[#27272a] focus-within:border-[#eab308] pb-1.5 transition-colors duration-200">
                            <label
                                htmlFor="fullname"
                                className="text-[10px] font-semibold uppercase tracking-wider text-[#919095] block group-focus-within:text-[#ffca45] transition-colors"
                            >
                                Full Name <span className="text-[#eab308]">*</span>
                            </label>
                            <div className="flex items-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-[#919095] mr-2.5 group-focus-within:text-[#ffca45] shrink-0 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    placeholder="e.g. Julian Saint-Laurent"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none outline-none text-[#f4f4f5] placeholder-[#47464a] text-xs sm:text-sm p-0 focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* 2. Email Address */}
                        <div className="relative group border-b border-[#27272a] focus-within:border-[#eab308] pb-1.5 transition-colors duration-200">
                            <label
                                htmlFor="email"
                                className="text-[10px] font-semibold uppercase tracking-wider text-[#919095] block group-focus-within:text-[#ffca45] transition-colors"
                            >
                                Email Address <span className="text-[#eab308]">*</span>
                            </label>
                            <div className="flex items-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-[#919095] mr-2.5 group-focus-within:text-[#ffca45] shrink-0 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="julian@snitcharchive.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none outline-none text-[#f4f4f5] placeholder-[#47464a] text-xs sm:text-sm p-0 focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* 3. Contact Number (10 Digits Only) */}
                        <div className="relative group border-b border-[#27272a] focus-within:border-[#eab308] pb-1.5 transition-colors duration-200">
                            <label
                                htmlFor="contact"
                                className="text-[10px] font-semibold uppercase tracking-wider text-[#919095] block group-focus-within:text-[#ffca45] transition-colors"
                            >
                                Contact Number (10 digits) <span className="text-[#eab308]">*</span>
                            </label>
                            <div className="flex items-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-[#919095] mr-2.5 group-focus-within:text-[#ffca45] shrink-0 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    maxLength={10}
                                    required
                                    placeholder="e.g. 9876543210"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none outline-none text-[#f4f4f5] placeholder-[#47464a] text-xs sm:text-sm p-0 focus:ring-0 font-mono tracking-wide"
                                />
                            </div>
                        </div>

                        {/* 4. Password */}
                        <div className="relative group border-b border-[#27272a] focus-within:border-[#eab308] pb-1.5 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-[10px] font-semibold uppercase tracking-wider text-[#919095] block group-focus-within:text-[#ffca45] transition-colors"
                                >
                                    Password <span className="text-[#eab308]">*</span>
                                </label>
                                <span className="text-[9px] text-[#71717a]">Min. 6 chars</span>
                            </div>
                            <div className="flex items-center mt-0.5 relative">
                                <svg
                                    className="w-4 h-4 text-[#919095] mr-2.5 group-focus-within:text-[#ffca45] shrink-0 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none outline-none text-[#f4f4f5] placeholder-[#47464a] text-xs sm:text-sm p-0 pr-8 focus:ring-0 tracking-wider font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="text-[#919095] hover:text-[#ffca45] transition-colors outline-none cursor-pointer p-0.5"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password Strength 4-Bar Meter */}
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="h-0.5 flex-1 bg-[#27272a] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full strength-bar ${strength >= step
                                                ? step <= 1
                                                    ? 'bg-red-500 w-full'
                                                    : step <= 2
                                                        ? 'bg-[#f59e0b] w-full'
                                                        : 'bg-[#eab308] w-full'
                                                : 'w-0'
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. isSeller Flag (Compact Luxury Card) */}
                        <div className="pt-1">
                            <label
                                htmlFor="isSeller"
                                className={`relative flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer select-none ${formData.isSeller
                                    ? 'border-[#eab308] bg-[#eab308]/8 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                    : 'border-[#27272a] bg-[#141417] hover:border-[#3f3f46]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center">
                                        <input
                                            id="isSeller"
                                            name="isSeller"
                                            type="checkbox"
                                            checked={formData.isSeller}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200 ${formData.isSeller
                                                ? 'border-[#eab308] bg-[#eab308] text-[#09090b]'
                                                : 'border-[#47464a] bg-transparent'
                                                }`}
                                        >
                                            {formData.isSeller && (
                                                <svg className="w-3 h-3 stroke-[#09090b] stroke-[3]" fill="none" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs font-semibold text-[#f4f4f5] block leading-tight">
                                            Register as a Seller
                                        </span>
                                        <span className="text-[10px] text-[#919095] block mt-0.5 leading-none">
                                            Access vendor portal, manage orders & inventory
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase border shrink-0 ${formData.isSeller
                                        ? 'bg-[#eab308]/15 border-[#eab308]/50 text-[#ffca45]'
                                        : 'bg-[#27272a] border-[#3f3f46] text-[#919095]'
                                        }`}
                                >
                                    MERCHANT HUB
                                </span>
                            </label>
                        </div>

                        {/* Golden Yellow CTA Action */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={reduxLoading}
                                className="w-full h-11 bg-[#eab308] hover:bg-[#fbbf24] text-[#09090b] font-bold text-xs tracking-[0.15em] uppercase rounded shadow-[0_4px_20px_rgba(234,179,8,0.2)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                            >
                                {reduxLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-[#09090b]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>PROCESSING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{formData.isSeller ? 'CREATE SELLER ACCOUNT' : 'CREATE ACCOUNT'}</span>
                                        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-3 flex items-center justify-center">
                        <div className="border-t border-[#27272a] w-full" />
                        <span className="bg-[#09090b] px-3 text-[10px] uppercase font-mono tracking-widest text-[#71717a] absolute">
                            OR
                        </span>
                    </div>

                    {/* Continue with Google */}
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="w-full h-11 rounded-lg border border-[#27272a] bg-[#141417] hover:bg-[#1a1a1e] hover:border-[#3f3f46] text-[#f4f4f5] font-semibold text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Footer Link */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-[#919095]">
                            Already Member?{' '}
                            <Link
                                to="/login"
                                className="text-[#ffca45] hover:text-[#fbbf24] transition-colors underline underline-offset-4 decoration-[#ffca45]/40 hover:decoration-[#ffca45] font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Microcopy Terms */}
                <div className="text-center md:text-left">
                    <p className="text-[10px] text-[#52525b]">
                        © 2026 SNITCH CORP. ALL RIGHTS RESERVED. PRIVACY & TERMS APPLIED.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Model in Snitch Clothing (Seamless Blend, No Borderline Separation) */}
            <div className="hidden md:block md:w-[50%] lg:w-[52%] xl:w-[55%] h-full relative overflow-hidden">
                {/* Model Image with Cover Fit */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/snitch-model.jpg')",
                    }}
                />

                {/* Seamless Left Fade: Completely vanishes into #09090b on the form side without any borderline */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent z-10"
                    style={{ width: '45%' }}
                />

                {/* Top and Bottom Subtle Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/60 z-10" />

                {/* Subtle Ambient Golden Yellow Glow Overlay */}
                <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#eab308]/10 blur-[130px] rounded-full pointer-events-none z-10" />

                {/* Editorial Floating Watermark in Bottom Right */}
                <div className="absolute bottom-8 right-8 z-20 text-right pointer-events-none">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#ffca45] uppercase mb-1">
                        SNITCH LUXURY ARCHIVE
                    </p>
                    <p className="text-xs text-[#d4d4d8] font-medium tracking-wide">
                        AUTUMN / WINTER COLLECTION
                    </p>
                    <p className="text-[9px] text-[#71717a] tracking-widest uppercase mt-0.5">
                        URBAN APPAREL CRAFTSMANSHIP
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register