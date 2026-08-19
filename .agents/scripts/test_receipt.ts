import { generateReceiptPdfBuffer } from '../../lib/receiptPdfService';
import { generateReceiptHtml } from '../../lib/googleDriveService';

async function testReceiptGeneration() {
  const sampleOrder = {
    orderNumber: 'DR-789234',
    fullName: 'יוסי כהן',
    email: 'yossi@example.com',
    phone: '054-1234567',
    deliveryAddress: 'דיזנגוף 120, תל אביב',
    items: [
      {
        itemName: 'אספרסו כפול ירגשף',
        quantity: 2,
        pricePerUnit: 16.0,
        shots: 2,
        milkType: 'חלב שיבולת שועל',
        origin: 'אתיופיה ירגשף',
      },
      {
        itemName: 'פולי קפה קולומביה גיישה 250 גרם',
        quantity: 1,
        pricePerUnit: 68.0,
        origin: 'קולומביה הווילה',
      },
    ],
    totalPrice: 100.0,
    createdAt: new Date().toISOString(),
    paymentMethod: 'כרטיס אשראי מאובטח (SSL 256-bit)',
    status: 'COMPLETED',
  };

  console.log('--- Testing generateReceiptHtml ---');
  const html = generateReceiptHtml(sampleOrder);
  console.log('HTML Length:', html.length);
  if (!html.includes('THE DIGITAL ROAST') || !html.includes('DR-789234')) {
    throw new Error('HTML validation failed!');
  }
  console.log('✅ HTML Receipt generation succeeded!');

  console.log('--- Testing generateReceiptPdfBuffer ---');
  const pdfBytes = await generateReceiptPdfBuffer(sampleOrder);
  console.log('PDF Buffer Length (bytes):', pdfBytes.length);
  if (pdfBytes.length < 1000) {
    throw new Error('PDF Buffer is suspiciously small!');
  }
  console.log('✅ PDF Receipt generation succeeded! Valid PDF bytes generated.');
}

testReceiptGeneration().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
