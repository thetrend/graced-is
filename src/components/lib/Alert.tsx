interface AlertProps {
  type: 'error' | 'success' | 'info'
  message: string
}

function Alert({ type = 'info', message }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="flex-1">{message}</div>
    </div>
  )
}

export default Alert
