import React from "react";
import Loading from "../components/custome/loading";

interface loadingProviderValues {
    loading: boolean,
    showLoading: () => void,
    hideLoading: () => void
}

const loadingContext = React.createContext<null | loadingProviderValues>(null)
export function useLoading(){
    return React.useContext(loadingContext)
} 


export const LoadingProvider = (props: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(false)
    return <loadingContext.Provider value={{
        loading: loading,
        showLoading: () => setLoading(true),
        hideLoading: () => setLoading(false)
    }}>
        {props.children}
        {loading && <Loading />}
    </loadingContext.Provider>
}

