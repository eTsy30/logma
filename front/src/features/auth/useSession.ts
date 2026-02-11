// 'use client';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// import { useLazyGetUserQuery } from 'redux/auth/api';
// import { logout } from 'redux/auth/slice';
// import { type AppDispatch, type RootState } from 'redux/store';

// export function useSession() {
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const [isSessionLoading, setIsSessionLoading] = useState(true);
//   const [getUser] = useLazyGetUserQuery();
//   const initialized = useRef(false);

//   const handleSessionError = useCallback(() => {
//     dispatch(logout());
//   }, [dispatch]);

//   const validateOrRefreshToken = useCallback(
//     async (token: string) => {
//       const decoded = jwtDecode(token);
//       const now = Date.now() / 1000;

//       if (!decoded.exp || decoded.exp < now) {
//         await getUser().unwrap();
//       }
//     },
//     [getUser],
//   );

//   useEffect(() => {
//     if (initialized.current) return;

//     const initializeSession = async () => {
//       const token = Cookies.get('access_token');
//       if (!token) {
//         handleSessionError();
//         return;
//       }

//       try {
//         await validateOrRefreshToken(token);
//         // await dispatch().unwrap();
//       } catch {
//         handleSessionError();
//       } finally {
//         setIsSessionLoading(false);
//         initialized.current = true;
//       }
//     };

//     initializeSession();
//   }, [dispatch, validateOrRefreshToken, handleSessionError]);

//   return {
//     user,
//     isLoading: isSessionLoading,
//   };
// }
