const router = require("express").Router();

const {  Category, Product } = require("../../Models");


router.get('/', (req, res) => {
    // find all categories
    Category.findAll({
   
        include: {
        
                model: Product,
                attributes: ["id", "product_name", "price", "stock", "category_id"],

            
        }
    })
        .then(dbCategoryData => res.json(dbCategoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.get("/:id", (req, res) => {
    // find one categories
    Category.findOne({
        
        where: {
            id: req.params.id
        },
        
        include: {
            
                model: Product,
                attributes: ["id", "product_name", "price", "stock", "category_id"],
            }
    
    })
        .then(dbCategoryData => {
            if (!dbCategoryData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbCategoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post("/", (req, res) => {
    // create a new category
    Category.create({
        category_name: req.body.category_name
       
    })
        .then(dbCategoryData => res.json(dbCategoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update a category by its `id` value
router.put("/:id", (req, res) => {
    Category.update(req.body, {
        category_name: req.body.category_name,
        where: {
            id: req.params.id
        }
    })
        .then(dbCategoryData => {
            if (!dbcategoryData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbCategoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete a category by its ID value
router.delete("/:id", (req, res) => {
    Category.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCategoryData => {
            if (!dbCategoryData) {
                res.status(404).json({ message: "No user found with this id" });
                return;
            }
            res.json(dbCategoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
