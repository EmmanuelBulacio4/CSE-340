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
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
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
      prj.p_title AS title,
      prj.p_description AS description,
      prj.p_date AS date,
      prj.p_location AS location,
      prj.organization_id,
      org.name AS organization_name
    FROM projects prj
    INNER JOIN organizations org
      ON org.organization_id = prj.organization_id
    WHERE prj.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows.length > 0 ? result.rows[0] : null;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
};
