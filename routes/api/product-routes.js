const router = require('express').Router();
const { User } = require('../../models');
const { Product, Category, Tag, ProductTag } = require('../../Models');

// get all products
router.get('/', (req, res) => {
    Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        include: [
            {
                model: Category,
                attributes: ['id', 'category_id']

            },
            {
                model: Tag,
                attributes: ['id', 'tag_name']

            }
        ]
    })
        .then(dbProductData => res.json(dbProductData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// find a single product by its `id`
router.get('/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'product_name'],
        include: [
            {
                model: Category,
                attributes: ['id', 'category_id']

            },
            {
                model: Tag,
                attributes: ['id', 'tag_name']
            }

        ]
    })
        .then(dbProductData => {
            if (!dbProductData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbProductData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create new product

router.post('/', (req, res) => {

    Product.create(req.body)
        .then((Product) => {
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    return {
                        product_id: Product.id,
                        tag_id,
                    };
                });
                return ProductTag.bulkCreate(productTagIdArr);
            }


            // product_name: req.body.product_name,
            // email: req.body.email,
            // password: req.body.password

            res.status(200).json(product);
        })
        .then((productTagIds) => res.status(200).json(productTagIds))
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        // .then(dbProductData => res.json(dbProductData))
        .catch((err => {
            console.log(err);
            res.status(500).json(err);
        })
        );


    // update product data
    router.put('/:id', (req, res) => {
        // pass in req.body instead to only update what's passed through
        Product.update(req.body, {
            where: {
                id: req.params.id
            }
        })
            .then((product) => {
                return ProductTag.findAll({ where: { product_id: req.params.id } });
            })
            .then((productTag) => {
                const productTagIds = productTags.map(({ tag_id }) => tag_id);
                const newProductTags = req.body.tagIds
                    .filter((tag_id) => !productTagIds.includes(tag_id))
                    .map((tag_id) => {
                        return {
                            product_id: req.params.id,
                            tag_id,
                        };
                    });
                const productTagsToRemove = productTags
                    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                    .map(({ id }) => id);

                return Promise.all([
                    ProductTag.destroy({ where: { id: productTagsToRemove } }),
                    ProductTag.bulkCreate(newProductTags),
                ]);
            })
        // .then(dbProductData => {
        //     if (!dbProductData[0]) {
        //         res.status(404).json({ message: 'No product found with this id' });
        //         return;
        //     }
        //     res.json(dbCategoryData);
    })
        .then((updatedProductTags) => res.json(updatedProductTags))
        .catch((err) => {
            // console.log(err);
            res.status(400).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Product.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbProductData => {
            if (!dbProductData) {
                res.status(404).json({ message: 'No problem found with this id' });
                return;
            }
            res.json(dbProductData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
