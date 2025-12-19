# Google Drive "Anyone with the link" Auditor

Audit a specific Google Drive folder (with all nested subfolders) and list all files
shared as **"Anyone with the link"**, into a Google Sheets report.

## What it does

- Scans a given Drive folder recursively (including all subfolders).
- Detects files with `ANYONE_WITH_LINK` sharing access.
- Writes a report to a new Google Spreadsheet:
  - Name
  - File ID
  - URL
  - Owner email
  - Path (folder tree)
  - Sharing access
  - Sharing permission (view / comment / edit)

## Installation

1. Create a new Apps Script project (standalone).
2. Enable the **Drive API / Drive service** for the project.  
3. Create a file `Code.gs` and paste the script from this repo.
4. Replace `INSERT_ROOT_FOLDER_ID_HERE` with your folder ID
   (the part after `folders/` in the Drive URL).
5. Save the project.

## Usage

1. From the Apps Script editor, run the function `listAnyoneWithLinkInFolderTree()`.
2. Grant required permissions (read-only access to Drive and create spreadsheets).
3. After execution:
   - Open **Executions / Logs** to see the scan progress.
   - Follow the `Report spreadsheet` URL in the logs.
4. Review the `anyone_with_link` sheet and fix sharing settings if needed.

## Notes

- The script only **reads** Drive metadata and creates a Spreadsheet.
  It does **not modify** any permissions.
- Designed for personal and small-team security audits.
- You can fork and extend it with:
  - additional filters (e.g. by MIME type),
  - alerts (email / chat webhooks),
  - more detailed permission export.
