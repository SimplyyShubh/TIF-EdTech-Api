const { verify } = require("jsonwebtoken");

//CheckAuth middleware Wrapper to get an Addtional param to get check Scope along with token
const checkAuth = (scope = "") => {
  return (req, res, next) => {
    try {
      let token = req.headers.authorization;

      if (token) {
        //remove Bearer from token
        token = token.slice(7);

        verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
          //Check if token is valid
          if (err) {
            res.status(400).json({
              status: false,
              errors: {
                message: "Invalid Token",
              },
            });
          } else {
            //Check if user has the required scope
            const userScopes = decodedToken.scopes;

            if (!userScopes.includes(scope)) {
              return res.status(400).json({
                status: false,
                errors: {
                  message: "Access Denied! No Permission",
                },
              });
            }
            //Continue to next middleware
            next();
          }
        });

        //If No Token is provided
      } else {
        res.status(400).json({
          status: false,
          errors: {
            message: "Access Denied! No Token",
          },
        });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({
        status: false,
        errors: {
            message: "Something went wrong.",
        }
      });
    }
  };
};

module.exports = {
  checkAuth,
};
