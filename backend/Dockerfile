# ---- Build Stage ----
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and dependencies separately for caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy all source files
COPY . .

# Build the project and skip tests
RUN mvn clean package -DskipTests

# ---- Runtime Stage ----
FROM eclipse-temurin:21-jdk-jammy

# Set working directory inside container
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
