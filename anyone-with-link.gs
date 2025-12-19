/*************************
 * КОНФИГ
 *************************/
const ROOT_FOLDER_ID = 'INSERT_ROOT_FOLDER_ID_HERE'; // только ID, без всего URL

/*************************
 * ОСНОВНАЯ ФУНКЦИЯ
 *************************/
function listAnyoneWithLinkInFolderTree() {
  const ss = SpreadsheetApp.create('Drive_anyone_with_link_report');
  const sheet = ss.getActiveSheet();
  sheet.setName('anyone_with_link');
  sheet.appendRow(['Name', 'File ID', 'URL', 'OwnerEmail', 'Path', 'SharingAccess', 'Permission']);

  const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
  const startPath = '/' + rootFolder.getName();

  Logger.log('== Start scan: %s (%s) ==', rootFolder.getName(), ROOT_FOLDER_ID);

  let count = 0;
  traverseFolder_(rootFolder, startPath, sheet, () => { count++; });

  Logger.log('== Done. Files with ANYONE_WITH_LINK: %s ==', count);
  Logger.log('Report spreadsheet: %s', ss.getUrl());
}

/*************************
 * РЕКУРСИЯ ПО ПАПКАМ
 *************************/
function traverseFolder_(folder, currentPath, sheet, counterCb) {
  Logger.log('> Folder: %s', currentPath);

  const files = folder.getFiles();
  let localFiles = 0;
  while (files.hasNext()) {
    const file = files.next();
    localFiles++;

    const access = file.getSharingAccess();
    const perm = file.getSharingPermission();

    Logger.log('  - File: %s | access=%s, perm=%s', file.getName(), access, perm);

    if (access === DriveApp.Access.ANYONE_WITH_LINK) {
      const ownerObj = file.getOwner();
      const ownerEmail = ownerObj ? ownerObj.getEmail() : '';

      sheet.appendRow([
        file.getName(),
        file.getId(),
        file.getUrl(),
        ownerEmail,
        currentPath,
        access,
        perm
      ]);
      counterCb();
      Logger.log('    -> ADDED TO REPORT (anyone_with_link)');
    }
  }
  Logger.log('  Files in %s: %s', currentPath, localFiles);

  const subFolders = folder.getFolders();
  let localFolders = 0;
  while (subFolders.hasNext()) {
    const sub = subFolders.next();
    localFolders++;
    const subPath = currentPath + '/' + sub.getName();
    Logger.log('  Go to subfolder: %s', subPath);
    traverseFolder_(sub, subPath, sheet, counterCb);
  }
  Logger.log('  Subfolders in %s: %s', currentPath, localFolders);
}
