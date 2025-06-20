import React from 'react';
import { utils, writeFile } from 'xlsx';

export const exportReportToXLSX = (projectData, fileName = 'Project_Report') => {
    // Create a new workbook
    const wb = utils.book_new();

    // Convert project data to worksheet
    const ws = utils.json_to_sheet(formatProjectData(projectData));

    // Add worksheet to workbook
    utils.book_append_sheet(wb, ws, 'Report');

    // Write file
    writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Format project data into a flat structure for Excel
const formatProjectData = (project) => {
    const rows = [];

    project.day.forEach((day, dayIndex) => {
        // Add day header
        rows.push({
            Type: 'Day Header',
            Day: dayIndex + 1,
            Date: day.date,
            'Total Expenses': day.totalExpenses,
            Note: day.note
        });

        // Add crew details
        day.crew.forEach((member) => {
            rows.push({
                Type: 'Crew',
                Name: member.name,
                Roles: member.roles.join(', '),
                Date: day.date
            });
        });

        // Add expenses
        ['rent', 'operational', 'orderlist'].forEach((expenseType) => {
            if (day.expense[expenseType]) {
                day.expense[expenseType].forEach((expense) => {
                    rows.push({
                        Type: 'Expense',
                        Category: expenseType.toUpperCase(),
                        Item: expense.name,
                        Price: expense.price || 0,
                        Quantity: expense.qty || 0,
                        Total: (expense.price || 0) * (expense.qty || 1),
                        Notes: expense.note || '',
                        Date: day.date
                    });
                });
            }
        });

        // Add backup records
        day.backup.forEach((backup) => {
            rows.push({
                Type: 'Backup',
                Source: backup.source,
                Target: backup.target,
                Date: day.date
            });
        });
    });

    return rows;
};
