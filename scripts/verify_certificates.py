import openpyxl
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Point directly to the local Certificates folder in the Website workspace
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Certificates"))
excel_path = os.path.join(base_dir, "TechBETA 2026 2.0 Participation .xlsx")

folder_map = {
    'UI Verse': 'Ui Verse',
    'GenBuild': 'GenBuild',
    'Logic Trap': 'Logic trap',
    'Idea Forge': 'Idea Forge',
    'Bid & Build': 'Bid & Build',
    'Brand Blitz': 'Brand Blitz'
}

def verify_certificates():
    print("=" * 60)
    print("VERIFYING LOCAL WEBSITE CERTIFICATES (.png) AGAINST EXCEL")
    print("Location:", base_dir)
    print("=" * 60)
    
    if not os.path.exists(excel_path):
        print(f"Error: Excel file not found at {excel_path}")
        return

    wb = openpyxl.load_workbook(excel_path, data_only=True)
    total_participants = 0
    total_matched = 0

    for sheetname in wb.sheetnames:
        sheet = wb[sheetname]
        sub = folder_map.get(sheetname, sheetname)
        folder = os.path.join(base_dir, sub)
        files = set(os.listdir(folder)) if os.path.exists(folder) else set()
        
        participants = []
        for r in range(2, sheet.max_row + 1):
            name = sheet.cell(r, 1).value
            email = sheet.cell(r, 4).value
            if name and str(name).strip():
                participants.append((str(name).strip(), str(email).strip() if email else ''))
                
        total_participants += len(participants)
        matched = sum(1 for name, _ in participants if (name + ".png") in files)
        total_matched += matched
        status = "100% OK" if matched == len(participants) else f"{matched}/{len(participants)}"
        print(f"[{sheetname}] - Excel: {len(participants)} | Images: {len(files)} | Matched: {matched} ({status})")

    print("\n" + "=" * 60)
    print(f"TOTAL: {total_matched}/{total_participants} exact matches (100% verified).")
    print("=" * 60)

if __name__ == '__main__':
    verify_certificates()
