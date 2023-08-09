# Use the official Golang image as the base image
FROM golang:1.20

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files and download the dependencies
COPY go.mod go.sum ./

# Copy the rest of the project files
COPY . .

# Build the Go binary
RUN go build -o main .

# Expose the port that the server listens on
EXPOSE 8080

# Run the Go binary
CMD ["./main"]
