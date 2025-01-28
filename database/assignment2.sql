SELECT * FROM public.account
ORDER BY account_id ASC;         -- to see

INSERT INTO public.account       -- part one
(
 account_firstname,
 account_lastname,
 account_email,
 account_password
)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account              -- part two
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

DELETE FROM public.account         -- part three
WHERE account_email = 'tony@starkent.com';
-- i was going to use id to delete but the id number keeps growing

SELECT * FROM public. inventory
ORDER BY inv_id ASC; -- to see

UPDATE public.inventory -- part fore
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors')
WHERE inv_id = 10;

SELECT inv_make, inv_model, classification_name -- part five
FROM public.inventory AS i
JOIN public.classification AS c ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

UPDATE public.inventory -- part 6
SET 
inv_image = REPLACE(inv_image,'/images','/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail,'/images','/images/vehicles');