import React, { lazy, Suspense } from 'react'
import {  BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import { getToken, history } from '@src/lib/helpers/utility'
import Loader from '@src/components/common/Loader'
import ErrorBoundary from '@src/layout/ErrorBoundary'
const AdminLayout = lazy(() => import('@src/layout/AdminLayout'))
const Login = lazy(() => import('@src/views/Login'))
const Dashboard = lazy(() => import('@src/views/Dashboard'))
const User = lazy(() => import('@src/views/User'))
const Category = lazy(() => import('@src/views/Category'))
const Product = lazy(() => import('@src/views/Product'))
const Banner = lazy(() => import('@src/views/Banner'))
const Order = lazy(() => import('@src/views/Order'))
const Privacy = lazy(() => import('@src/views/Privacy'))
const Terms = lazy(() => import('@src/views/Terms'))
const NotFound = lazy(() => import('@src/views/NotFound'))

const ProtectedRoute = ({ children }) => {
    history.navigate = useNavigate();
    const token = getToken()
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
}

const App = () => (
    <ErrorBoundary>
        <Suspense fallback={<Loader />}>
            <Router>
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route element={<AdminLayout />}>
                        <Route exact path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route exact path="/users" element={<ProtectedRoute><User /></ProtectedRoute>} />
                        <Route exact path="/categories" element={<ProtectedRoute><Category /></ProtectedRoute>} />
                        <Route exact path="/products" element={<ProtectedRoute><Product /></ProtectedRoute>} />
                        <Route exact path="/banners" element={<ProtectedRoute><Banner /></ProtectedRoute>} />
                        <Route exact path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                        <Route exact path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
                        <Route exact path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </Suspense>
    </ErrorBoundary>
)

export default App;
 