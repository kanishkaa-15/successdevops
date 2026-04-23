try {
    console.log('Testing requires...');
    require('./models/Grade');
    require('./models/Attendance');
    require('./models/Admission');
    require('./services/reportService');
    const { jsPDF } = require('jspdf');
    console.log('All modules required successfully');
} catch (e) {
    console.error('Module load error:', e);
}
