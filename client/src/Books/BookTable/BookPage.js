import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import UpdateBook from '../Update'
import BookInfo from './BookInfo'
import {GetProduct} from '../../GraphQLData/GetProducts'
import {useQuery} from '@apollo/client'

export default function BookPage() {

  
  const params = useParams()
  const id = parseInt(params.id)
  
  const {data} = useQuery(GetProduct,{variables:{id:id}})
  
  const [book,setbook] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if(data){
        setbook(data?.singleProduct)
      }
    }
    fetchData()
  },[data])
  
  
  const x = book.colors?.map(item => {
  const number = item.match(/\d+/)[0]
  const word = item.replace(number,'')

  return {number,word}
})

const imagesUpdate = book.images?.map(item => {
const number = item.match(/\d+/)[0]
const url = item.replace(number,'')
return {number,url}
})



return (
  <div>
    <div className="bookpage justify-content-between align-items-center text-center" style={{padding:'10px',height:'100vh'}}>
      <div>
      <h1>{book?.name}</h1>
      <img src={book?.image}  alt={book?.name}/>
      </div>
      <div className="p-2 text-center">
      <p>{book?.description}</p>
      <br></br>
      {imagesUpdate?.map(item => 
      <>
      {item.url === 'No Image' ?
          <></>
          :
          <img style={{width:'100px',height:'100px',border:'1px solid black',margin:'10px'}} src={item.url} alt={''}/>
        } 
        </>
      )}
      <br></br>
      <small>Available in: </small>{x?.map(item => <small style={{border:'1px solid black',margin:'0 1px',padding:'2px 5px'}}>{item.word}</small>)}
      <h1>Plant Info:</h1>
      <BookInfo a={book}/>
      </div>
    </div>
    <UpdateBook id={id} book={book}/>
          </div>
  )
}
