-- Insert department names
INSERT INTO department (name)
VALUES 
('Electrical'),
('Mechanical'),
('Structural'),
('Chemical');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES 
('Electrical Engineer', 114000, 1),
('Mechanical Engineer', 111000, 2),
('Structural Engineer', 120000, 3),
('Chemical Engineer', 117000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id)
VALUES 
('John', 'Doe', 1),  -- John Doe is the Electrical Engineer
('Jane', 'Smith', 2), -- Jane Smith is the Mechanical Engineer
('Michael', 'Johnson', 3), -- Michael Johnson is the Structural Engineer
('Emily', 'Brown', 4); -- Emily Brown is the Chemical Engineer