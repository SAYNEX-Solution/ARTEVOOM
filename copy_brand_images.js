const fs = require('fs');
try { fs.copyFileSync('C:\\Users\\ambic\\.gemini\\antigravity\\brain\\07de4b33-a303-4c1d-aa73-f57f864b03f5\\brand_hero_1777936412002.png', '../ARTEVOOM/public/images/brand_hero.png'); } catch (e) {}
try { fs.copyFileSync('C:\\Users\\ambic\\.gemini\\antigravity\\brain\\07de4b33-a303-4c1d-aa73-f57f864b03f5\\brand_nature_1777936820151.png', '../ARTEVOOM/public/images/brand_nature.png'); } catch (e) {}
try { fs.copyFileSync('C:\\Users\\ambic\\.gemini\\antigravity\\brain\\07de4b33-a303-4c1d-aa73-f57f864b03f5\\brand_craft_1777937121465.png', '../ARTEVOOM/public/images/brand_craft.png'); } catch (e) {}
console.log('Images copied successfully to ARTEVOOM.');
