import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { DateTime } from 'luxon'
import { ZodError } from 'zod'
import InputField from '../../../components/lib/InputField'
import Alert from '../../../components/lib/Alert'

interface RegisterFormState {
  email: string
  password: string
  passwordConfirm: string
  username: string
  display: string
  timezone: string
}

const defaultFormState: RegisterFormState = {
  email: '',
  password: '',
  passwordConfirm: '',
  username: '',
  display: '',
  timezone: DateTime.local().zoneName, // Auto-detect timezone
}

interface RegisterFormErrors {
  email?: string
  password?: string
  passwordConfirm?: string
  username?: string
  display?: string
  timezone?: string
}

interface RegisterApiResponse {
  message: string
  accessToken: string
  user: {
    id: string
    email: string
    password: string
    username: string
    display: string
    timezone: string
  }
}

function Register() {
  const [formData, setFormData] = useState<RegisterFormState>(defaultFormState)

  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [serverError, setServerError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState: RegisterFormState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setServerError('')
    setSuccessMessage('')

    try {
      // Always send the form data to the backend, let the backend handle the validation
      const apiResponse: AxiosResponse<RegisterApiResponse> = await axios.post(
        '/api/user/register',
        formData
      )

      if (apiResponse.status === 201) {
        setSuccessMessage(apiResponse.data.message)
      } else {
        setServerError(apiResponse.data.message)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: RegisterFormErrors = {}
        error.errors.forEach((err) => {
          const pathKey = err.path[0] as keyof RegisterFormErrors
          if (pathKey) {
            formattedErrors[pathKey] = err.message
          }
        })
        setErrors(formattedErrors)
      } else if (axios.isAxiosError(error) && error.response) {
        // Handle server-side validation errors
        const serverErrors = error.response.data.errors
        if (serverErrors && Array.isArray(serverErrors)) {
          const formattedErrors: RegisterFormErrors = {}
          serverErrors.forEach((err: { path: string[]; message: string }) => {
            const pathKey = err.path[0] as keyof RegisterFormErrors
            if (pathKey) {
              formattedErrors[pathKey] = err.message
            }
          })
          setErrors(formattedErrors)
        } else {
          setServerError(error.response.data.message || 'An error occurred')
        }
      } else {
        setServerError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-[50vw]">
      <InputField
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        error={errors.email}
        required
      />
      <InputField
        id="username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        error={errors.username}
        required
      />
      <InputField
        id="display"
        type="text"
        name="display"
        value={formData.display}
        onChange={handleChange}
        placeholder="Display Name"
        error={errors.display}
        required
      />
      <InputField
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        error={errors.password}
        required
      />
      <InputField
        id="passwordConfirm"
        type="password"
        name="passwordConfirm"
        value={formData.passwordConfirm}
        onChange={handleChange}
        placeholder="Confirm Password"
        error={errors.passwordConfirm}
        required
      />
      <InputField
        id="timezone"
        type="text"
        name="timezone"
        value={formData.timezone}
        onChange={handleChange}
        placeholder="Timezone"
        readOnly
        disabled
      />

      {serverError && <Alert type="error" message={serverError} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <button type="submit" className="btn btn-primary w-full">
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default Register
