// Import Models
const Category = require('./Category');
const Product = require('./Product');
const ProductTag = require('./ProductTag');
const Tag = require('./Tag');

// Product belongsTo

Product.belongsTo(Category, {
    foreignKey: 'category_id'

});

Category.hasMany(Product, {
    foreignKey: 'category_id'

});

Product.belongsToMany(Tag, {
    foreignKey: 'product_id'
});

Tag.belongsToMany(Product, {
    foreignKey: 'tag_id'

});

module.exports = {
    Category,
    Product,
    ProductTag,
    Tag,
};