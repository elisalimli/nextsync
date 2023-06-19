# Use the official Golang image as the base image
FROM golang:1.20

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files and download the dependencies
COPY go.mod go.sum ./

# Downloading the dependencies
RUN go mod tidy

# Copy the rest of the project files
COPY . .

# Generating gqlgen code
RUN go run github.com/99designs/gqlgen generate

# Build the Go binary
RUN go build -o main cmd/server/server.go

# Expose the port that the server listens on
EXPOSE 8080

# Run the Go binary
CMD ["./main"]
