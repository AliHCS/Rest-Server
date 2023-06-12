const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    req.uid = uid;
    //Verificamos la informacion del usuario logeado
    const usuarioLogeado = await usuarioModel.findById(uid);
    if (!usuarioLogeado) {
      return res.status(401).json({
        msg: "Usuario no existente",
      });
    }
    //verificar si el uid tiene estado en true
    if (!usuarioLogeado.estado) {
      return res.status(401).json({
        msg: "usuario con estado en False",
      });
    }
    req.usuarioLogeado = usuarioLogeado;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
