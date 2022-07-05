import { useCallback, useState } from 'react'
import { AuthenticationError } from './Api'
import './style/App.scss'



function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameFeedback, setUsernameFeedback] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [formFeedback, setFormFeedback] = useState('')

  const onSubmit = useCallback(async (event) => {
    event.preventDefault()

    setUsernameFeedback('')
    setPasswordFeedback('')
    setFormFeedback('')

    try {
      await props.api.authenticate(username, password)
    } catch (error) {
      if (error instanceof AuthenticationError) {
        if (error.status === 400) {
          if ('username' in error.body) {
            setUsernameFeedback(error.body.username.join('. '))
          }

          if ('password' in error.body) {
            setPasswordFeedback(error.body.password.join('. '))
          }
        }

        if (error.status === 401) {
          if ('detail' in error.body) {
            setFormFeedback(error.body.detail)
          }
        }
      }
    }
  }, [password, props.api, username])
 
  return (
    <div className="row login">
      <div className="col">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input className="form-control" type="text" id="login-username" value={username} onChange={(event) => {
              setUsername(event.target.value)
            }}/>
            <small className="form-text text-muted">{usernameFeedback}</small>
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input className="form-control" type="password" value={password} onChange={(event) => {
              setPassword(event.target.value)
            }} id="login-password" />
            <small className="form-text text-muted">{passwordFeedback}</small>
          </div>
          <small className="form-text text-muted">{formFeedback}</small>
          <button className="btn btn-primary form-control mt-3" type="submit">Login</button>
        </form>
      </div>
    </div>
    )
  }
  
  export default Login;