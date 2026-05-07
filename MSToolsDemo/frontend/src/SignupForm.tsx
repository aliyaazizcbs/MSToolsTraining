import { useState } from 'react'

function SignupForm() {
  const [firstName, setFirstName]           = useState('')
  const [lastName, setLastName]             = useState('')
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showModal, setShowModal] = useState(false)

  // =========================================================
  // TODO: Add logic here to decide when the Sign Up button
  //       should be enabled.
  // Hint: All mandatory fields (First Name, Email, Password)
  //       must be filled in before the user can sign up.
  // =========================================================
  const isSignupEnabled = false

  // =========================================================
  // TODO: Add logic here to decide when the Clear button
  //       should be enabled.
  // Hint: Enable it whenever at least one field has a value.
  // =========================================================
  const isClearEnabled = false

  const handleSignup = () => {
    setShowModal(true)
  }

  const handleClear = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 ' +
    'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition'

  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col">

      {/* Page header */}
      <header className="pt-12 pb-4 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">📝 Sign Up</h1>
        <p className="mt-2 text-gray-500 text-sm">Create your account to get started</p>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12 pt-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">

          {/* First Name */}
          <div>
            <label className={labelClass} htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              className={inputClass}
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              className={inputClass}
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass} htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              className={inputClass}
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass} htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              className={inputClass}
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className={inputClass}
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Required note */}
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required field
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              disabled={!isClearEnabled}
              onClick={handleClear}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700
                         hover:bg-gray-50 active:bg-gray-100 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={!isSignupEnabled}
              onClick={handleSignup}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white
                         hover:bg-indigo-700 active:bg-indigo-800 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>

        </div>
      </main>

      {/* Success modal */}
      {showModal && (
        <dialog
          open
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 m-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl
                     backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 id="modal-title" className="text-xl font-bold text-gray-800 mb-2">Thank you for signing up!</h2>
          <p className="text-sm text-gray-500 mb-6">Your account has been created successfully.</p>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white
                       hover:bg-indigo-700 active:bg-indigo-800 transition"
          >
            Close
          </button>
        </dialog>
      )}

      <footer className="py-4 text-center text-xs text-gray-400">
        MS Tools Demo — coding is about logic, not maths! 🎉
      </footer>

    </div>
  )
}

export default SignupForm
