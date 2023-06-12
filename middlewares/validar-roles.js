const esAdminRole = (req, res, next) => {
  //Verifica si se leyo el token
  if (!req.usuarioLogeado) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero ",
    });
  }
  //verificamos si el rol es administrador
  const { rol, nombre } = req.usuarioLogeado;
  if (rol !== "ADMIN_ROLE") {
    return res.status(500).json({
      msg: `${nombre} no es un administrador`,
    });
  }
  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuarioLogeado) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero ",
      });
    }
    if (!roles.includes(req.usuarioLogeado.rol)) {
      return res.status(401).json({
        msg: `El servicio require uno de estos roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
