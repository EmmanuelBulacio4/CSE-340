import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT name, category_id
        FROM categories;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (category_id) => {
  const query = `
    SELECT
    category_id,
    name
    FROM categories
    WHERE category_id = $1;`;

  const result = await db.query(query, [category_id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM categories c
    INNER JOIN project_categories pc
      ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.p_title AS title,
      p.p_description AS description,
      p.p_location AS location,
      p.p_date AS date
    FROM projects p
    INNER JOIN project_categories pc
      ON pc.project_id = p.project_id
    WHERE pc.category_id = $1
    ORDER BY p.p_date;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2)
    RETURNING project_id;
  `;
  
  const queryParams = [projectId, categoryId];
  await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};


export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  assignCategoryToProject,
  updateCategoryAssignments,
};
