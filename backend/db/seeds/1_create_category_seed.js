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
          title: "test",
          slug: slug("test"),
          description: "test category",
          icon_color: randomColor()
        },
        {
          title: "Javascript",
          slug: slug("Javascript"),
          description: "Js Category",
          icon_color: randomColor()
        },
        {
          title: "spiders",
          slug: slug("spider"),
          description: "spider category",
          icon_color: randomColor()
        }
      ]);
    });
};
