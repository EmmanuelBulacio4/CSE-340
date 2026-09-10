import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

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
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = "Our Partner Organizations";
    res.render("organizations", { title, organizations });
});

app.get("/projects", async (req, res) => {
    const projects = await getAllProjects();
    console.log(projects);

    const title = 'Service Projects';
    res.render("projects", { title, projects });
});


app.get("/categories", async (req, res) => {
    const categories = await getAllCategories();
    console.log(categories);
    
    const title = 'Categories';
    res.render('categories', {title, categories});
});


//Start up the server.
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});
