FROM node:18.16.0
 
USER 0
 
RUN mkdir -p /home/node/whatsapp-socket-handler
WORKDIR /home/node/whatsapp-socket-handler