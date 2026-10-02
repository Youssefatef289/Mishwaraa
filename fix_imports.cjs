const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const structureMap = {
  'App': '@/src/core/App',
  'main': '@/src/core/main',
  'types': '@/src/core/types',
  'Header': '@/src/shared/Header',
  'Footer': '@/src/shared/Footer',
  'MobileBottomNav': '@/src/shared/MobileBottomNav',
  'EgyptianPlateBadge': '@/src/shared/EgyptianPlateBadge',
  'HighwayDivider': '@/src/shared/HighwayDivider',
  'ChatThread': '@/src/shared/ChatThread',
  'AuthModal': '@/src/features/auth/AuthModal',
  'HomeScreen': '@/src/features/home/HomeScreen',
  'CheckoutScreen': '@/src/features/booking/CheckoutScreen',
  'ConfirmationScreen': '@/src/features/booking/ConfirmationScreen',
  'MyBookingsScreen': '@/src/features/booking/MyBookingsScreen',
  'BookingChat': '@/src/features/booking/BookingChat',
  'DealerDashboardScreen': '@/src/features/dealer/DealerDashboardScreen',
  'AddCarModal': '@/src/features/dealer/AddCarModal',
  'SettlementsModal': '@/src/features/dealer/SettlementsModal',
  'RegisterDealerModal': '@/src/features/dealer/RegisterDealerModal',
  'AdminScreen': '@/src/features/admin/AdminScreen',
  'SupportChat': '@/src/features/admin/SupportChat',
  'supabase': '@/src/lib/supabase',
  'integration': '@/src/lib/integration',
  'chat': '@/src/lib/chat',
  'mockData': '@/src/data/mockData',
};

// Also index.css
const fileMappings = {
  './index.css': '@/src/core/index.css',
  '../index.css': '@/src/core/index.css',
  '../../index.css': '@/src/core/index.css'
};

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      let content = fs.readFileSync(full, 'utf8');
      
      // Replace CSS import
      content = content.replace(/import\s+['"]([^'"]+\.css)['"]/g, (match, p1) => {
        if (p1.endsWith('index.css')) return `import '@/src/core/index.css'`;
        return match;
      });

      // Replace module imports
      content = content.replace(/import\s+([^'"]+)\s+from\s+['"]([^'"]+)['"]/g, (match, p1, p2) => {
        // p2 is the path, e.g. '../types' or './components/Header'
        const baseName = path.basename(p2, path.extname(p2)); // 'Header'
        
        // Exclude external dependencies
        if (!p2.startsWith('.')) return match;
        
        if (structureMap[baseName]) {
          return `import ${p1} from '${structureMap[baseName]}'`;
        }
        return match;
      });
      
      fs.writeFileSync(full, content, 'utf8');
    }
  }
}

processDir(srcDir);
console.log('Imports fixed.');
