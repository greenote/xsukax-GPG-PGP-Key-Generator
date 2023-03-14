'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {model: 'Users', key: 'id'},
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      receiverId: {
        type: Sequelize.INTEGER,
        references: {model: 'Users', key: 'id'},
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      userConnectionId: {
        type: Sequelize.INTEGER,
        references: {model: 'UserConnections', key: 'id'},
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {model: 'Categories', key: 'id'},
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};