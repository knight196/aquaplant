import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {GetProducts} from '../GraphQLData/GetProducts'
import {useQuery} from '@apollo/client'
import DeleteProduct from './DeleteProduct'

export default function BooksPage() {

  const {data} = useQuery(GetProducts)

const Delete = async id  =>{
try{
await axios.delete('/books/' + id)
window.location.reload()
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

  function logOut(){
    localStorage.clear()
  window.location.reload()
  }

  return (
<>
<div className="header">

{items.length === 0 ? 
<h1>AquaPlant</h1>
: 
<Link to='/CreateBook'>Add Book</Link>
}


{items.length === 0 ? 
<Link to='/Login'>Login</Link>
:
<button onClick={logOut}>Logout</button>
}
</div>
      <div style={{flexWrap:'wrap'}} className="d-flex justify-content-center">
      {data?.products.map(item =>
      <div className="card text-center" style={{width:'18rem'}}>
        <h5>{item.name}</h5> 
        <img className="card-img-top" src={item.image} alt={item.name}/>
        <div className="card-body">
        <br></br>
        <Link to={`/Bookpage/${item.id}`}>View More</Link>
        <br></br>
        <DeleteProduct id={item.id}/>
        </div>
          </div>
      )}
    </div>
      </>
  )
}
