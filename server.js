import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";

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

// Routes. Importo esto del archivo routes.js. Allí es donde controlo las rutas
app.use(router);

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
