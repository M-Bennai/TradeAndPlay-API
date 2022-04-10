const { User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const userController = {
  addUser: async ({ email, password, role, firstName, lastName, nickname }) => {
    if (role === "admin") {
      const newUserAdmin = await User.create({
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password,
        role,
        nickname,
      });
      return newUserAdmin;
    } else if (role === "client") {
      const newUserClient = await User.create({
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password,
        role,
        nickname,
      });
      return newUserClient;
    } else {
      return "ne peut pas creer ce type de profil";
    }
  },

  getClienttUser: async () => {
    const clientsUsers = await User.findAll({
      where: { role: "client" },
    });
    return clientsUsers;
  },

  getOneClientUser: async (i) => {
    const oneClient = await User.findByPk(id);
    return oneClient;
  },

  updateUserName: async (id, name) => {
    const user = await User.findByPk(id);
    if (user) {
      const userNameUpdated = await User.update(
        { name: name },
        { where: { id } }
      );
    }
  },

  updateUserImage: async (url, id) => {
    const user = await User.findByPk(id);
    if (user) {
      const userNameUpdated = await User.update(
        { image: url },
        { where: { id } }
      );
    }
  },

  deleteUser: async (id, imageName) => {
    const user = await User.findByPk(id);
    if (user) {
      user.destroy();
      await bucket.file(imageName).delete();
      return;
    }
  },

  updateUserEmail: async (email, id) => {
    console.log("email :>> ", email);
    console.log("id :>> ", id);
    const user = await User.findByPk(id);
    if (user) {
      const userUpdated = await User.update(
        { email: email },
        { where: { id } }
      );
      console.log("userUpdated :>> ", userUpdated);
    }
  },
  updateUserPassword: async (id, password) => {
    const user = await User.findByPk(id);
    if (user) {
      await User.update(
        {
          password: password,
        },
        { where: { id } }
      );
    }
  },
};

module.exports = userController;
