## README NOW!!
run `npm install`
run `node main.js`

## Dealing with git push rejections
When your branch is behind HEAD and your attempt to push has been rejected you can follow the steps below to resolve the issue.
```
git stash
git pull origin <branch>
git apply
```
After applying the changes you've stashed, you will see that the changes have been merged with what was pulled and allow you to resolve merge issues. After resolving merge conflicts
```
git add <conflict-merge-file>
git commit -m "<message>"
git push origin <branch>
```
### Congratulations, you resolved merge conflicts!
