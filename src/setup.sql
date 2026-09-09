-- Create tables
CREATE table organizations (
	organization_id SERIAL PRIMARY KEY,
	name varchar(150) NOT NULL,
	description text NOT NULL,
	contact_email varchar(255) NOT NULL,
	logo_filename varchar(255) NOT NULL
);

-- Insert Sample Data
INSERT INTO organizations (name, description, contact_email, logo_filename) 
VALUES 
	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfutureBuilders.org', 'brightfuture-logo.png'),
	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and serveice initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    p_title VARCHAR(100) NOT NULL,
    p_description TEXT NOT NULL,
    p_location VARCHAR(155) NOT NULL,
    p_date DATE NOT NULL
);


INSERT INTO projects (organization_id, p_title, p_description, p_location, p_date) VALUES
-- BrightFuture Builders (Organization ID: 1)
(1, 'Community Center Solar Installation', 'Installing solar panel systems on local community centers to transition toward renewable energy.', '142 Main Street, Sector 4', '2026-04-12'),
(1, 'Public Park Accessibility Ramp Build', 'Constructing wooden wheelchair ramps and accessible pathways in the central public park.', 'Oakwood Park, North District', '2026-05-20'),
(1, 'Youth Shelter Roof Restoration', 'Repairing and waterproofing the damaged roof structure of the downtown youth emergency shelter.', '88 Riverbed Road', '2026-06-15'),
(1, 'Eco-Friendly Bus Stop Shelters', 'Building sustainable, rain-protected bus stops using recycled structural materials.', 'Avenue B & 5th Avenue Intersection', '2026-08-01'),
(1, 'Low-Income Home Insulation Workshop', 'Installing thermal insulation and energy-efficient window seals in low-income housing units.', 'Pine Ridge Housing Complex', '2026-10-10'),

-- GreenHarvest Growers (Organization ID: 2)
(2, 'Rooftop Organic Farm Setup', 'Converting unused residential building rooftops into vibrant hydroponic and soil-based produce gardens.', '500 Skyline Boulevard', '2026-03-28'),
(2, 'Neighborhood Composting Station', 'Setting up community-wide organic waste collection bins and aerobic composting units.', 'Westside Community Garden', '2026-04-18'),
(2, 'Elementary School Greenhouse Build', 'Building a small teaching greenhouse to educate children on sustainable crop cultivation.', 'Lincoln Elementary School', '2026-05-10'),
(2, 'Urban Fruit Orchard Planting', 'Planting 50 native fruit trees along public greenways to provide accessible fresh fruit to residents.', 'Riverside Linear Park', '2026-09-05'),
(2, 'Vertical Herb Garden Workshop', 'Constructing vertical herb walls using wooden pallets for high-density urban living areas.', 'Central Market Plaza', '2026-10-22'),

-- UnityServe Volunteers (Organization ID: 3)
(3, 'Annual Community Food Drive & Pantry Ops', 'Organizing volunteer logistics to collect, sort, and distribute food packages to local families in need.', 'St. Jude Community Hall', '2026-03-15'),
(3, 'Senior Citizen Digital Literacy Workshop', 'Matching volunteers with elderly residents for one-on-one technology and internet navigation training.', 'Golden Years Retirement Home', '2026-04-25'),
(3, 'Coastal Cleanup & Habitat Restoration', 'Mobilizing volunteers to remove marine debris and restore natural dune vegetation along the shoreline.', 'Silver Sand Beach', '2026-06-08'),
(3, 'Back-to-School Backpack Drive', 'Packing and distributing school supply kits for children from low-income households.', 'City Civic Center', '2026-08-18'),
(3, 'Winter Clothing Drive & Shelter Support', 'Collecting, sorting, and delivering heavy coats, blankets, and footwear to winter relief shelters.', 'Downtown Mission Hub', '2026-11-14');


SELECT * FROM projects;

SELECT name, logo_filename, p_title, p_description, p_location, p_date
	FROM organizations org
	INNER JOIN projects prj ON org.organization_id = prj.organization_id;