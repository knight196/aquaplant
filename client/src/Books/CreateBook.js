import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {singleImage,multipleImages} from './UploadImage'
import  {useMutation} from '@apollo/client'
import {newProduct} from '../GraphQLData/Mutation'
import  {GetProducts} from '../GraphQLData/GetProducts'

export default function CreateBook() {

const navigate = useNavigate()

const [name, setName] = useState('');
const [description,setdescription] = useState('')
const [colors, setColors] = useState(['']); // Start with one color input
const [info,setinfo] = useState([''])
const [image,setimage] = useState('')
const [images,setimages] = useState([])
const [singleuploaded,setSingleUploaded] = useState('')
const [uploadedimages,setuploadedimages] = useState([])

//single image
const handleImage = async (e) => {
  e.preventDefault()
  const data = await singleImage(image)
setSingleUploaded(data.url.toString())
}

//multiple images
const listimages = async (e) => {
  e.preventDefault()
let arr = []
for(let i=0; i<images.length; i++){
  const data = await multipleImages(images[i])
  arr.push(data)
}
setuploadedimages(arr)
}

// Handle color change in the color input fields
const handleColorChange = (index, e) => {
  const newColors = [...colors];
  newColors[index] = e.target.value;
  setColors(newColors);
};

// Handle adding a new color input field
const handleAddColor = () => {
  setColors([...colors, '']);
};

const handleDeleteColor = (i) => {
const deleteColor = [...colors]
deleteColor.splice(i,1)
setColors(deleteColor)
}

const handleInfoChange = (index,e) => {
  const newInfo = [...info]
  newInfo[index] = e.target.value;
  setinfo(newInfo)
}

const handleAddInfo = () => {
  setinfo([...info,''])
}

const handleDeleteInfo = (i) => {
const deleteInfo = [...info]
deleteInfo.splice(i,1)
setinfo(deleteInfo)
}

const [createNewProduct] = useMutation(newProduct,{variables:{
  name:name,
  description:description,
  image:singleuploaded,
  images:uploadedimages,
  colors:colors,
  info:info
  },refetchQueries:[{query:GetProducts}]})
  



// Handle form submission
const handleSubmit =  async (e) => {
  e.preventDefault();

//   const data = {
//     name,
//     singleuploaded,
//     uploadedimages,
//     description,
//     colors: colors.filter(color => color.trim() !== ''), // Remove empty color fields
//     info:info.filter(info => info.trim() !== '')
//   };

//  axios.post('/add', data)
//     .then(response => {
//       alert(response.data.message);
//     })
//     .catch(error => {
//       alert('Error: ' + (error.response?.data?.error || error.message));
//     });

await  createNewProduct(newProduct,{variables:{
  name:name,
  description:description,
  image:singleuploaded,
  images:uploadedimages,
  colors:colors,
  info:info
}})
window.location.reload()
.then(response => {
  alert('Product added successfully!');
})
.catch(err => {
  console.log(err)
  alert('Failed to add product');
});

};

  return (
    <div>
        <h1>Add New Book</h1>

<form onSubmit={handleImage}>
<h5>Image</h5>
<input onChange={e=> setimage(e.target.files[0])} type="file"/>
<button type="submit">Upload</button>
</form>

<form onSubmit={listimages}>
<h5>Variant Images</h5>
<input onChange={e=> setimages(e.target.files)} type="file" multiple/>
<button type="submit">Upload</button>
</form>

      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Colors:</label>
          {colors.map((color, index) => (
            <div key={index}>
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e)}
              />
              {color.length!==1 && 
              <button onClick={()=> handleDeleteColor(index)}>Remove</button>
              }
            </div>
          ))}
          <button type="button" onClick={handleAddColor}>Add Color</button>
        </div>

        <div>
          <label>Info:</label>
          {info.map((info, index) => (
            <div key={index}>
              <input
                type="text"
                value={info}
                onChange={(e) => handleInfoChange(index, e)}
                
              />
              {info.length !==1 && 
              <button onClick={()=> handleDeleteInfo(index)}>Remove</button>
              }
            </div>
          ))}
          <button type="button" onClick={handleAddInfo}>Add Info</button>
        </div>

        <button type="submit">Add Product</button>
      </form>



    </div>
  )
}
