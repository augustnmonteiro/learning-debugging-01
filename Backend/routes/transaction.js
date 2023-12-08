const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    let query = `
        SELECT transaction.*, category.name AS category_name
        FROM transaction
        LEFT JOIN category ON transaction.category_id = category.id
        WHERE transaction.id=${req.params.id}`;

    if (req.query.showDeleted != "1") {
        query += ' AND transaction.deleted_at IS NULL';
    }

    req.connection.query(query, (error, result) => {
        if (error) {
            res.status(404).send(error);
        } else {
            res.send(result);
        }
    });
});

router.get('/', (req, res) => {
    let query = `
        SELECT transaction.*, category.name AS category_name
        FROM transaction
        LEFT JOIN category ON transaction.category_id = category.id`;

    if (req.query.showDeleted != "1") {
        query += ' WHERE transaction.deleted_at IS NULL';
    }

    req.connection.query(query, (error, result) => {
        if (error) {
            res.status(404).send(error);
        } else {
            res.send(result);
        }
    });
});

router.post('/add', (req, res) => {
    const { description, value, category_id } = req.body;

    let query = 'SELECT * FROM transaction';

    if (req.query.showDeleted != "1") {
        query += ' WHERE transaction.deleted_at IS NULL';
    }
    query += ' ORDER BY created_at DESC LIMIT 1';

    req.connection.query(query, (error, result) => {
        if (error) {
            res.status(500).json({ status: 500, message: "Internal Server Error." });
            return;
        }

        if (result.length === 0) {
            let query = `
                INSERT INTO transaction (description, value, balance, category_id)
                VALUES ('${description}', ${value}, ${value}, ${category_id})`;

            req.connection.query(query, (error, resRegister) => {
                if (error) {
                    res.status(500).json({ status: 500, message: "Internal Server Error." });
                } else {
                    res.status(201).json({ status: 201, message: "Transaction Created Successfully" });
                }
            });
        } else {

            const newBalance = parseFloat(result[0].balance) + parseFloat(value);
            const insertQuery = `
            INSERT INTO transaction (description, value, balance, category_id)
            VALUES ('${description}', ${value}, ${newBalance} ,${category_id});`

            req.connection.query(insertQuery, (error, resRegister) => {
                if (error) {
                    res.status(500).json({ status: 500, message: "Internal Server Error." });
                } else {
                    res.status(201).json({ status: 201, message: "Transaction Created Successfully" });
                }
            });
        }
    });
});

router.get("/historical/paged", (req, res) => {
    const page = req.query.page || 1;
    const itenPerPage = 10;
    const offset = (page - 1) * itenPerPage;
  
    const countQuery = "SELECT COUNT(*) AS total FROM transactions.transaction";
    const selectQuery = `SELECT * FROM transactions.transaction LIMIT ${itenPerPage} OFFSET ${offset}`;
  
    req.connection.query(countQuery, (error, countResults) => {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }
  
        const totalRegister = countResults[0].total;
        const lastPage = Math.ceil(totalRegister / 10);
  
        req.connection.query(selectQuery, (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
                return;
            }
            
            const responseBody = {
                transactions: results,
                totalRegister: totalRegister,
                lastPage: lastPage,
                page: page,
            };
  
            res.setHeader("X-Total-Count", responseBody.totalRegister);
            res.setHeader("X-Total-Pages", responseBody.lastPage);
            res.setHeader("X-Current-Page", responseBody.page);
  
            res.json(responseBody);
        })
    })
  })
  

router.delete('/delete', (req, res) => {
    const userId = parseInt(req.query.id);
    if (isNaN(userId)) {
        res.status(400).send("Bad Request.");
        return;
    }

    req.connection.query('SELECT id FROM transaction WHERE id = ?', [userId], (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error.");
        } else {
            if (result.length === 0) {
                res.status(404).send("Transaction Not Found.");
            } else {
                req.connection.query('UPDATE transaction SET deleted_at = NOW() WHERE id = ?', [userId], (err, results) => {
                    if (err) {
                        res.status(500).send("Internal Server Error.");
                    } else {
                        res.status(200).json({ message: "transaction deleted" });
                    }
                })
            }
        }
    });
});

router.put('/update/:id', (req, res) => {
    const transactionID = req.params.id;
    const categoryID = req.body.categoryID;

    if (!Number.isInteger(Number(transactionID))) {
        res.status(400).send("Invalid Transacion ID");
        return; 
    }

    const checkIfExistsQuery = `SELECT * FROM transaction WHERE id = ?`;
    req.connection.query(checkIfExistsQuery, [transactionID], (error, result) => {
        if (error) {
            res.status(500).send("Internal Server Error");
            return; 
        }

        if (result.length === 0) {
            res.status(404).send("Transaction not found");
            return;
        }

        const updateQuery = `UPDATE transaction SET category_id = ? WHERE id = ?`;
        req.connection.query(updateQuery, [categoryID, transactionID], (error, result) => {
            if (error) {
                res.status(500).send("Internal Server Error\n" + error);
                return; 
            } else {
                res.status(200).send("Transaction Updated Successfully");
                return; 
            }
        });
    });
})
module.exports = router;
