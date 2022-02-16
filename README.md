# Neighborhood Reports Deployment branch
This repository contains deployment ready code for the Neighborhood Reports. This branch should not be merged back into other working branches. 

It's different from others in the following ways:
- Non-NR content is set to draft
- The nav bar only contains Home and Neighborhood Reports links
- It includes Google Analytics code
- It contains config files for local, deploy-dev, and deploy configurations
- The internal search is disabled

What this means is:
- To build a version to be served on dev, run `hugo --environment deploy-dev`
- To build a version to be served on production, run `hugo --environment deploy`

Then, the contents of docs can be moved to the staging or production servers. 

If there are any URL issues, check the baseURL or devpath fields in the config files.