"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "nToken", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "Notification Token",
    })
    await queryInterface.addColumn("Users", "dName", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: "Display Name",
    })
    await queryInterface.addColumn("Users", "bio", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn("Users", "dPicture", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: "Display Picture",
    })
    await queryInterface.addColumn("Users", "dPictureKey", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      comment: "Display Picture Key",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "nToken")
    await queryInterface.removeColumn("Users", "dName")
    await queryInterface.removeColumn("Users", "bio")
    await queryInterface.removeColumn("Users", "dPicture")
    await queryInterface.removeColumn("Users", "dPictureKey")
  },
}
