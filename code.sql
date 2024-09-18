-- Section1
SELECT MAX(salary) AS salary
FROM employees;

-- Section2
SELECT e.salary, e.name AS employee, t.name AS team
FROM employees e
JOIN (
    SELECT team_id, MAX(salary) AS max_salary
    FROM employees
    GROUP BY team_id
) max_salaries
ON e.team_id = max_salaries.team_id AND e.salary = max_salaries.max_salary
JOIN teams t
ON e.team_id = t.id
ORDER BY t.name, e.salary DESC;
