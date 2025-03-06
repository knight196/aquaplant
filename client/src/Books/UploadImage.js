import axios from 'axios'

export const singleImage = async (file) => {

const formData = new FormData()
formData.append('file', file)
formData.append('upload_preset', 'Products')
formData.append('folder', 'Product')
const {data}  = await axios.post('https://api.cloudinary.com/v1_1/personal-use-only/image/upload', formData)
return {url:data?.secure_url.toString()}

}

export const multipleImages = async (file) => {

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'Products')
    formData.append('folder', 'ProductVariants')
 const {data} = await axios.post('https://api.cloudinary.com/v1_1/personal-use-only/image/upload', formData)
  return data?.secure_url.toString()
  }

