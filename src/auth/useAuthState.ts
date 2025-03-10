import { Auth, AuthError, onAuthStateChanged, User } from "firebase/auth";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useListen, UseListenOnChange } from "../internal/useListen";
import { LoadingState } from "../internal/useLoadingValue";

export type UseAuthStateResult = ValueHookResult<User | null, AuthError>;

/**
 * Returns and updates the currently authenticated user
 *
 * @param {Auth} auth Firebase Auth instance
 * @returns {UseAuthStateResult} User, loading state, and error
 * * value: User; `undefined` if user is currently being fetched, or an error occurred
 * * loading: `true` while fetching the user; `false` if the user was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useAuthState(auth: Auth): UseAuthStateResult {
    const onChange: UseListenOnChange<User | null, AuthError, Auth> = useCallback(
        (stableAuth, next, error) => onAuthStateChanged(stableAuth, next, (e) => error(e as AuthError)),
        []
    );

    return useListen(auth, onChange, () => true, auth.currentUser ? auth.currentUser : LoadingState);
}
