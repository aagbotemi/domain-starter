const { jwt, verify } = require("jsonwebtoken");
require("dotenv").config()

exports.jwtAuth = {


  AdminVerifyToken: (req, res, next) => {
    
    let token = req.headers["authorization"].split(" ")[1];
    

    if (!token) return res.status(403).send({ message: "Unauthorised Access" });

    verify(token, process.env.secret, (err, decode) => {
      if (err) return res.status(401).send({ message: "forbidden access" });


      if (decode.userType !== "admin")
        return res.status(401).send({ message: "forbidden access" });

        
      req.userId = decode.id;


      next();
    });
  },

  POVerifyToken: (req, res, next) => {

    let token = req.headers["authorization"].split(" ")[1];


    if (!token) return res.status(403).send({ message: "Unauthorised Access" });

    verify(token, process.env.secret, (err, decode) => {
      if (err) return res.status(401).send({ message: "forbidden access" });


      if (decode.userType !== "partnerOrg")
        return res.status(401).send({ message: "forbidden access" });

      req.userId = decode.id;


      next();
    });
  },

  
};