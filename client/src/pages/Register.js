import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterPage'
import Logo from '../components/Logo'
import { FormRow , Alert} from '../components'
import { useAppContext } from '../context/appContext'
// import { CLEAR_ALERT } from '../context/action'

const initialState = {
  name: "",
  email:"",
  password:'',
  isMember: true,
}


export default function Register() {
  const {user} = useAppContext()
  const navigate = useNavigate();

  const [values, setValues] = useState(initialState)
  const {showAlert, displayAlert,  registerUser, loginUser,setupUser, 	isLoading} = useAppContext();


  const toggelMember = ()=>{
    setValues({...values, isMember: !values.isMember})
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e)=>{
    e.preventDefault()
    const {name, password, email, isMember } = values;
    if( !email || !password || (!isMember && !name)) {
      displayAlert();
      return
    }
    const currentUser = {name, email, password};

    if(isMember){
      // loginUser(currentUser)*
      setupUser({currentUser, endPoint: "login", alertText:'Login Successful! Redirecting...'})
    }else{
      // registerUser(currentUser)
      setupUser({currentUser, endPoint: "register", alertText:'User Created! Redirecting...'})

    }
  }
  useEffect(()=>{
    if(user){
    setTimeout(()=>{
      navigate('/')
    },3000)
          
    }
  },[user, navigate])
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}

        {!values.isMember && (
          <FormRow
            type={"name"}
            handleChange={handleChange}
            name="name"
            value={values.name}
          />
        )}
        <FormRow
          type={"email"}
          handleChange={handleChange}
          name="email"
          value={values.email}
        />
        <FormRow
          type={"password"}
          handleChange={handleChange}
          name="password"
          value={values.password}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <div>
          <p>Demo</p>
          <p>
            email : <span>demo@gmail.com</span>
          </p>
          <p>
            password : <span>adminadmin</span>
          </p>
        </div>

        <p>
          {values.isMember ? "not register yet" : "already member?"}
          <button type="button" onClick={toggelMember} className="member-btn">
            {values.isMember ? "register" : "login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}
