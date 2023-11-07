import catchError from "./error.js";
import { con, makeDb } from "./db.config.js";
const executeQuery = makeDb();

export const addProduct = catchError(async (req, res) => {
    try {
        const { productname, description, price } = req.body;
        if (!productname || !description || !price) {
            res.status(400).json({
                status: false,
                msg: "please fill all the fields."
            })
        }

        const addproductquery = `
        INSERT INTO product(productname, description, price)
        VALUES(?,?,?)
        `;

        const result = await executeQuery.query(addproductquery, [productname, description, price])

        if (result.affectedRows > 0) {
            res.status(201).json({
                msg: true,
                msg: "product added!"
            })
        } else {
            res.status(401).json({
                status: false,
                msg: "Oops some error to add products."
            })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({
            status: false,
            msg: msg.error
        })
    }
})


export const getProduct = catchError(async (req, res) => {
    try {
        const get_product = `
        SELECT * FROM product
        `;

        const result = await executeQuery.query(get_product)

        res.status(201).json({
            status: true,
            msg: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            msg: "Not getting data"
        })
    }
})


export const updateProduct = catchError(async (req, res) => {
    try {
        const { id } = req.params;
        const { productname, description, price } = req.body;

        const updateFields = [];
        const updateValues = [];

        if (productname) {
            updateFields.push('productname = ?');
            updateValues.push(productname);
        }

        if (description) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }

        if (price) {
            updateFields.push('price = ?');
            updateValues.push(price);
        }

        const updateProductQuery = `
            UPDATE product
            SET ${updateFields.join(', ')}
            WHERE id = ?
        `;

        const executeUpdateQuery = await executeQuery.query(updateProductQuery, [...updateValues, id]);

        if (executeUpdateQuery.affectedRows > 0) {
            return res.status(200).json({
                status: true,
                message: "Product updated successfully!",
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Product not found or not updated.",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while updating the product.",
        });
    }
});



export const deleteProduct = catchError(async (req, res) => {
    try {
        const { id } = req.params;

        const checkIdQuery = `
            SELECT * FROM product WHERE id = ?
        `;


        const existingProduct = await executeQuery.query(checkIdQuery, [id]);

        if (existingProduct.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Product not found.",
            });
        }

        const deleteProductQuery = `
            DELETE FROM product WHERE id = ?
        `;

        const result = await executeQuery.query(deleteProductQuery, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: true,
                message: "Product deleted successfully.",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Failed to delete the product.",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred during product deletion.",
        });
    }
});


export const searchQuery=catchError(async(req,res)=>{
    try {
        const {name}=req.query;

        if(!name){
            res.status(400).json({
                status:false,
                msg:"missing parameter"
            })
        }
        const givequery=`SELECT * FROM product where productname LIKE ? OR description LIKE ?`;
        const searchTerm = `%${name}%`;
        const excgivquery=await executeQuery.query(givequery,[searchTerm,searchTerm]);
        res.status(201).json({
            status: true,
            msg: excgivquery
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            status:true,
            msg:"data not found or wrong query!"
        })
    }
})


export const pagenation= catchError(async(req,res)=>{
    const { page, itemsPerPage } = req.query;
    const offset = (page - 1) * itemsPerPage;
  
    try {
      const results = await executeQuery.query(
        `SELECT * FROM product LIMIT ${page} OFFSET ${itemsPerPage}`
      );
  console.log( `SELECT * FROM product LIMIT ${page} OFFSET ${itemsPerPage}`);
    return  res.json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
})