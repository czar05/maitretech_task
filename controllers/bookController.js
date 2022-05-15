const db = require("../model/index");
const Book = db.book;
const Joi = require('joi');

const bookController = {
    getBook: async(req,res) =>{
     const id = req.params.id
       try {
        const book = await Book.findOne({
            where: {id:id}
        }).then((bookData)=>{
            res.status(200).json({
                data:bookData,
                message: "book data fetched successfully"
            }).catch((error)=>{
                console.log(error)
            })
        })
       } catch (error) {
           res.status(500).json({message: error.message})
       }
    
    },

    getBooku: async(req,res) =>{
        const id = req.params.id
          try {
           const book = await Book.findOne({
               where: {userId:id}
           }).then((bookData)=>{
               res.status(200).json({
                   data:bookData,
                   message: "book data with userid fetched successfully"
               }).catch((error)=>{
                   console.log(error)
               })
           })
          } catch (error) {
              res.status(500).json({message: error.message})
          }
       
       },

    postBook: async(req,res) =>{
        const userId = req.params.id
        const body = req.body
        const schema = Joi.object({
            title: Joi.string()
              .required()
              .label("title"),
            author: Joi.string()
              .required()
              .label("author"),
            ISBN: Joi.number().integer().required().min(10).label("ISBN"),
            
          }).unknown(true);
          try {
            const value = await schema.validateAsync(body);
            const newBook = await Book.create({
                userId:userId,
                title:body.title,
                author:body.author,
                ISBN:body.ISBN
            })
          } catch (error) {
            res.status(500).json({message: error.message})
          }
    }
}

module.exports = bookController;