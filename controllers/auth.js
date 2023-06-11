const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const{ generarJWT } = require('../helpers/generarJWT')
const login = async (req = request, res = response) => {
  const { correo, password } = req.body;
  try {
    //Verificar si existe el email
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario o Contraseña no son correctos",
      });
    }
    //Verificamos si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El Usuario esta Eliminado",
      });
    }
    //Verificamos la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Contraseña Incorrecta",
      });
    }
    //Generamos JWT
    const token = await generarJWT( usuario.id)
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administador",
    });
  }
};

module.exports = {
  login,
};
