// vite.config.js
import { defineConfig, loadEnv } from "file:///mnt/veracrypt1/files/projects/it/webdev/projects/bothniabladet/client/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/veracrypt1/files/projects/it/webdev/projects/bothniabladet/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import basicSsl from "file:///mnt/veracrypt1/files/projects/it/webdev/projects/bothniabladet/client/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      port: 3e3
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L3ZlcmFjcnlwdDEvZmlsZXMvcHJvamVjdHMvaXQvd2ViZGV2L3Byb2plY3RzL2JvdGhuaWFibGFkZXQvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L3ZlcmFjcnlwdDEvZmlsZXMvcHJvamVjdHMvaXQvd2ViZGV2L3Byb2plY3RzL2JvdGhuaWFibGFkZXQvY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvdmVyYWNyeXB0MS9maWxlcy9wcm9qZWN0cy9pdC93ZWJkZXYvcHJvamVjdHMvYm90aG5pYWJsYWRldC9jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgYmFzaWNTc2wgZnJvbSAnQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcblx0Y29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcblxuXHRyZXR1cm4ge1xuXHRcdHBsdWdpbnM6IFtyZWFjdCgpXSxcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdHBvcnQ6IDMwMDAsXG5cdFx0fSxcblx0fTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvWSxTQUFTLGNBQWMsZUFBZTtBQUMxYSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxjQUFjO0FBR3JCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3pDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTztBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFFBQVE7QUFBQSxNQUNQLE1BQU07QUFBQSxJQUNQO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
