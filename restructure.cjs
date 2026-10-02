const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const structure = {
  'core': ['App.tsx', 'main.tsx', 'index.css', 'types.ts'],
  'shared': ['Header.tsx', 'Footer.tsx', 'MobileBottomNav.tsx', 'EgyptianPlateBadge.tsx', 'HighwayDivider.tsx', 'ChatThread.tsx'],
  'features/auth': ['AuthModal.tsx'],
  'features/home': ['HomeScreen.tsx'],
  'features/booking': ['CheckoutScreen.tsx', 'ConfirmationScreen.tsx', 'MyBookingsScreen.tsx', 'BookingChat.tsx'],
  'features/dealer': ['DealerDashboardScreen.tsx', 'AddCarModal.tsx', 'SettlementsModal.tsx', 'RegisterDealerModal.tsx'],
  'features/admin': ['AdminScreen.tsx', 'SupportChat.tsx'],
  'lib': ['supabase.ts', 'integration.ts', 'chat.ts'],
  'data': ['mockData.ts']
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

for (const [folder, files] of Object.entries(structure)) {
  ensureDir(path.join(srcDir, folder));
}

// Find existing location of a file
function findFile(name, dir = srcDir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      const res = findFile(name, full);
      if (res) return res;
    } else if (item === name) {
      return full;
    }
  }
  return null;
}

// Move files
const movedFiles = {};
for (const [folder, files] of Object.entries(structure)) {
  for (const file of files) {
    const currentPath = findFile(file);
    if (currentPath) {
      const newPath = path.join(srcDir, folder, file);
      if (currentPath !== newPath) {
        fs.renameSync(currentPath, newPath);
      }
      movedFiles[file] = newPath;
    }
  }
}

console.log('Moved files:', Object.keys(movedFiles).length);

// Also remove empty directories
const cleanEmptyDirs = (dir) => {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      cleanEmptyDirs(full);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
      }
    }
  }
};
cleanEmptyDirs(srcDir);
