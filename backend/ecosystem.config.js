module.exports = {
  apps: [{
    name: 'wms-backend',
    script: 'dist/src/main.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/dev/null',
    out_file: '/dev/null',
    log_file: '/dev/null',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};