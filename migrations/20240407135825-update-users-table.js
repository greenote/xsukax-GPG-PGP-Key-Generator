"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    })

    await queryInterface.changeColumn("Users", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    })

    await queryInterface.changeColumn("Users", "bio", {
      type: Sequelize.STRING(1000),
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "bio", {
      type: Sequelize.STRING(255),
      allowNull: true,
    })

    await queryInterface.changeColumn("Users", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: null,
    })

    await queryInterface.changeColumn("Users", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: null,
    })
  },
}
