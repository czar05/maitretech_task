const jwt = require("jsonwebtoken");
const db = require("../model/index");
const nodemailer = require("nodemailer");
const User = db.user;
const Joi = require("joi");
const bcrypt = require('bcrypt');


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "maitretech", {
    expiresIn: maxAge,
  });
};


  
const userController = {
 
 

  login: async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
      username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .label("username"),
      password: Joi.string().required().label("password"),
    }).unknown(true);
    try {
       
        const value = await schema.validateAsync(body);
        const user =  await User.findOne({
        where: {
          username: req.body.username
        }
      }).then(data =>{
        const validPassword =  bcrypt.compareSync(body.password, data.password);
       
        if (validPassword) {
          console.log("password is valid")
        } else {
          res.status(400).json({ message: "Password is incorrect" });
        }
  
          
          const token = createToken(data.id);
          res.status(200).json({ message: "logged in successfully",
            data:data,
            token:token
        });
      }).catch(error =>{
        res.status(400).json({ message: "error in loggin in" });
      }) 
     
    } catch (error) {
     res.status(600).json({message: "Invalid credentials"});
    }
  },
 
  register: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .label("username"),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .label("email"),
      password: Joi.string().required().min(6).label("password"),
      password2: Joi.string().required().min(6).label("password2"),
      dob: Joi.date().raw().required().label("dob"),
    }).unknown(true);
    try {
      console.log("formData",body)
      const value = await schema.validateAsync(body);
     console.log(" username :" + body.username + " email :" + body.email + " pass:" + body.password + "dob:" + body.dob);
      if (!body.username || !body.email || !body.password || !body.password2 || !body.dob) {
        
       res.status(400).json({message: "please enter all fields"});
      }
     
      if (body.password !== body.password2) {
        res.status(400).json({message: "passwords do not match"});
      }

      const user = await User.findOne({
        where: {
          email: body.email,
        },
      });
      
      if (user) {
        res.status(400).json({message: "email is already registered"});
      } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(body.password, salt);

        const newUser = await User.create({
          username: body.username,
          email: body.email,
          password: password,
          dob: body.dob
        });
        res.status(200).json({message: "user is registered successfully"});
      }
    
    } catch (error) {
      console.log(error);
      res.status(500).json({message: error.message});
    }
  },

 

  forgotPassword: async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .label("email"),
    }).unknown(true);
    try {
        const value = await schema.validateAsync(body);
      const user = await User.findOne({
        where: {
          email: body.email,
        },
      }).then(user =>{
          
        const token = createToken(user.id);

         
        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "doorvicecare@gmail.com",
            pass: "uucksrlmbidzygkv",
          },
        });

        let mailDetails = {
          from: "doorvicecare@gmail.com",
          to: body.email,
          subject: "Test mail",
          text: `Please reset your password by Clicking here:-'http://localhost:3000/reset-password/${user.id}/${token}'>`, // html body,
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            res.status(400).json({ error: true, message: "Invalid Email" });
          } else {
          
            res.status(200).json({ error: false, message: "Email sent successfully" });
          }
        });
       
      }).catch(error =>{
        res.status(400).json({ error: true, message: "Invalid Email" });
      })
        
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },


  resetPassword: async (req, res) => {
   
    const body = req.body;
    const { id, token } = req.params;
    const schema = Joi.object({
    password: Joi.string().required().label("password"),
    password2: Joi.string().required().label("password2"),
    }).unknown(true);
    try {
        const value = await schema.validateAsync(body);
    
      console.log("id", id);
      console.log("token", token);

      console.log("password:" + body.password + "password2:" + body.password2);

      if (token) {
        jwt.verify(token, "maitretech", (err, decodedToken) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log(decodedToken);
          }
        });
      }

      if (!body.password || !body.password2){
        res.status(400).json({message: "please enter both passwords"})
      }

      if (body.password !== body.password2) {
        res.status(400).json({message: "passwords do not match"})
      };
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(body.password, salt);
      await User.update({ password: password }, { where: { id: id } }).then(
        (data) => {
          res.status(200).json({message: "user password updated successfully",
          user: data
        })
        }
      ).catch(error =>{
        res.status(400).json({message: error.message})
      })
     
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
  
};

module.exports = userController;
