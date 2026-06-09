DROP VIEW IF EXISTS theory_lessons;
CREATE VIEW theory_lessons AS
SELECT 
    row_number() over (ORDER BY category) AS id,
    category
FROM (
    SELECT DISTINCT category
    FROM theory
) subquery;