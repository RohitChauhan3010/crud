import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchError from "./error.js"; 
import { con, makeDb } from "./db.config.js";
const executeQuery = makeDb();

export const Register = catchError(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Required all fields.",
            });
        }

        const checkUserQuery = `
            SELECT * FROM user
            WHERE email = ?
        `;

        const existingUser = await executeQuery.query(checkUserQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({
                status: false,
                message: "User already exists.",
            });
        }

        const hashPassword = bcrypt.hashSync(password, 8);
        console.log(hashPassword);
        // console.log(h);

        const userInsertQuery = `
            INSERT INTO user(name, email, password)
            VALUES(?, ?, ?)
        `;

        const result = await executeQuery.query(userInsertQuery, [name, email, hashPassword]);

        if (result.affectedRows > 0) {

            return res.status(201).json({
                status: true,
                message: "Registration successful.",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Failed to register user.",
            });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred during registration.",
        });
    }
});



export const login = catchError(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Required email and password.",
            });
        }

        const checkUserQuery = `
            SELECT * FROM user
            WHERE email = ?
        `;

        const user = await executeQuery.query(checkUserQuery, [email]);

        if (user.length === 0) {
            return res.status(400).json({
                status: false,
                message: "User not found.",
            });
        }

        const passwordMatch =  bcrypt.compareSync(String(password), user[0].password);

        if (!passwordMatch) {
            return res.status(400).json({
                status: false,
                message: "Incorrect password.",
            });
        }
        // You can generate and send a JWT token for successful login here if needed
        const token= jwt.sign({userId:user[0].id},"sqlsecretkey", {expiresIn :'3h'})
        return res.status(200).json({
            status: true,
            message: "Login successful.",
            user: user[0], // You can send user data if needed
            token
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred during login.",
        });
    }
});





