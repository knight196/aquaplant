import { useMutation } from '@apollo/client'
import {useEffect,useState} from 'react'
import { ProductDelete } from '../GraphQLData/Mutation'
import axios from 'axios'

export default function DeleteProduct({id}) {

  const [user,setuser] = useState([])

  const [items,setitems] = useState([])

  const [deleteProduct] = useMutation(ProductDelete,{variables:{id:id}})
  
const deletelist = async () => {
await deleteProduct({variables:{id:id}})
window.location.reload()
}

const a = user.find(item => item.email === items.email)

const role = a?.role


useEffect(() => {
const user = async () => {
  const items = JSON.parse(localStorage.getItem('items'))
  if(items){
    setitems(items)
  }
  const data = await axios.get('/account/account')
  setuser(data.data)
}
user()
},[])

    return (
    <div>
      {role === 1 ?
      <button className="bg-danger" onClick={deletelist}>Delete</button>
      :
      <></>
      }
    </div>
  )
}
