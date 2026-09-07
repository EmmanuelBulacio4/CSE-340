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
