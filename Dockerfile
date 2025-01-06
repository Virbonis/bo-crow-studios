# Build react app
FROM node:14.16.1 as node

RUN mkdir /app

COPY ./client/package.json ./client/yarn.lock /app/
RUN cd /app \
    && yarn install --pure-lockfile

COPY ./client /app

WORKDIR /app 
RUN yarn build

# Build golang app
FROM golang:1.17-alpine as builder

RUN mkdir /build 
ADD . /build/
WORKDIR /build 

# Add ca-certificates
RUN apk --no-cache add ca-certificates
# Timezone data
RUN apk --no-cache add tzdata

# go get and build
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux  go build -ldflags '"-static" -X "main.version=v0.0.1"' -o tsubasa-admin ./main.go

# Final image
FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /build/tsubasa-admin /app/
COPY --from=builder /build/config/config.yaml /app/

# Copy static files
# RUN mkdir -p /app/client/build
COPY --from=node /app/build /app/client/build

# Timezone data
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
ENV TZ=Asia/Hong_Kong


WORKDIR /app
CMD ["./tsubasa-admin", "-v"]
