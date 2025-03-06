const { GraphQLID, GraphQLObjectType,GraphQLString, GraphQLList } = require("graphql");



const updateProductType = new GraphQLObjectType({
    name:'updateProduct',
    fields: () => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        image:{type:GraphQLString},
        images:{ type: new GraphQLList(imageUpdate)},
        colors:{type: new GraphQLList(colors)},
        info:{type: new GraphQLList(info)}
    })
})


const imageUpdate = new GraphQLObjectType({
    name:'imagesUpdate',
    fields:() => ({
        id:{type:GraphQLID},
        images:{type:GraphQLString}
    })
})

const colors = new GraphQLObjectType({
    name:'colors',
    fields:() => ({
        id:{type:GraphQLID},
        colors:{type:GraphQLString}
    })
})

const info = new GraphQLObjectType({
    name:'info',
    fields: () => ({
        id:{type:GraphQLID},
            info:{type:GraphQLString}
    })
})

module.exports = updateProductType