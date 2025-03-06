import {gql} from '@apollo/client'

const GetProducts = gql `

query getProducts {

products{
    id,
    name,
    description,
    image
}

}

`

const GetProduct = gql `

query GetProduct($id: Int){
    singleProduct(id:$id){
        id,
        name,
        description,
        image,
        colors,
        images,
        info
    }
}

`

export {GetProducts,GetProduct}