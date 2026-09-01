import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public"))); //Permite que desde el navegador se vea lo que hay en la carpeta "public"

//RUOTES
// app.get("/", (req, res) => {
//     res.send("Hello from Express!");
// });
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/home.html"));
});
app.get("/organizations", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/organizations.html"));
});
app.get("/projects", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/projects.html"));
});

//Este codigo de abajo solo muestra en consola el link y el environment
app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
