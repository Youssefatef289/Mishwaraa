const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

// Move files to their new domains
const moves = [
  // Auth
  ['src/components/AuthModal.tsx', 'src/features/auth/AuthModal.tsx'],
  // Booking
  ['src/components/CheckoutScreen.tsx', 'src/features/booking/CheckoutScreen.tsx'],
  ['src/components/ConfirmationScreen.tsx', 'src/features/booking/ConfirmationScreen.tsx'],
  ['src/components/MyBookingsScreen.tsx', 'src/features/booking/MyBookingsScreen.tsx'],
  ['src/components/BookingChat.tsx', 'src/features/booking/BookingChat.tsx'],
  // Dealer
  ['src/components/DealerDashboardScreen.tsx', 'src/features/dealer/DealerDashboardScreen.tsx'],
  ['src/components/AddCarModal.tsx', 'src/features/dealer/AddCarModal.tsx'],
  ['src/components/SettlementsModal.tsx', 'src/features/dealer/SettlementsModal.tsx'],
  ['src/components/RegisterDealerModal.tsx', 'src/features/dealer/RegisterDealerModal.tsx'],
  // Home
  ['src/components/HomeScreen.tsx', 'src/features/home/HomeScreen.tsx'],
  // Admin
  ['src/components/AdminScreen.tsx', 'src/features/admin/AdminScreen.tsx'],
  // Chat
  ['src/components/SupportChat.tsx', 'src/features/chat/SupportChat.tsx'],
  ['src/components/ChatThread.tsx', 'src/features/chat/ChatThread.tsx'],
  // Shared Components
  ['src/components/Header.tsx', 'src/shared/components/Header.tsx'],
  ['src/components/Footer.tsx', 'src/shared/components/Footer.tsx'],
  ['src/components/MobileBottomNav.tsx', 'src/shared/components/MobileBottomNav.tsx'],
  ['src/components/EgyptianPlateBadge.tsx', 'src/shared/components/EgyptianPlateBadge.tsx'],
  ['src/components/HighwayDivider.tsx', 'src/shared/components/HighwayDivider.tsx'],
  // Shared Lib
  ['src/lib/supabase.ts', 'src/shared/lib/supabase.ts'],
  ['src/lib/integration.ts', 'src/shared/lib/integration.ts'],
  ['src/lib/chat.ts', 'src/shared/lib/chat.ts'],
  // Shared Data & Types
  ['src/data/mockData.ts', 'src/shared/data/mockData.ts'],
  ['src/types.ts', 'src/shared/types/index.ts']
];

for (const [oldPath, newPath] of moves) {
  const file = project.getSourceFile(oldPath);
  if (file) {
    const dir = path.dirname(newPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    file.moveToDirectory(dir);
    
    // Also rename the file if the name changed (like types.ts -> index.ts)
    const baseName = path.basename(newPath);
    if (file.getBaseName() !== baseName) {
      file.rename(baseName);
    }
  } else {
    console.log("Could not find", oldPath);
  }
}

// Update App.tsx imports that were lost
const appFile = project.getSourceFile('src/App.tsx');
if (appFile) {
  // Add missing imports
  appFile.addImportDeclaration({
    moduleSpecifier: './features/admin/AdminScreen',
    namedImports: ['AdminScreen']
  });
  
  const profileInterface = `import { Profile } from './shared/types';`;
  appFile.addImportDeclaration({
    moduleSpecifier: './shared/types',
    namedImports: ['Profile']
  });

  // Since we'll patch the actual code later using string replacement or ts-morph, we just save here.
}

project.saveSync();
console.log("Refactoring complete");
