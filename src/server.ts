import "dotenv/config";
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/users", (req, res) => {
    res.json([
        { id: 1, name: "Aram" },
        { id: 2, name: "Anna" }
    ]);
});