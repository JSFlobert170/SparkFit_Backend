const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany();
    if (!allUsers) {
        return res.json({
          status: 404,
          message: "User not found",
        });
    }
    return res.json({
        status: 200,
        message: "Successfully retrieved all users",
        data: allUsers,
    });
} catch (err) {
    return res.json({
      message: "Bad request",
      status: 400,
    });
}
}

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({
        status: 400,
        message: "Id is required",
      });
  }
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(id) },
    });
    if (!user) {
      return res.json({
        status: 404,
        message: "User not found",
      });
  }
      return res.json({
        status  : 200,  
        message : "Successfully retrieved user",
        data : user
      });

  } catch (err) {
    return res.json({
      status: 400,
      message: "bad request",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, profile_picture, password, phone } = req.body;
    let existingUserByPhone = null;
    let existingUserByEmail = null;
    let existingUserName = null;

    if (!id || !req.body) {
      return res.json({
        status: 400,
        message: "Id or body is required",
      });
    }
    if (email) {
      existingUserByEmail = await prisma.user.findUnique({
          where: { email: email },
      });
    }  
  
    if (phone) {
      existingUserByPhone = await prisma.user.findUnique({
          where: { phone: phone },
      });
    }

    existingUserName = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUserName) return res.json({status: 409, message: "username already exists"});
    if (existingUserByEmail || existingUserByPhone) {
      return res.json({
          status: 409,
          message: (existingUserByEmail ? "email" : "phone number") + " already exists",
          data: existingUserByEmail ? email : phone,
      });
    }
    
      const updatedUser = await prisma.user.update({
        where: { user_id: parseInt(id) },
        data: { username, email, profile_picture, password },
      });
      if (!updatedUser) {
        return res.json({
          status: 404,
          message: "User is not found",
        });
      }
      return res.json({
        status  : 200,
        message : "Successfully updated user",
        data : updatedUser
      });
  } catch (err) {
    return res.json({
      status: 400,
      message: "Bad request",
    });
  }
};
  

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
    if (!id) {
      return res.json({
        status: 400,
        message: "Id is required",
      });
    }
    try {
      const deletedUser = await prisma.user.delete({
        where: { user_id: parseInt(id) },
      });
      if (!deletedUser) {
        return res.json({
          status: 404,
          message: "User is not found",
        });
    }
      return res.json({
        status  : 204,
        message : "Successfully deleted user",
        data : deletedUser
      });
  } catch (err) {
      return res.json({
        status: 400,
        message: "Bad request",
          
      });
  }
};

exports.getMe = async (req, res, next) => {
  try {
      const id = req.userToken.id;
      if (!id) {
          return res.json({
            status: 400,
            message: "Id is required",
          });
      }
      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(id) },
      });
      if (!user) {
          return res.json({
            status: 404,
            message: "User is not found",
          });
      }

      return res.json({
        status: 200,
        message: "Successfully retrieved user",
        data: user,
      });
  } catch (err) {
    return res.json({
      status: 400,
      message: "Bad request",
    });
  }
};