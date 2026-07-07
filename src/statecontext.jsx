"use client"
import { createContext, useContext, useEffect, useState, useRef } from "react";
import axiosInstance from "../app/axiosInstance";
import PopupForm from "@/components/Popform";
import { usePathname } from "next/navigation";

const Globalcontext = createContext()

export function GlobalProvider({ children }) {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [allProfile, setallProfile] = useState(null)
    const [authToken, setauthToken] = useState(null)
    const [show, setShow] = useState(true)
    const [update, setupdate] = useState();

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [popupCount, setPopupCount] = useState(0)
    const [hasInteracted, setHasInteracted] = useState(false)

    const [hasSubmittedForm, setHasSubmittedForm] = useState(false)

    const timer1Ref = useRef(null);
    const timer2Ref = useRef(null);
    const hasInitializedTimers = useRef(false);

    const [selectedCountries, setSelectedCountries] = useState([])

    

    const addCountry = (country) => {

        const exists = selectedCountries.find(
            item => item._id === country._id
        )

        if (!exists) {
            setSelectedCountries(prev => [...prev, country])
        }
    }

    const removeCountry = (id) => {
        setSelectedCountries(prev =>
            prev.filter(item => item._id !== id)
        )
    }


    const getProfile = async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            setProfile(res.data.data)
            setallProfile(res.data)
        
        } catch (err) {
            //console.log("Not authorized")
        } finally {
            setLoading(false)
        }
    }


    const updateProfile = async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            setProfile(res.data.data)
            setallProfile(res.data)

        } catch (err) {
            //console.log("Not authorized")
        }
    }

    const Logout = () => {
        setLoading(true)
        window.location.replace("/")
        localStorage.removeItem("token")
        setProfile(null)
        setLoading(false)
    }

    const savePopupCount = (count) => {
        sessionStorage.setItem('popupShownCount', count.toString())
        setPopupCount(count)
    }

    // ✨ MODIFIED: Differentiate between cancel and submit
 const pathname = usePathname();

const showPopup = () => {
  // Don't show popup on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    setIsPopupOpen(false);
    return;
  }
  if (pathname.startsWith("/login")) {
    setIsPopupOpen(false);
    return;
  }

  if (!isPopupOpen && !hasSubmittedForm) {
    //console.log("✅ Opening popup");
    setIsPopupOpen(true);
    savePopupCount(popupCount + 1);
  }
};
    // ✨ NEW: Called when user clicks CANCEL/X button
    const closePopup = (wasSubmitted = false) => {

        setIsPopupOpen(false)

        if (wasSubmitted) {
            // ✨ User submitted form - mark as submitted, no more popups
            setHasSubmittedForm(true)
            sessionStorage.setItem('formSubmitted', 'true')

        } else {
            // ✨ User cancelled - allow second popup, but mark general interaction
            setHasInteracted(true)
            //console.log('❌ Popup cancelled - second popup still possible at 30s')
        }
    }

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axiosInstance.post('/contactus', formData)
            // ✨ On successful submit, close popup with "submitted" flag
            if (response.data.success) {
                closePopup(true) // true = was submitted
            }
            return { success: response.data.success }
        } catch (error) {
            console.error('API Error:', error)
            return { success: false }
        }
    }

    // Helper: Check if we should show popup based on current state
    const checkAndShowPopup = () => {
        // Never show if: popup open, form already submitted, or user heavily interacted
        if (isPopupOpen || hasSubmittedForm) {

            return;
        }

        // First popup: at 15s, only if count is 0 and no interaction
        if (popupCount == 0) {

            showPopup();
            return;
        }
        if (popupCount == 1) {

            showPopup();
            return;
        }

    };

    useEffect(() => {
        if (hasInitializedTimers.current) return;
        hasInitializedTimers.current = true;

        timer1Ref.current = setTimeout(() => {
            checkAndShowPopup();
        }, 15000);

        timer2Ref.current = setTimeout(() => {
            checkAndShowPopup();
        }, 60000);

        return () => {
            if (timer1Ref.current) clearTimeout(timer1Ref.current);
            if (timer2Ref.current) clearTimeout(timer2Ref.current);
        };
    }, []);

    useEffect(() => {
        const submitted = sessionStorage.getItem('formSubmitted') === 'true';
        if (submitted) {
            setHasSubmittedForm(true);
        }
    }, []);

    useEffect(() => {
        const shownCount = sessionStorage.getItem('popupShownCount')
        const lastPopupDate = sessionStorage.getItem('lastPopupDate')
        const currentDate = new Date().toDateString()

        if (lastPopupDate !== currentDate) {
            //console.log('🔄 New day! Resetting all popup states')
            sessionStorage.removeItem('popupShownCount')
            sessionStorage.removeItem('formSubmitted') // ✨ Reset submission flag too
            sessionStorage.setItem('lastPopupDate', currentDate)
            setPopupCount(0)
            setHasInteracted(false)
            setHasSubmittedForm(false) // ✨ Reset submission state
        } else if (shownCount) {
            setPopupCount(parseInt(shownCount))
        } else {
            sessionStorage.setItem('lastPopupDate', currentDate)
            setPopupCount(0)
            setHasInteracted(false)
        }
    }, [])

    // Track user interaction (scroll/click/key) - but don't block if only cancelling popup
    useEffect(() => {
  const handleUserInteraction = (e) => {
    const target = e.target;

    // Safely check if target is an Element
    if (
      target instanceof Element &&
      (
        target.closest(".popup-close-button") ||
        target.closest(".popup-overlay")
      )
    ) {
      return;
    }

    if (!hasInteracted) {
      //console.log("👆 User interacted with page content");
      setHasInteracted(true);
    }
  };

  window.addEventListener("click", handleUserInteraction);
  window.addEventListener("scroll", handleUserInteraction);
  window.addEventListener("keydown", handleUserInteraction);

  return () => {
    window.removeEventListener("click", handleUserInteraction);
    window.removeEventListener("scroll", handleUserInteraction);
    window.removeEventListener("keydown", handleUserInteraction);
  };
}, [hasInteracted]);

    // Auth check effect
    useEffect(() => {
        const token = localStorage.getItem("token")
        setauthToken(token)
        if (token) {
            getProfile()
        } else {
            if (window.location.pathname === "/dashboard") {
                window.location.replace("/")
            }
            setLoading(false)
        }
    }, [])

    // useEffect(() => {
    //     getProfile();
    // },[update])

    return (
        <Globalcontext.Provider value={{
            profile,
            loading,
            Logout,
            updateProfile,
            allProfile,
            openPopup: showPopup,
            closePopup,
            show, setShow,
            update, setupdate,
            selectedCountries,
            setSelectedCountries,
            addCountry,
            removeCountry
        }}>
            {children}
            <PopupForm
                isOpen={isPopupOpen}
                onClose={closePopup} // Pass the closePopup that accepts "wasSubmitted" param
                onSubmit={handleFormSubmit}
            />
        </Globalcontext.Provider>
    )
}

export function useGlobal() {
    const context = useContext(Globalcontext)
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
