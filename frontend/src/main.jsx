import { createRoot } from 'react-dom/client'
import "stream-chat-react/dist/css/index.css";
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDom from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const savedTheme = localStorage.getItem('theme-storage')

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>

)
