import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";

import { testErrorPage } from './controllers/errors.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";

import {
  showProjectDetailsPage,
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
} from "./controllers/projects.js";

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);
router.get("/new-project", showNewProjectForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);


export default router;