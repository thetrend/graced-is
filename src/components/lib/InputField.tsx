/* eslint-disable react/require-default-props */
interface InputFieldProps {
  id: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  error?: string
}

function InputField({
  id,
  type,
  name,
  value,
  onChange,
  placeholder = '',
  readOnly = false,
  disabled = false,
  required = false,
  error = '',
}: Readonly<InputFieldProps>) {
  return (
    <div className="form-control">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        aria-labelledby={`${id}-label`}
        className="input input-bordered w-full"
      />
      <span id={`${id}-label`} className="sr-only">
        {placeholder}
      </span>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  )
}

export default InputField
