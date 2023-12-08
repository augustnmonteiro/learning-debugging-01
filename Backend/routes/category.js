const express = require('express');
const router = express.Router();

router.post('/insert', (req, res) => {
    const name = req.body.name;

    if (name) {
        const checkIfExistsQuery = `SELECT COUNT(*) as count FROM category WHERE name = ?`;
        
        req.connection.query(checkIfExistsQuery, [name], (error, results) => {
            if (error) {
                res.status(500).send("Internal Server Error");
            } else {
                const categoryCount = results[0].count;
                
                if (categoryCount > 0) {
                    res.status(409).send("Category already exists");
                } else {
                    const insertQuery = `INSERT INTO category (name) VALUES (?)`;
                    
                    req.connection.query(insertQuery, [name], (error, result) => {
                        if (error) {
                            res.status(500).send("Internal Server Error\n" + error);
                            return;
                        } else {
                            res.status(200).send("Category Created Successfully");
                            return;
                        }
                    });
                }
            }
            
        });
    } else {
        res.status(400).send("Bad Request");
    }
})

router.get('/:id', (req, res) => {
    const categoryId = req.params.id;

    if (!Number.isInteger(Number(categoryId))) {
        res.status(400).send("Bad Request: Invalid category ID");
        return;
    }
    const query = `SELECT * FROM category WHERE id = ?`;
    req.connection.query(query, [categoryId], (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return; 
        }
        if (result.length > 0) {
            res.status(200).send(result);
            return;
        } else {
            res.status(404).send("Not Found: Category not found");
            return; 
        }
    });
});


router.get('/', (req, res) => {
    let query = `SELECT * FROM category`;
    req.connection.query(query, (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error.\n" + error);
            return;
        }
        
        res.status(200).send(result);

    });
})

router.put('/update/:id', (req, res) => {
    const categoryID = req.params.id;
    const categoryName = req.body.name;

    if (!Number.isInteger(Number(categoryID))) {
        res.status(400).send("Invalid category ID");
        return; 
    }

    const checkIfExistsQuery = `SELECT * FROM category WHERE id = ?`;
    req.connection.query(checkIfExistsQuery, [categoryID], (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return; 
        }

        if (result.length === 0) {
            res.status(404).send("Category not found");
            return;
        }

        const updateQuery = `UPDATE category SET name = ?, updated_at = NOW() WHERE id = ?`;
        req.connection.query(updateQuery, [categoryName, categoryID], (error, result) => {
            if (error) {
                res.status(500).send("Internal Server Error\n" + error);
                return; 
            } else {
                res.status(200).send("Category Updated Successfully");
                return; 
            }
        });
    });
});

router.delete('/remove/:id', (req, res) => {
    const categoryId = req.params.id;

    if (!Number.isInteger(Number(categoryId))) {
        res.status(400).send("Bad Request: Invalid category ID");
        return; 
    }

    const checkIfExistsQuery = `SELECT * FROM category WHERE id = ?`;

    req.connection.query(checkIfExistsQuery, [categoryId], (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return; 
        }

        if (result.length === 0) {
            res.status(404).send("Not Found: Category not found");
            return; 
        }

        const deleteQuery = `DELETE FROM category WHERE id = ?`;

        req.connection.query(deleteQuery, [categoryId], (error, result) => {
            if (error) {
                res.status(500).send("Internal Server Error");
                return;
            } else {
                res.status(200).send("Category Deleted Successfully");
                return; 
            }
        });
    });
});

module.exports = router;