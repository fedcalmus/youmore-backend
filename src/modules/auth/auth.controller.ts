import { login } from "./auth.service.js";

export async function loginController(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const result = await login(username, password);

        return res.json(result);
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
}