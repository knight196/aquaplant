const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList} = require('graphql')

//Get Product 
const ProductType = new GraphQLObjectType({
    name:'GetProduct',
    fields:() => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        image:{type:GraphQLString},   
       colors:{type: new GraphQLList(GraphQLString),
        resolve(parent,args){
            return parent.colors ? parent.colors.split(','):[]
        }
    },
        images:{type:new GraphQLList(GraphQLString),
        resolve(parent,args){
        return parent.images ? parent.images.split(','):[]
        }    
        },
        info:{type:new GraphQLList(GraphQLString),
            resolve(parent,args){
                return parent.info ? parent.info.split(','):[]
            }
        }
    }),
})



module.exports = ProductType