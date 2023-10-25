"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers/Auth"
import { useEffect, useState } from "react";

/**
 * Support client-side conditional redirecting based on the user's
 * authenticated state.
 *
 * @param WrappedComponent The component that this functionality
 * will be added to.
 * @param LoadingComponent The component that will be rendered while
 * the auth state is loading.
 * @param expectedAuth Whether the user should be authenticated for
 * the component to be rendered.
 * @param location The location to redirect to.
 */
export default function withAuthRedirect({ WrappedComponent, expectedAuth }) {
  function WithAuthRedirectWrapper(props) {
    const router = useRouter()
    const { isLoading, isAuthenticated } = useAuth();
    const [isLoadPage, setIsLoadPage] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setIsLoadPage(true);
      }, 2000);
    }, [])

    if (isLoading) {
      // eslint-disable-next-line react/jsx-filename-extension
      return <></>
    }

    if (isLoadPage) {
      if (typeof window !== "undefined" && expectedAuth !== isAuthenticated) {
        router.push("/auth/login")
      }
    }
    return <WrappedComponent {...props} />
  }
  return WithAuthRedirectWrapper
}