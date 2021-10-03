const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../Models");

// get all products
router.get("/", (req, res) => {
    Product.findAll({
        attributes: ["id", "product_name","price","stock","category_id"],
        

            include: [
                {
                    model: Category,
                    attributes: ["id","category_name"],

                },
                {
                    model: Tag,
                    attributes: ["id", "tag_name"]

                }
            ]
        }
    )
        .then(dbProductData => res.json(dbProductData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// find a single product by its `id`
router.get("/:id", (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        },
      
        include: [
            {
                model: Category,
                attributes: ["id","category_name"],
            },

            {
                model: Tag,
                attributes: ["id","tag_name"],

            }

        ]
    })
        .then(dbProductData => {
            if (!dbProductData) {
                res.status(404).json({ message: "No user found with this id" });
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

router.post("/", (req, res) => {

    Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        tagIds: req.body.tag_id
    })
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

            res.status(200).json(product);
        })
        .then((productTagIds) => res.status(200).json(productTagIds))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
        


    // update product data
    router.put("/:id", (req, res) => {
        // pass in req.body instead to only update what's passed through
        Product.update(req.body, {
            where: {
                id: req.params.id,
            },
        })
            .then((product) => {
                return ProductTag.findAll({ where: { product_id: req.params.id } });
            })
            .then((productTags) => {
                return ProductTag.findAll({ where: { producty_id: req.params.id } });
            })
           
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
       
    
        .then((updatedProductTags) => res.json(updatedProductTags))
        .catch((err) => {
            // console.log(err);
            res.status(400).json(err);
        });
});

router.delete("/:id", (req, res) => {
    Product.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbProductData => {
            if (!dbProductData) {
                rs.status(404).json({ message: "No problem found with this id" });
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
