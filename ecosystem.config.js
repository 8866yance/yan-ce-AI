module.exports = {
  apps: [
    {
      name: "yan-ce-ai-backend",
      cwd: "/var/www/yan-ce-ai/backend",
      script: "src/server.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4300
      },
      max_memory_restart: "512M",
      time: true,
      out_file: "/var/log/yan-ce-ai/backend.out.log",
      error_file: "/var/log/yan-ce-ai/backend.err.log"
    }
  ]
};
