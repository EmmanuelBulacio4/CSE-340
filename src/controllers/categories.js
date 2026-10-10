import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
    createCategory,
  updateCategory
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";
import { body, validationResult } from "express-validator";

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  console.log(categories);

  const title = "Categories";
  res.render("categories", { title, categories });
};

const showCategoryPage = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);
  const title = "Category Details";

  res.render("category", { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);

  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
  const title = "New Category";

  res.render("new-category", { title, errors: [], formData: {} });
};

const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("new-category", {
      title: "New Category",
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { name } = req.body;

  try {
    const categoryId = await createCategory(name);

    req.flash("success", "Category created successfully.");
    return res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash("error", "There was an error creating the category.");
    return res.redirect("/new-category");
  }
};

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters."),
];

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryById(categoryId);

  const title = "Edit Category";
  res.render("edit-category", { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect("/edit-category/" + req.params.id);
  }

  await updateCategory(name, categoryId);

  req.flash("success", "Category updated successfully!");
  res.redirect(`/category/${categoryId}`);
};

export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  categoryValidation,
  showEditCategoryForm,
  processEditCategoryForm,
};
