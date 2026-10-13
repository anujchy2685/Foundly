import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import lostItemRoutes from "./routes/lostItem.js";
import foundItemRoutes from "./routes/foundtem.js";
import { uploadPath } from "./middleware/uploadMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import contentReports from "./routes/contentReports.js";
const app = express();

/* Global Middleware */
// Enable CORS (Allows all origins by default; restrict in production)
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());
// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadPath));
app.use("/api/lost-items", lostItemRoutes); // Mount lost item routes
app.use("/api/found-items", foundItemRoutes); // Mount found item routes
app.use("/api/admin", adminRoutes); // Mount admin routes
app.use("/api/content-reports", contentReports); // Mount content report routes
/* API Routes */
app.use("/", routes);


/* Error Handling (MUST be configured last) */
app.use(notFound); // Catch 404 errors for unmatched routes
app.use(errorHandler); // Global error formatting middleware

export default app;