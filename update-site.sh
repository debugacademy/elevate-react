cd /var/www/html &&
(git init 
git remote remove origin;
git remote add origin https://github.com/debugacademy/drupal-react.git &&
git add ./;
git reset /var/www/html/update-site.sh
git commit -m 'Commit modified files';
git fetch origin &&
git checkout origin/main &&

echo "/*****************************************************/" &&
echo "Now manually run these two commands:"
echo "exit" &&
echo "ddev restore-snapshot drupal_react" &&
echo "/*****************************************************/";
) ||
 (
echo "/***********************************************/"
echo "/***********************************************/"
echo "/***********************************************/"
echo "/* ERROR: Before running this script, you must: */"
echo "/***********************************************/
- cd into drupal-react
- run: ddev ssh
- Then run the script using: bash /var/www/html/update-site.sh";
)
