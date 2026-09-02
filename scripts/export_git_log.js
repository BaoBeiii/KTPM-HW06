const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const logOutput = execSync(
  'git log --pretty=format:"commit %H%nAuthor: %an <%ae>%nDate:   %ad%n%n    %s%n" --date=format:"%Y-%m-%d %H:%M:%S %z"',
  { encoding: 'utf8' }
);

const targetPath = path.resolve(__dirname, '../git_commit_log.txt');
fs.writeFileSync(targetPath, logOutput, 'utf8');
console.log(`Exported git commit log to: ${targetPath}`);
