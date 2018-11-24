const slug = require("slugify");
const randomColor = require("randomcolor");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("categories")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("categories").insert([
        {
          id: 1,
          title: "test",
          slug: slug("test"),
          description: "test category",
          icon_color: randomColor()
        },
        {
          id: 2,
          title: "JS",
          slug: slug("JS"),
          description: "Js Category",
          icon_color: randomColor()
        },
        {
          id: 3,
          title: "spiders",
          slug: slug("spider"),
          description: "spider category",
          icon_color: randomColor()
        }
      ]);
    });
};
