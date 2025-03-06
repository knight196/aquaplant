import {gql} from '@apollo/client'

const ProductDelete = gql`

mutation deleteProduct($id:ID){
    deleteProduct(id:$id){
    id,
    
}
}
`

const newProduct = gql `

mutation createProduct(

$name:String,
$description:String,
$image:String,
$images:[String],
$colors:[String],
$info:[String]
){
createProduct(
    name:$name,
    description:$description,
    image:$image,
    images:$images,
    colors:$colors,
    info:$info
){
    name,
    description,
    image,
    images,
    colors,
    info

}
}

`

const updateNewProduct = gql`

mutation updateProduct(
$bookId:Int
$name:String
$description:String,
$image:String,
$images:[imagesList],
$colors:[colorsList],
$info:[infoList]
){
   updateProduct(
    bookId:$bookId,
     name:$name,
    description: $description,
    image: $image,
    images: $images,
    colors: $colors,
    info: $info
   ){
    name,
    description,
    image,
    images{
        id
        images
    }
    colors{
        id
        colors
    }
    info{
        id
        info
    }
   }
}


`

export {ProductDelete,updateNewProduct,newProduct}