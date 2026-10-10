import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";

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

  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
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

export {
  showCategoriesPage,
  showCategoryPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
};
