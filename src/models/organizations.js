import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id,
        name,
        description,
        contact_email,
        logo_filename
        FROM organizations;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getOrganizationDetails = async (organizationId) => {
  const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organizations 
      WHERE organization_id = $1;
    `;
    // en el FROM se puso "organizations" en plural porque es el nombre de la tabla en la Base de datos

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  // Return the first row of the result set, or null if no rows are found
  return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllOrganizations, getOrganizationDetails };
