const express = require('express')
const db = require('../Mysql')
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv')
const path = require('path')

const router = express.Router()

dotenv.config({path:path.resolve(__dirname,'../.env')})


//cloudinary config
cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret
})


router.get('/books', (req,res) => {

    const q = 'SELECT * FROM products'

    db.query(q, (err,data) => {
        if(err)return res.json(err)
            return res.json(data)
    })

})

router.post('/books', (req,res) => {
    const q = 'INSERT INTO books (title, description, price, cover) VALUES (?)';

    const values = [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ];

    db.query(q,[values], (err,data) => {
        if(err) return res.json(err)
            return res.json('books has been created')
    })

})

router.get('/BooksInfo', (req,res) => {

const q = 
`SELECT 
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
GROUP BY products.id;`;


db.query(q,(err,data) => {
    if(err) return res.json(err)
        return res.json(data)
})
})

router.delete('/books/:id', (req,res) => {

    const bookId = req.params.id;

    const q = 'DELETE FROM products WHERE id = ?'

    db.query(q,[bookId], (err,data) => {
        if(err) return res.json(err)
            return res.json('Book has been deleted')
        })
        
      })

//update the book
router.put('/books', (req,res) => {

const {name,colors,description,info,bookId,image,images} = req.body

  
  const q = 'UPDATE products SET name = ?, description = ? WHERE id = ?'
  
  db.query(q,[name,description,bookId], (err,data) => {
    if (err) {
      return res.status(500).send('Error updating product');
    }
    
    //colors update
      const updatePromises = colors.map(color => {
      const q = 'update product_variant set color = ? where id = ?';
      return new Promise((resolve, reject) => {
        db.query(q, [color.color, color.number], (err, result) => {
          if (err) {
            reject(err);  // Reject if there's an error
          } else {
            resolve(result);  // Resolve when the query is successful
          }
        });
      });
  });

  //info update
  const updateInfos = info.map(info => {
    const q = 'update product_info set info = ? where id = ?'
    return new Promise((resolve,reject) => {
      db.query(q,[info.word,info.number], (err,result)=> {
        if(err){
          reject(err)
        }else{
          resolve(err)
        }
      })
    })
  })

  //update image
  const imgQuery = 'update products set image = ? where id = ?'
  db.query(imgQuery,[image,bookId], (err,data) => {
    if(err){
      return res.status(500).send('Error updating product image')
    }
  })

  //update images 
  const updateImages = images.map(images => {
    const q = 'update product_images set images = ? where id = ?'
    return new Promise((resolve,reject) => {
      db.query(q,[images.url,images.number],(err,result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  })
  
  // Wait for all promises to be resolved
  Promise.all([updatePromises,updateInfos,updateImages]);
  
  // Send a single response after all updates are complete
  res.json('Book has been updated');
  
})
  
})




//cloudinary image upload

router.post('/add', (req,res) => {

    const {name,colors,description,singleuploaded,uploadedimages,info} = req.body

    const q = 'INSERT INTO products (name,description,image) VALUES (?,?,?)'

    db.query(q,[name,description,singleuploaded],(err,result) => {
      if(err){
        return res.status(500).json({error:'Failed to add product'})
      }
    
      const productId = result.insertId
    
    //SQL query to insert product variants (colors)
    
    const variantQueries = colors.map(color => {

      const q = 'insert into product_variant (product_id,color) values (?,?)';
     new Promise((resolve,reject) => {

       db.query(q, [productId,color], (err,result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
      
    })
    })

      
    //SQL query to insert product (images)

    const variantImages = uploadedimages.map(item => {
      const q = 'insert into product_images (product_id,images) values (?,?)';
     new Promise((resolve,reject) => {
       db.query(q,[productId,item], (err,result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    
  })

  //SQL query to info product (info)

  const variantInfo = info.map(item => {
    const q = 'insert into product_info (product_id,info) values (?,?)';
    new Promise((resolve,reject) => {
      db.query(q,[productId,item], (err,result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  })
  
    //wait for all results inserts to complete
    Promise.all([variantQueries,variantImages,variantInfo])
    .then(() => {
      res.status(200).json({message:'Product and variants added successfully'})
    })
    .catch(err => {
      res.status(500).json({error:'Failed to add product images', details:err.message})
    })

  })
    
})



module.exports = router