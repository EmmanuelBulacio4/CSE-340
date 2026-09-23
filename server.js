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

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

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

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Este middleware se ejecuta cuando ninguna ruta anterior coincide con la peticion del usuario
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

//Global Error Handler
app.use((err, req, res, next) => {
    console.log('Error occurred: ', err.message);
    console.log('Stack trace: ', err.stack);

    const status = err.status || 500;
    const template = status === 400 ? '404' : '500';

    const context = {
        title: status === 400 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
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
