import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { store } from './app/store'
import AuthPage from './features/auth/AuthPage'
import './index.css'
import AdminPage from './pages/AdminPage'
import ChatPage from './pages/ChatPage'

function AppRoutes() {
	const { token } = useSelector(s => s.auth)
	return (
		<Routes>
			<Route path='/' element={token ? <ChatPage /> : <AuthPage />} />
			<Route
				path='/admin'
				element={token ? <AdminPage /> : <Navigate to='/' replace />}
			/>
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	)
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
)
