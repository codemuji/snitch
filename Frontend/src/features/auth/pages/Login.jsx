import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth.js'
import { login as loginApi } from '../service/auth.api.js'
import { setUser, setLoading, setError } from '../state/auth.slice.js'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useAuth()
  const reduxLoading = useSelector((state) => state.auth?.loading) || false
  const reduxError = useSelector((state) => state.auth?.error) || null

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (localError) setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMessage('')

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Please enter a valid email address.')
      return
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must contain at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      let result
      // Use handleLogin from useAuth if exposed, otherwise fallback gracefully to loginApi
      if (typeof auth.handleLogin === 'function') {
        result = await auth.handleLogin({
          email: formData.email,
          password: formData.password,
        })
      } else {
        dispatch(setLoading(true))
        dispatch(setError(null))
        const data = await loginApi({
          email: formData.email,
          password: formData.password,
        })
        if (data?.user) {
          dispatch(setUser(data.user))
        }
        dispatch(setLoading(false))
        result = { success: true, data }
      }

      if (result?.success) {
        setSuccessMessage('Authentication successful! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 800)
      } else if (result?.error) {
        setLocalError(result.error)
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to log in. Please check your credentials.'
      setLocalError(errorMsg)
      dispatch(setError(errorMsg))
      dispatch(setLoading(false))
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayedError = localError || reduxError
  const loading = isSubmitting || reduxLoading

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#09090b] text-[#f4f4f5] flex flex-col md:flex-row relative select-none">
      {/* Subtle Ambient Golden Glow */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#eab308]/10 via-[#f59e0b]/5 to-transparent blur-[120px] rounded-full z-0"
        aria-hidden="true"
      />

      {/* LEFT SIDE: Minimalist Login Form (Zero Scrollbar, 100vh Single Viewport) */}
      <div className="w-full md:w-[50%] lg:w-[48%] xl:w-[45%] h-full flex flex-col justify-between py-6 sm:py-8 px-6 sm:px-10 lg:px-12 xl:px-16 z-20 relative bg-[#09090b]/90 md:bg-transparent">
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
            PORTAL / 2026
          </span>
        </div>

        {/* Center Content Form */}
        <div className="my-auto py-2 w-full max-w-sm sm:max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-[#919095] mt-1.5 leading-relaxed">
              Enter your credentials to access your curated archive and account orders.
            </p>
          </div>

          {/* Feedback Messages */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-[#eab308]/10 border border-[#eab308]/30 px-3.5 py-2.5 flex items-center gap-2.5 text-[#ffdf9a] text-xs animate-fadeIn">
              <svg
                className="w-4 h-4 text-[#eab308] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="truncate">{successMessage}</span>
            </div>
          )}

          {displayedError && (
            <div className="mb-4 rounded-lg bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 flex items-center gap-2.5 text-red-200 text-xs animate-fadeIn">
              <svg
                className="w-4 h-4 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="truncate">{displayedError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Email Address */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none outline-none text-[#f4f4f5] placeholder-[#47464a] text-xs sm:text-sm p-0 focus:ring-0"
                />
              </div>
            </div>

            {/* 2. Password */}
            <div className="relative group border-b border-[#27272a] focus-within:border-[#eab308] pb-1.5 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[10px] font-semibold uppercase tracking-wider text-[#919095] block group-focus-within:text-[#ffca45] transition-colors"
                >
                  Password <span className="text-[#eab308]">*</span>
                </label>
                <span className="text-[10px] text-[#919095] hover:text-[#ffca45] transition-colors cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="flex items-center mt-0.5 relative">
                <svg
                  className="w-4 h-4 text-[#919095] mr-2.5 group-focus-within:text-[#ffca45] shrink-0 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="rememberMe"
                className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#919095] hover:text-[#f4f4f5] transition-colors"
              >
                <div className="relative flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                      formData.rememberMe
                        ? 'border-[#eab308] bg-[#eab308] text-[#09090b]'
                        : 'border-[#47464a] bg-transparent'
                    }`}
                  >
                    {formData.rememberMe && (
                      <svg
                        className="w-2.5 h-2.5 stroke-[#09090b] stroke-[3]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span>Stay signed in</span>
              </label>

              <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717a]">
                ENCRYPTED
              </span>
            </div>

            {/* Golden Yellow CTA Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#eab308] hover:bg-[#fbbf24] text-[#09090b] font-bold text-xs tracking-[0.15em] uppercase rounded shadow-[0_4px_20px_rgba(234,179,8,0.2)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#09090b]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <svg
                      className="w-3.5 h-3.5 stroke-[2.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link: Link to Register */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#919095]">
              New to Snitch?{' '}
              <Link
                to="/register"
                className="text-[#ffca45] hover:text-[#fbbf24] transition-colors underline underline-offset-4 decoration-[#ffca45]/40 hover:decoration-[#ffca45] font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Microcopy Terms */}
        <div className="text-center md:text-left">
          <p className="text-[10px] text-[#52525b]">
            © 2026 SNITCH CORP. ALL RIGHTS RESERVED. SECURE AUTHENTICATION.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Model in Snitch Clothing (Matching Register Page Seamless Blend) */}
      <div className="hidden md:block md:w-[50%] lg:w-[52%] xl:w-[55%] h-full relative overflow-hidden">
        {/* Model Image with Cover Fit */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/snitch-model.jpg')",
          }}
        />

        {/* Seamless Left Fade: Completely vanishes into #09090b on the form side without borderline */}
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
            PORTAL ACCESS & MEMBERSHIP
          </p>
          <p className="text-[9px] text-[#71717a] tracking-widest uppercase mt-0.5">
            URBAN APPAREL CRAFTSMANSHIP
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login