const {GraphQLInt,GraphQLString, GraphQLList,GraphQLObjectType,GraphQLID,GraphQLInputObjectType} = require('graphql')
const db = require('../../Mysql')
const GetProduct = require('../Types/GetProduct')
const updateProduct = require('../Types/UpdateProduct')

const imagesList  = new GraphQLInputObjectType({
name: 'imagesList',
fields: () => ({
    id:{type: GraphQLID},
    images:{type:GraphQLString}
})
})

const colorList = new GraphQLInputObjectType({
    name:'colorsList',
    fields: () => ({
        id:{type:GraphQLID},
        colors:{type:GraphQLString}
    })
})

const infoList = new GraphQLInputObjectType({
    name:'infoList',
    fields:() => ({
        id:{type:GraphQLID},
        info:{type:GraphQLString}
    })
 })

const productMutation = new GraphQLObjectType({
name:'Mutation',
fields: () => ({

    deleteProduct:{
        type:GetProduct,
    args:{
        id:{type:GraphQLID}
    },
    resolve(parent,args){
        return new Promise((resolve,reject) => {          
            db.query('delete from product_images where product_id = ?', [args.id], (err, result) => {
                if(err){
                    reject(err)
                }else{
                    db.query('delete from product_variant where product_id = ?', [args.id], (err,result) => {
                        if(err){
                            reject(err)
                        }else{
                            db.query('delete from product_info where product_id = ?', [args.id], (err,result) => {
                                if(err){
                                    reject(err)
                                }else{
                                    db.query('delete from products where id = ?', [args.id], (err,result) => {
                                        if(err){
                                            reject(err)
                                        }else if (result.affectedRows > 0){
                                            resolve(result)
                                        }else{
                                            reject(new Error('Product not found.'))
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    },
},
createProduct:{
    type:GetProduct,
    args:{
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        image:{type:GraphQLString},
        images:{type:new GraphQLList(GraphQLString)},
        colors:{type: new GraphQLList(GraphQLString)},
        info:{type: new GraphQLList(GraphQLString)}
    },
    resolve(parent,args){
        return new Promise((resolve,reject) => {
            db.query('insert into products (name,description,image) values (?,?,?)',
            [args.name,args.description,args.image],(err,result) => {
                if(err){
                return reject(err)
                }

                const productId = result.insertId

                //sql query to insert product variants (colors)

                const variantQueries = args.colors.map(color => {
                    return new Promise((resolve,reject) => {
                        const q = 'insert into product_variant (product_id,color) values (?,?)'
                        db.query(q,[productId,color], (err,result) => {
                            if(err){
                               return reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    })
                })

                //sql query to insert product (images)
                const variantImages = args.images.map(item => {
                   return new Promise((resolve,reject) => {
                        const q = 'insert into product_images (product_id,images) values (?,?)'
                        db.query(q,[productId,item], (err,result) => {
                            if(err){
                              return reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    })
                })

                //sql query to insert product (info)

                const variantInfo = args.info.map(item => {
                   return new Promise((resolve,reject) => {
                    const q = 'insert into product_info (product_id,info) values (?,?)'
                        db.query(q,[productId,item], (err,result) => {
                            if(err){
                                  return reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    })
                })

                Promise.all([...variantQueries,...variantImages,...variantInfo])
                .then(() => {
                    // All insertions are complete
                    resolve({ message: 'Product and variants added successfully' });
                })
                .catch(err => {
                    reject({ error: 'Failed to add product variants, images, or info', details: err.message });
                });
            }
            )
        })
    }
},

updateProduct:{
    type:updateProduct,
    args:{
        bookId:{type:GraphQLInt},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        image:{type:GraphQLString},
        images:{type: new GraphQLList(imagesList)},
        colors:{type: new GraphQLList(colorList)},
        info:{type:new GraphQLList(infoList)}
    },
    resolve(parent,args){
        return new Promise((resolve,reject) => {
            db.query('update products set name = ?, description = ?, image = ? where id = ? ',
            [args.name,args.description,args.image,args.bookId], (err,result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }


                //colors update 

                const updatePromises = args.colors.map(color => {
                    return new Promise((resolve,reject) => {
                        const q = 'update product_variant set color =? where id = ?'
                        db.query(q,[color.colors,color.id], (err,result) => {
                            if(err){
                                reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    })
                })

                const updateInfos = args.info.map(info => {
                    return new Promise((resolve,reject) => {
                        const q = 'update product_info set info = ? where id = ?'
                        db.query(q,[info.info,info.id], (err,result) => {
                            if(err){
                                reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    })
                })

                const updateImages = args.images.map(images => {
                    return new Promise((resolve,reject) => {
                            const q = 'update product_images set images = ? where id = ?'
                            db.query(q,[images.images,images.id],(err,result) => {
                                if(err){
                                    reject(err)
                                }else{
                                    resolve(result)
                                }
                            })
                        })
                })

                Promise.all([updatePromises,updateInfos,updateImages])
                .then(() => {
                    // All insertions are complete
                    resolve({ message: 'Product and variants updated successfully' });
                })
                .catch(err => {
                    reject({ error: 'Failed to add product variants, images, or info', details: err.message });
                });
            }
        )
        })
    }
}

})

})

module.exports = productMutation