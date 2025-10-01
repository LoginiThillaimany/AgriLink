export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      };
      
      console.log(`📡 ${log.method} ${log.url} - ${log.status} - ${log.duration}`);
    });
    
    next();
  };