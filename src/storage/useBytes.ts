import { getBytes, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useOnce } from "../internal/useOnce";
import { isStorageRefEqual } from "./internal";

export type UseBytesResult = ValueHookResult<ArrayBuffer, StorageError>;

/**
 * Returns the data of a Google Cloud Storage object
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @param {?number} maxDownloadSizeBytes If set, the maximum allowed size in bytes to retrieve
 * @returns {UseBytesResult} Data, loading state, and error
 * * value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useBytes(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseBytesResult {
    const fetchBytes = useCallback(
        async (ref: StorageReference) => getBytes(ref, maxDownloadSizeBytes),
        [maxDownloadSizeBytes]
    );

    return useOnce(reference ?? undefined, fetchBytes, isStorageRefEqual);
}
