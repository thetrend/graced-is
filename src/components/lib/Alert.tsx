import {
  type IconDefinition,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info'
  message: string
}

function Alert({ type = 'info', message }: Readonly<AlertProps>) {
  let icon: IconDefinition
  let alertType: string
  switch (type) {
    case 'error':
      icon = faCircleXmark
      alertType = 'alert-error'
      break
    case 'success':
      icon = faCircleCheck
      alertType = 'alert-success'
      break
    case 'warning':
      icon = faTriangleExclamation
      alertType = 'alert-warning'
      break
    default:
      icon = faCircleInfo
      alertType = 'alert-info'
  }
  return (
    <div role="alert" className={`alert ${alertType}`}>
      <div className="w-full text-left">
        <FontAwesomeIcon icon={icon} className="pr-2" />
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Alert
