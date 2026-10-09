import db from "./db.js";

const getAllProjects = async () => {
    try {
      const query = `
        SELECT org.name,
            prj.p_title,
            prj.p_description,
            prj.p_location,
            prj.p_date
	FROM organizations org
	INNER JOIN projects prj ON org.organization_id = prj.organization_id;
    `;

  const result = await db.query(query);

  return result.rows;
    } catch (error) {
        console.log('Error en project.js:', error.message);
        throw error;
  }
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          p_title AS title,
          p_description AS description,
          p_location AS location,
          p_date AS date
        FROM projects
        WHERE organization_id = $1
        ORDER BY p_date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (number_of_projects = 5) => {
  const query = `
    SELECT
      prj.project_id,
      prj.p_title,
      prj.p_description,
      prj.p_date,
      prj.p_location,
      prj.organization_id,
      org.name
    FROM projects prj
    INNER JOIN organizations org
      ON org.organization_id = prj.organization_id
    WHERE prj.p_date >= CURRENT_DATE
    ORDER BY prj.p_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT
  prj.project_id,
  prj.organization_id,
  prj.p_title AS title,
  prj.p_description AS description,
  prj.p_location AS location,
  prj.p_date AS date,
  org.name AS organization_name
FROM projects prj
INNER JOIN organizations org
  ON org.organization_id = prj.organization_id
WHERE prj.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO projects (p_title, p_description, p_location, p_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  project_id,
  organizationId,
  p_title,
  p_description,
  p_location,
  p_date
) => {
  const query = `
    UPDATE projects
    SET p_title = $1,
    p_description = $2,
    p_location = $3,
    p_date = $4,
    organization_id = $5

    WHERE project_id = $6
    RETURNING project_id`;

  const queryParams = [
    p_title,
    p_description,
    p_location,
    p_date,
    organizationId,
    project_id
  ];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Project not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated project with ID:", project_id);
  }

  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
};
