
## Export static page example
output=export basePath=/cloudphone-app-demo next build

## sync
rsync -av ../cloudfone-starter/out/ ./
