export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister extends UserLogin {
  username: string
  passwordConfirm: string
  display: string
  timezone?: string
}
