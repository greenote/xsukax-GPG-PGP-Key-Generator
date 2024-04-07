"use strict"

const { ENV } = require("../utilities/helpers")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: ENV("DEMO_NAME"),
          phone: ENV("DEMO_PHONE"),
          token: ENV("DEMO_OTP"),
          status: "verified",
          dName: "Greenote",
          bio: "Greenote  is a free messaging and note taking app. It is easy to use, reliable and private, so you can easy. Greenote currently works works only on mobile, with no subscription fee. Greenote was designed to make conversations and chats organised and seamless.",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { phone: [ENV("DEMO_PHONE")] })
  },
}
