const {GraphQLSchema,GraphQLObjectType,GraphQLList,GraphQLInt} = require('graphql')
const db = require('../Mysql')
const GetProduct = require('./Types/GetProduct')

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        products:{
        type:new GraphQLList(GetProduct),
        resolve(parent,args){
            return new Promise((resolve,reject) => {
            db.query(`select * from products`, (err,result) => {
                if(err) reject(err)
                    resolve(result)
            })
            })
        }       
        },
        singleProduct:{
            type:GetProduct,
            args:{id: {type:GraphQLInt}},
            resolve(parent,args){
                return new Promise((resolve,reject) => {
                    db.query(`
                        SELECT 
  products.id,
  products.name,
  products.image,
  products.description,
  GROUP_CONCAT(distinct product_variant.id,product_variant.color) AS colors,
  group_concat(distinct product_images.id,ifnull(product_images.images, 'No Image')) as images,
  group_concat(distinct product_info.id,product_info.info) as info
FROM products
LEFT JOIN product_variant ON products.id = product_variant.product_id
left join product_images on products.id = product_images.product_id
left join product_info on products.id = product_info.product_id
where products.id =?
GROUP BY products.id
                        `,
                        [args.id],(err,result) => {
                        if(err) reject(err)
                            resolve(result[0])
                    })
                })
            }
        }
    },
})


module.exports = RootQuery