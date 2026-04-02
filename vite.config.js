import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	return {
		plugins: [react()],
		server: {
			port: 5000,
			proxy: {
				'/api': {
					target: env.VITE_API_URL || 'https://chatbot-1elq.onrender.com',
					changeOrigin: true,
				},
			},
		},
	}
})
