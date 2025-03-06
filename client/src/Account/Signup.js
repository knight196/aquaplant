import {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

export default function Signup() {

const [signup,setsignup] = useState({
  username:'',
  email:'',
  password:'',
})

const handleChange = e => {

setsignup((prev) => ({...prev, [e.target.name] : e.target.value}))

}

const handleClick = async e => {

  e.preventDefault()

  try{

await axios.post('/account/Signup', signup)

  }catch(err){
    console.log(err)
  }

}

  return (
    <div>
      <p>Username</p>
      <input type="text" placeholder="username" onChange={handleChange} name='username'/>
        <p>Email</p>
        <input type="email" placeholder="email" onChange={handleChange} name='email'/>
        <p>Password</p>
        <input type="password" placeholder="password" onChange={handleChange} name='password'/>
        <br></br>
        <button onClick={handleClick}>SignUp</button>
        <br></br>
      <Link to='/Login'>Login</Link>
    </div>
  )
}
