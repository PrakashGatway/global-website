"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import axiosInstance from "@/app/axiosInstance";

const useFirebaseNotification = (userId) => {
  useEffect(() => {
    // ALWAYS call the hook, but EXIT early if data is missing.
    // This keeps the dependency array size constant.
    if (!messaging || !userId) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Permission denied");
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: "BDyrqnEnHplqPQDrfienXIeY4eo49-eCp3Sq7kp78t1RXwPWnUpILuTdBJXY2Isu5fZNX6fDV1FhF6m7yP0Hr2s"
        });

        await axiosInstance.post('/users/save-token', {
          userId,
          fcmToken: token
        });

        const unsubscribe = onMessage(messaging, (payload) => {
          toast.success(payload.notification.title);
          new Notification(payload.notification.title, {
            body: payload.notification.body,
          });
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase Notification Error:", error);
      }
    };

    requestPermission();
  }, [userId]); // Fixed size of 1
};

export default useFirebaseNotification;
