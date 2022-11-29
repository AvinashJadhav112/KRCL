INSERT INTO roles(role_id, name)
VALUES (100, 'ADMIN'),
       (101, 'USER')
ON CONFLICT (role_id) DO NOTHING;

INSERT INTO users (email, password)
VALUES ('admin@vervetronics.com', '$2a$10$vIRsdclQ/OSUIrWr82TdIe.QREvpL7pqv3Z2mValfI1kXaTNR4DOG');

INSERT INTO users_roles (user_id, role_id)
VALUES ((SELECT user_id FROM users WHERE email = 'admin@vervetronics.com' LIMIT 1),
        (SELECT role_id FROM roles WHERE name = 'ADMIN' LIMIT 1)),
       ((SELECT user_id FROM users WHERE email = 'admin@vervetronics.com' LIMIT 1),
        (SELECT role_id FROM roles WHERE name = 'USER' LIMIT 1));
