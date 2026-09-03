import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { title } from "process";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//MIDDLEWARES
app.use(express.static(path.join(__dirname, "public"))); //Permite que desde el navegador se vea lo que hay en la carpeta "public"

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

//RUOTES
app.get("/", async (req, res) => {
    const title = 'Home';
    res.render('home', {title});
});
app.get("/organizations", async (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', {title});
});
app.get("/projects", async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', {title});
});
app.get("/categories", async (req, res) => {
    const title = 'Categories';
    res.render('categories', {title});
});

//Este codigo de abajo solo muestra en consola el link y el environment
app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
