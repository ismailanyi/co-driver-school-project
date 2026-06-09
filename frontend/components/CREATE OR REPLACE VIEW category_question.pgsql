CREATE OR REPLACE VIEW category_question_counts AS
SELECT 
    'theory' AS question_type, 
    category, 
    COUNT(*) as total_questions
FROM theory
GROUP BY category

UNION ALL

SELECT 
    'sign' AS question_type, 
    category, 
    COUNT(*) as total_questions
FROM road_signs
GROUP BY category;
