import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import {
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};

const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";

  res.render("new-organization", { title, errors: [], formData: {} });
};

const processNewOrganizationForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("new-organization", {
      title: "Add New Organization",
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  req.flash("success", "Organization added successfully!");
  res.redirect(`/organization/${organizationId}`);
};

const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

const showEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);

  const title = "Edit Organization";
  res.render("edit-organization", { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const { name, description, contactEmail, logoFilename } = req.body;

  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect("/edit-organization/" + req.params.id);
  }

  await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

  req.flash('success', 'Organization updated successfully!');
  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
};