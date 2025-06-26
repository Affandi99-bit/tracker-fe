import React from 'react';
import { utils, writeFile } from 'xlsx';

export const exportReportToXLSX = (projectData, fileName = 'Project_Report') => {
    const wb = utils.book_new();

    const ws = utils.json_to_sheet(formatProjectData(projectData));

    utils.book_append_sheet(wb, ws, 'Report');

    writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const formatProjectData = (project) => {
    const rows = [];

    project.day.forEach((day, dayIndex) => {
        rows.push({
            Type: 'Day Header',
            Day: dayIndex + 1,
            Date: day.date,
            'Total Expenses': day.totalExpenses,
            Note: day.note
        });

        day.crew.forEach((member) => {
            rows.push({
                Type: 'Crew',
                Name: member.name,
                Roles: member.roles.join(', '),
                Date: day.date
            });
        });

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
