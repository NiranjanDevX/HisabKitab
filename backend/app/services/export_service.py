"""
Data Export Service
"""
import io
import csv
from typing import List
from datetime import datetime
from app.models.expense import Expense

class ExportService:
    def export_expenses_csv(self, expenses: List[Expense]) -> str:
        """Generate CSV string from expenses list"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow([
            "Date", "Description", "Amount", "Category", 
            "Source", "Tags", "Notes"
        ])
        
        # Data
        for expense in expenses:
            writer.writerow([
                expense.date.strftime("%Y-%m-%d"),
                expense.description or "N/A",
                expense.amount,
                expense.category.name if expense.category else "Uncategorized",
                expense.source,
                expense.tags or "",
                expense.notes or ""
            ])
            
        return output.getvalue()

export_service = ExportService()
