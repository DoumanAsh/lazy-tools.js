#!/bin/bash
REPO=`git config remote.origin.url`
SHA=`git log -1 --format="%s(%h %cd)" --date=short`
COMMIT_AUTHOR_EMAIL=`git --no-pager log -1 --pretty=format:"%ae" HEAD`

mkdir out/

git clone $REPO out/

cd out/

git checkout gh-pages || git checkout --orphan gh-pages
rm -rf *
rm -rf .eslintrc.js .travis.yml .gitignore

cp -rf ../public/* .

git status

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
echo "https://${GIT_TOKEN}:x-oauth-basic@github.com\n" > ~/.git-credentials
git config remote.origin.url "https://${GIT_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"

git add --all .
git commit -m "Auto-update" -m "Commit: ${SHA}"
git push origin HEAD
