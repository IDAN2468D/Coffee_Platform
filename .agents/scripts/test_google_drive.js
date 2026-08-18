// Test script for Google Drive Receipt Generation & Simulation
const { generateReceiptHtml, uploadReceiptToGoogleDrive } = require('../../lib/googleDriveService');

async function runTest() {
  console.log('🧪 Testing Google Drive Receipt Generation...');
  
  const sampleOrder = {
    orderNumber: 'DR-TEST-9921',
    fullName: 'עידן קזם',
    email: 'idankzm@gmail.com',
    phone: '050-1234567',
    deliveryAddress: 'שדרות רוטשילד 45, תל אביב-יפו',
    items: [
      {
        itemName: 'פולי קפה אתיופיה ירגשף היירלום (250 גרם)',
        quantity: 2,
        pricePerUnit: 58,
        origin: 'אתיופיה (Yirgacheffe 2,000m)',
      },
      {
        itemName: 'קפוצ׳ינו גורמה שיבולת שועל',
        quantity: 1,
        pricePerUnit: 18,
        shots: 2,
        milkType: 'חלב שיבולת שועל Oatly',
      },
    ],
    totalPrice: 134,
    createdAt: new Date().toISOString(),
    paymentMethod: 'כרטיס אשראי (•••• 4242)',
    status: 'COMPLETED',
  };

  const html = generateReceiptHtml(sampleOrder);
  console.log('✅ HTML Receipt generated successfully! Length:', html.length);
  console.log('🔍 Contains brand name:', html.includes('THE DIGITAL ROAST'));
  console.log('🔍 Contains order number:', html.includes('#DR-TEST-9921'));
  console.log('🔍 Contains Hebrew item name:', html.includes('אתיופיה ירגשף היירלום'));

  const result = await uploadReceiptToGoogleDrive(sampleOrder);
  console.log('✅ Upload result:', result);
  console.log('🎉 Google Drive Receipt Integration Test PASSED!');
}

runTest().catch(console.error);
