module.exports = {
    apps : [{
      name: "azsupras.club api", // Choose a descriptive name for your app
      script: "npm", // Path to your main NestJS file (usually in the dist folder after building)
      args: "run start:prod",
      instances: 1, // Number of instances to run (can be 'max' to use all CPU cores)
      autorestart: true, // Automatically restart the app if it crashes
      watch: false, // Disable watch mode in production (you might want it in development)
      max_memory_restart: "2G", // Restart if the app consumes more than 1GB of memory
    }]
  };