function authorize(requiredRoles) {
    return (req, res, next) => {
      const token = req.cookies.authToken;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
  
        const userRoles = req.user.roles || [];
        const isAuthorized = Array.isArray(requiredRoles)
          ? requiredRoles.some((role) => userRoles.includes(role))
          : userRoles.includes(requiredRoles);
  
        if (!isAuthorized) {
          return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
        }
  
        next();
      } catch (error) {
        res.status(401).json({ error: "Invalid token" });
      }
    };
  }
  
  module.exports = authorize;
  