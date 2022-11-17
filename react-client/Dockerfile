FROM node:16.14.0

ARG user="node"
ARG appdir="/home/node/app"

RUN mkdir -p ${appdir} && chown -R ${user} ${appdir}
WORKDIR ${appdir}
USER ${user}

COPY --chown=${user} . .

RUN npm install

ENTRYPOINT [ "./entry.sh" ]

CMD [ "npm", "run", "dev" ]