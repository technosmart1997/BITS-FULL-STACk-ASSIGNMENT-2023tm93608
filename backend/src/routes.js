export const ROUTES = [
  {
    url: "/auth",
    auth: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: "http://localhost:3001/auth",
      changeOrigin: false,
    },
  },
  {
    url: "/book",
    auth: true,
    proxy: {
      target: "http://localhost:3002/book",
      changeOrigin: false,
      on: {
        proxyReq: (proxyReq, req, res) => {
          /* handle proxyReq */
          if (req.user) {
            proxyReq.setHeader("x-user-data", JSON.stringify(req.user));
          }
        },
      },
    },
  },
];
