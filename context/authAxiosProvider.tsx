import React from "react"
import axios, { AxiosInstance, AxiosError } from "axios"
import { useRouter } from "expo-router"
import { storage } from "../utils/store"
import { useAuth } from "./auth"

interface authAxiosValues {
  authAxios: AxiosInstance
}

const authAxiosConext = React.createContext<null | authAxiosValues>(null)

export const useAuthAxios = () => {
  return React.useContext(authAxiosConext)
}

const useAuthAxiosInstance = (authInstance: AxiosInstance, fn: ()=>void) => {
  const router = useRouter()
  const auth = useAuth()
  React.useEffect(() => {
    authInstance.interceptors.request.use(
      async function (config) {
        config.headers.Authorization = await storage.get("jwt-token")
        return config
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    // 响应拦截器
    authInstance.interceptors.response.use(
      function (response) {
        // 对响应数据做些什么
        // 可以在这里处理响应数据，如统一处理错误信息等
        return response
      },
      function (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 401) {            
            // 跳转到登录页
            auth?.signOut()
          } else {
            // 网络错误
            return Promise.reject(error)
          }
        }

        
      }
    )
    fn()
  }, [])
}

export const AuthAxiosProvider = (props: { children: React.ReactNode }) => {
  const authAxiosInstance = React.useRef(axios.create())
  const [loaded, setLoaded] = React.useState(false)
  // 不知道为什么孩子节点能在配置前就使用上。
  useAuthAxiosInstance(authAxiosInstance.current, () => {setLoaded(true)})
  return (
    <authAxiosConext.Provider
      value={{
        authAxios: authAxiosInstance.current,
      }}
    >
        {loaded && props.children}
    </authAxiosConext.Provider>
  )
}
