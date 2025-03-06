import {useState,useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'


export default function Login() {

const navigate = useNavigate()

const [login,setlogin] = useState({
  email:'',
  password:''
})

const [user,setuser] = useState([])

const handleChange = e => {
  setlogin((prev) => ({...prev, [e.target.name]: e.target.value}))
}

const handleClick = async e => {

try{

  e.preventDefault()

 await axios.post('/account/Login', login)

  localStorage.setItem('items', JSON.stringify(login))

  navigate('/')
}catch(err){
  console.log(err)
}

}

const [items,setitems] = useState([])

useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if(items){
      setitems(items)
    }

},[])

function signOut(){
localStorage.clear()
window.location.reload()
}

  return (
    <div>
        {items.length === 0 ?  (
          <>
      <p>Email</p>
        <input type="email" placeholder='email' onChange={handleChange} name='email'/>
        <p>Password</p>
        <input type="password" placeholder="password" onChange={handleChange} name='password'/>
        <br></br>
          <button onClick={handleClick}>Login</button>
          </>
        )
        :
        (
          <>
          <p>{items.email}</p>
        <button onClick={signOut}>Logout</button>
          </>
        )
      }
  
      
      
        <br></br>
        <Link to='/Signup'>Signup</Link>
    </div>
  )
}
