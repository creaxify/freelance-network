function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Place", "WhatsApp", "Services & Pricing", "Skills", "Portfolio", "Behance", "LinkedIn", "Instagram"]);
    }
    
    const rowData = [
      new Date(),
      data.name || "",
      data.place || "",
      data.whatsapp || "",
      data.services || "",
      data.skills || "",
      data.portfolio || "",
      data.behance || "",
      data.linkedin || "",
      data.instagram || ""
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getDisplayValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "data": [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Convert 2D array to array of objects
    const headers = data[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
    const rows = data.slice(1);
    const result = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "data": result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
