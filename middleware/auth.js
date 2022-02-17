const { jwt, verify } = require("jsonwebtoken");
require("dotenv").config();

exports.jwtAuth = {
  adminVerifyToken: (req, res, next) => {
    let headers = req.headers["authorization"];
    if (headers == undefined) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access, missing authorization token" });
    }
    let token = headers.split(" ")[1];
    if (!token) return res.status(403).send({ message: "Unauthorised Access" });

    verify(token, process.env.secret, (err, decode) => {
      if (err) return res.status(401).send({ message: "forbidden access" });

      if (decode.userType !== "admin")
        return res.status(401).send({ message: "forbidden access" });

      req.userId = decode.id;
      req.poId = decode.partnerOrganisation;
      next();
    });
  },

  poVerifyToken: (req, res, next) => {
    let headers = req.headers["authorization"];
    if (headers == undefined) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access, missing authorization token" });
    }
    let token = headers.split(" ")[1];

    if (!token) return res.status(403).send({ message: "Unauthorised Access" });

    verify(token, process.env.secret, (err, decode) => {
      if (err) return res.status(401).send({ message: "forbidden access" });

      // if (
      //   decode.userType !== "admin"
      // )
      //   return res.status(401).send({ message: "forbidden access" });

      req.userId = decode.id;
      req.poId = decode.partnerOrganisation;
      if(decode.beneficiaryInfo){
        req.beneficiary = decode.beneficiaryInfo.id;

      }


      next();
    });
  },

  generalVerifyToken: (req, res, next) => {
    let headers = req.headers["authorization"];
    if (headers == undefined) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access, missing authorization token" });
    }
    let token = headers.split(" ")[1];

    // console.log(token);
    if (!token) return res.status(403).send({ message: "Unauthorised Access" });

    verify(token, process.env.secret, (err, decode) => {
      if (err) return res.status(401).send({ message: "forbidden access" });

      // console.log(decode.beneficiaryInfo.id);
      req.userId = decode.id;
      req.poId = decode.partnerOrganisation;

      if(decode.beneficiaryInfo){
        req.beneficiary = decode.beneficiaryInfo.id;

      }

      next();
    });
  },
};
