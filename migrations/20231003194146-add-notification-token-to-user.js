'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'nToken', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "Notification Token"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'nToken');
  }
};
