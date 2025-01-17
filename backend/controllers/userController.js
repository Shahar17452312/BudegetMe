import db from "../config/dbConfig.js"
import bcrypt from "bcrypt";
import verify from "../utils/authHelper.js";

const getUser = async (req, res) => {
    const header = req.headers;
    try {
        const check = verify(header, req.params.id);
        if (check.status !== 200) {
            return res.status(400).json({ message: check.message });
        }

        const { id } = check.payload;

        const data = await db.query("SELECT name,email,date_of_creation FROM users WHERE id=$1", [id]);
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "there is no such user" });
        }
        return res.status(200).json({ ...data.rows[0] });

    }
    catch (error) {
        console.log(error.message);

        if (process.env.NODE_ENV === "development") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({ message: "Error during get user data" });
        }
    }
};


const postUser = async (req, res) => {

    const header = req.headers;

    try {
        const check = verify(header, req.params.id);
        if (check.status !== 200) {
            return res.status(400).json({ message: check.message });
        }
        const { id } = check.payload;
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "missing fields to update user" });
        }
        const hash = await bcrypt.hash(password, 10);

        await db.query("UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4", [name, email, hash, id]);

        return res.status(200).json({ message: "User updated" });

    }
    catch (error) {
        console.log(error.message);

        if (process.env.NODE_ENV === "development") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({ message: "Error during save user data" });
        }
    }


};

const deleteUser = async (req, res) => {
    const header = req.headers;
    try {
        const check = verify(header, req.params.id);
        if (check.status !== 200) {
           return res.status(400).json({ message: check.message });
        }
        const { id } = check.payload;
        await db.query("DELETE FROM users WHERE id=$1", [id]);
        return res.status(200).json({ message: "user " + id + " deleted" });


    }
    catch (error) {
        console.log(error.message);

        if (process.env.NODE_ENV === "development") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({ message: "Error during delete user data" });
        }
    }

};


const patchUser = async (req, res) => {

    const header = req.headers;
    var query = "";
    var pos = 1;
    try {
        const check = verify(header, req.params.id);
        if (check.status !== 200) {
            return res.status(check.status).json({ message: check.message });
        }
        const { id } = check.payload;

        const { name, email, password } = req.body;
        const arrayToUpdate = [];
        if (name) {
            arrayToUpdate.push(name);
            query += "name=$" + pos + ", ";
            pos++;
        }
        if (email) {
            arrayToUpdate.push(email);
            query += "email=$" + pos + ", ";
            pos++;
        }
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            arrayToUpdate.push(hash);
            query += "password=$" + pos + ", ";
            pos++;


        }

        if (arrayToUpdate.length === 0) {
            return res.status(400).json({ message: "There is no data to update" })
        }
        arrayToUpdate.push(id);
        query = query.slice(0, -2);
        await db.query("UPDATE users SET " + query + " WHERE id=$" + pos, arrayToUpdate);
        return res.status(200).json({ message: "User Updated" });




    }
    catch (error) {
        console.log(error.message);

        if (process.env.NODE_ENV === "development") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({ message: "Error during update user data" });
        }
    }


};



export default { getUser, postUser, patchUser, deleteUser };