import {useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {singleImage,multipleImages} from './UploadImage'
import {GetProducts} from '../GraphQLData/GetProducts'
import {useMutation} from '@apollo/client'
import { updateNewProduct } from '../GraphQLData/Mutation'

export default function Update({id,book}) {

const [bookInfo,setBookInfo] = useState({})

const [user,setuser] = useState([])

    const [items,setitems] = useState([])
    const [name, setName] = useState('');
    const [description,setdescription] = useState('')
    const [colors, setColors] = useState([]);
    const [info,setinfo] = useState([])

    const [image,setimage] = useState('')
    const [images,setimages] = useState([])

    const [singleUploaded,setSingleUploaded] = useState('')

    const [multipleimages,setmultipleimages] = useState([])

    useEffect(() => {
    
      const user =  async () => {
        
        const items = JSON.parse(localStorage.getItem('items'))
        if(items){
          setitems(items)
        }
        const data = await axios.get('/account/account')
        setuser(data.data)
      }
    user()

if(book){
setBookInfo(book)
}
    },[ book])

useEffect(() => {

if(bookInfo){
  setName(bookInfo?.name || '')
  setdescription(bookInfo?.description || '')
  setColors((bookInfo.colors || []).map(item => item))
  setinfo((bookInfo.info || []).map(item => item))
  setimage(bookInfo.image || '')
  setimages((bookInfo.images || []).map(item => item))
}

},[bookInfo])



const a = user.find(item => item.email === items.email)

const role = a?.role

const processItems = (items) => {
  return items?.map((item) => {
    const id = item.match(/\d+/)[0]
    const colors = item.replace(id,'')
    return {id: Number(id),colors}
  })
}

const processInfo = (inputArray) => {
  return inputArray?.map((item) => {
   
    const id = item.match(/^(\d{2})(.*)$/)[1]

    const info = item.replace(id,'')

    return {id,info}
});
}

// Handle color change in the color input fields
const handleColorChange = (index,newColor) => {
  const newColors = [...colors];
  const id = newColors[index].match(/\d+/)[0]
  newColors[index]= `${id}${newColor}`
  setColors(newColors);
};


//handle info change in the info input
const handleInfoChange = (index,newInfo) => {
  const newInfos = [...info]
  const id = newInfos[index].match(/^(\d{2})(.*)$/)[1]
  newInfos[index] = `${id}${newInfo}`
  setinfo(newInfos)
}

//single image
const handleImage = async (e) => {
  e.preventDefault()
  const data = await singleImage(image)
setSingleUploaded(data.url.toString())
}

const imagesUpdate = (item) => {
  return item.map((item) => {
    const id = item.match(/\d+/)[0]
    const images = item.replace(id,'')
    return {id:Number(id),images}
  })
}

const x = imagesUpdate(images)

const updateObjects = x.map((item,index) => ({
  ...item,
  images:multipleimages[index]
}))

const imagesObject = x.map((item,index) => ({
  ...item,
  images:images[index]
}))

//multiple images 
const listimages = async (e) => {
  e.preventDefault()
  let arr = []

  for(let i=0; i<multipleimages.length; i++){
      const data = await multipleImages(multipleimages[i])
      arr.push(data)
  }

  setmultipleimages(arr)
}
const colorStringify =JSON.stringify(processItems(colors))

const colorsArray =JSON.parse(colorStringify)

const infoStringify = JSON.stringify(processInfo((info)))

const infoArray = JSON.parse(infoStringify)

const [updateProduct] = useMutation(updateNewProduct,{variables:{
bookId:id,
  name:name,
  description:description,
  image:!singleUploaded ? image : singleUploaded,
  colors:colorsArray,
  info:infoArray,
  images:multipleimages.length === 0 ? imagesObject : updateObjects
}})

const Update = async () =>{
  
await updateProduct(updateNewProduct,{variables:{
  bookId:id,
  name:name,
  description:description,
  image:!singleUploaded ? image : singleUploaded,
  colors:colorsArray,
  info:infoArray,
  images:multipleimages.length === 0 ? imagesObject : updateObjects,
}})
window.location.reload()
//   try{
// await axios.put('/books', 
//         {
          
//           bookId:id.id,
//           name:name,
//           description:description,
//           image:singleUploaded,
//           colors:colorsArray,
//           info: infoArray,
//           images:updateObjects
//           }
//         )
//         window.location.reload()
//         console.log('products updated')
//       }catch(err){
//         console.log(err)
//       }
    
    }

  return (
    <div>
        {role === 1 ? 
        (
<div style={{padding:'10px'}}>
<hr></hr>

  <h5>Image</h5>

<form onSubmit={handleImage}>
<input onChange={e => setimage(e.target.files[0])} type='file'/>
<button type='submit'>Upload</button>
</form>

<form onSubmit={listimages}>

<input type="file" onChange={e=> setmultipleimages(e.target.files)} multiple/>
  <br></br>
  <button>Upload</button>
  </form>


        <label>
          Product Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Product Description:
          <textarea style={{width:'100%',height:'100px'}}
            type="text"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />
        </label>

        <p>Varities</p>

        {processItems(colors).map((item,index) => (
  <>
  <input type="text" value={item.colors} onChange={e=> handleColorChange(index,e.target.value)}/>
  </>
))}
      <br></br>
      <p>Info</p>
   
      {processInfo(info).map((item,index) => (
        <>
        <input type="text" value={item.info} onChange={e=> handleInfoChange(index,e.target.value)}/>
        </>
      ))}

      <br></br>
        <button style={{border:'none',padding:'10px'}} onClick={Update}>Update </button>


        </div>
        ) :
        <></>
        }
    </div>
  )
}
